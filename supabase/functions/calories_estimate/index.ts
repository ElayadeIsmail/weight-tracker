import { encodeBase64 } from "jsr:@std/encoding@1/base64";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? "";
const GROQ_MODEL = Deno.env.get("GROQ_MODEL") ?? "qwen/qwen3.6-27b";
const GROQ_API_BASE = "https://api.groq.com/openai/v1";
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const PROMPT = [
  "Estimate nutrition for a food log from this photo.",
  "Mentally break into components (scoops, sauce, toppings, biscuits, cream, sides), estimate each, then sum.",
  "Prefer slightly high over optimistic low for desserts/fried/cream/chocolate.",
  "Typical: ice cream 200-270 kcal/scoop; chocolate/caramel sauce 80-200; cookie/biscotti 80-150 each.",
  "Return JSON with keys: is_food, dish_name, serving, items, calories_kcal, protein_g, carbohydrates_g, fat_g, fiber_g, confidence.",
  'items is a short semicolon list like "3 scoops ice cream; chocolate sauce; 2 biscotti".',
  "confidence is 0-1. If not food: is_food false and zeros/empty strings.",
].join(" ");

type NutritionEstimate = {
  is_food: boolean;
  dish_name: string;
  serving: string;
  items: string;
  calories_kcal: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
  fiber_g: number;
  confidence: number;
};

type ImagePayload = {
  base64: string;
  mimeType: string;
};

class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function toErrorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return json({ error: error.message }, error.status);
  }
  console.error(error);
  return json({ error: "Failed to estimate nutrition" }, 502);
}

function num(value: unknown, field: string) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) {
    throw new HttpError(502, `Invalid ${field} in model response`);
  }
  return Math.round(n * 10) / 10;
}

function reconcileCalories(
  calories: number,
  proteinG: number,
  carbohydratesG: number,
  fatG: number,
) {
  const fromMacros = proteinG * 4 + carbohydratesG * 4 + fatG * 9;
  if (fromMacros <= 0) return Math.round(calories);
  const drift = Math.abs(fromMacros - calories) / fromMacros;
  return Math.round(drift > 0.15 ? fromMacros : calories);
}

function extractJsonObject(text: string) {
  const cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```(?:json)?\s*([\s\S]*?)```/gi, "$1")
    .trim();

  const start = cleaned.indexOf("{");
  if (start < 0) {
    throw new HttpError(502, "Nutrition model returned no JSON");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i]!;
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return cleaned.slice(start, i + 1);
    }
  }

  throw new HttpError(502, "Nutrition model returned no JSON");
}

function parseNutritionEstimate(text: string): NutritionEstimate {
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(extractJsonObject(text)) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    console.error("Failed to parse nutrition JSON:", text.slice(0, 500));
    throw new HttpError(502, "Nutrition model returned invalid JSON");
  }

  const confidence = Math.min(1, num(raw.confidence ?? 0, "confidence"));
  if (!raw.is_food) {
    return {
      is_food: false,
      dish_name: "",
      serving: "",
      items: "",
      calories_kcal: 0,
      protein_g: 0,
      carbohydrates_g: 0,
      fat_g: 0,
      fiber_g: 0,
      confidence,
    };
  }

  const dishName = typeof raw.dish_name === "string"
    ? raw.dish_name.trim()
    : "";
  if (!dishName) {
    throw new HttpError(502, "Nutrition model omitted dish_name");
  }

  const proteinG = num(raw.protein_g, "protein_g");
  const carbohydratesG = num(raw.carbohydrates_g, "carbohydrates_g");
  const fatG = num(raw.fat_g, "fat_g");

  return {
    is_food: true,
    dish_name: dishName,
    serving: typeof raw.serving === "string" ? raw.serving.trim() : "",
    items: typeof raw.items === "string" ? raw.items.trim() : "",
    calories_kcal: reconcileCalories(
      num(raw.calories_kcal, "calories_kcal"),
      proteinG,
      carbohydratesG,
      fatG,
    ),
    protein_g: proteinG,
    carbohydrates_g: carbohydratesG,
    fat_g: fatG,
    fiber_g: num(raw.fiber_g ?? 0, "fiber_g"),
    confidence,
  };
}

function normalizeMimeType(mimeType: string) {
  const normalized = mimeType.toLowerCase().split(";")[0]?.trim() ?? "";
  return normalized === "image/jpg" ? "image/jpeg" : normalized;
}

function assertImage(mimeType: string, bytes: number) {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new HttpError(400, `Unsupported image type: ${mimeType}`);
  }
  if (bytes <= 0) throw new HttpError(400, "Invalid image data");
  if (bytes > MAX_IMAGE_BYTES) {
    throw new HttpError(400, "Image exceeds the 2MB size limit");
  }
}

function parseDataUrl(value: string) {
  const match = value.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match) {
    return {
      mimeType: null as string | null,
      base64: value.replace(/\s/g, ""),
    };
  }
  return {
    mimeType: match[1]!,
    base64: match[2]!.replace(/\s/g, ""),
  };
}

function estimateBase64Bytes(base64: string) {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

async function extractImage(req: Request): Promise<ImagePayload> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const file = (await req.formData()).get("image");
    if (!(file instanceof File)) {
      throw new HttpError(400, 'Expected a file field named "image"');
    }
    const mimeType = normalizeMimeType(file.type || "image/jpeg");
    assertImage(mimeType, file.size);
    return {
      base64: encodeBase64(new Uint8Array(await file.arrayBuffer())),
      mimeType,
    };
  }

  let body: { image?: unknown; mimeType?: unknown };
  try {
    body = await req.json();
  } catch {
    throw new HttpError(
      400,
      "Request body must be JSON or multipart/form-data",
    );
  }

  if (typeof body.image !== "string" || !body.image) {
    throw new HttpError(
      400,
      'Missing image. Send { "image": "<base64 or data URL>" }',
    );
  }

  const { mimeType: dataUrlMime, base64 } = parseDataUrl(body.image.trim());
  const mimeType = normalizeMimeType(
    dataUrlMime ??
      (typeof body.mimeType === "string" ? body.mimeType : "image/jpeg"),
  );
  assertImage(mimeType, estimateBase64Bytes(base64));
  return { base64, mimeType };
}

async function estimateNutrition(
  image: ImagePayload,
  apiKey: string,
  model: string,
): Promise<NutritionEstimate> {
  const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_completion_tokens: 2048,
      reasoning_effort: "default",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            {
              type: "image_url",
              image_url: {
                url: `data:${image.mimeType};base64,${image.base64}`,
              },
            },
          ],
        },
      ],
    }),
  });

  const payload = await response.json() as {
    choices?: Array<{ message?: { content?: string | null } }>;
    error?: { message?: string; failed_generation?: string };
  };

  if (!response.ok) {
    console.error("Groq error:", payload.error);
    if (payload.error?.failed_generation) {
      try {
        return parseNutritionEstimate(payload.error.failed_generation);
      } catch {
        // fall through
      }
    }
    throw new HttpError(
      502,
      payload.error?.message ?? "Nutrition model request failed",
    );
  }

  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new HttpError(502, "Nutrition model returned an empty response");
  }
  return parseNutritionEstimate(content);
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    try {
      if (req.method !== "POST") {
        throw new HttpError(405, "Method not allowed");
      }
      if (!GROQ_API_KEY) {
        throw new HttpError(500, "GROQ_API_KEY is not configured");
      }
      if (!ctx.userClaims?.id) {
        throw new HttpError(401, "Unauthorized");
      }

      const image = await extractImage(req);
      const estimate = await estimateNutrition(image, GROQ_API_KEY, GROQ_MODEL);
      return json({ estimate });
    } catch (error) {
      return toErrorResponse(error);
    }
  }),
};

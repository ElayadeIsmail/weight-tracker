import { supabase } from "@/lib/supabase";
import type { PickedMealImage } from "@/types/meal";
import { base64ToArrayBuffer } from "@/utils/base64";

const BUCKET = "meal-photos";

function extensionForMime(mimeType: string) {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

async function imageToArrayBuffer(image: PickedMealImage): Promise<ArrayBuffer> {
  if (image.base64) {
    return base64ToArrayBuffer(image.base64);
  }

  // Fallback when base64 wasn't captured (e.g. older callers).
  const response = await fetch(image.uri);
  if (!response.ok) {
    throw new Error("Failed to read meal photo for upload.");
  }
  return response.arrayBuffer();
}

export async function uploadMealPhoto(
  userId: string,
  entryDate: string,
  image: PickedMealImage,
): Promise<string> {
  const mimeType = image.mimeType || "image/jpeg";
  const ext = extensionForMime(mimeType);
  const path = `${userId}/${entryDate}/${Date.now()}.${ext}`;
  const bytes = await imageToArrayBuffer(image);

  if (bytes.byteLength <= 0) {
    throw new Error("Meal photo data was empty.");
  }

  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: mimeType,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteMealPhoto(imageUrl: string | null | undefined) {
  if (!imageUrl) return;

  const marker = `/object/public/${BUCKET}/`;
  const index = imageUrl.indexOf(marker);
  if (index < 0) return;

  const path = decodeURIComponent(imageUrl.slice(index + marker.length));
  if (!path) return;

  await supabase.storage.from(BUCKET).remove([path]);
}

import * as v from "valibot";

export { fieldErrorsFromIssues } from "@/components/ui/form/field-errors";

const passwordSchema = v.pipe(
  v.string(),
  v.minLength(8, "Password must be at least 8 characters."),
  v.regex(/[A-Z]/, "Must contain an uppercase letter."),
  v.regex(/[a-z]/, "Must contain a lowercase letter."),
  v.regex(/\d/, "Must contain a number."),
  v.regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character."),
);

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email("Enter a valid email address.")),
  password: v.pipe(v.string(), v.nonEmpty("Password is required.")),
});

export const signupSchema = v.pipe(
  v.object({
    displayName: v.pipe(v.string(), v.nonEmpty("Name is required.")),
    email: v.pipe(v.string(), v.email("Enter a valid email address.")),
    password: passwordSchema,
    confirmPassword: v.string(),
  }),
  v.forward(
    v.check(
      ({ password, confirmPassword }) => password === confirmPassword,
      "Passwords do not match.",
    ),
    ["confirmPassword"],
  ),
);

export type LoginValues = v.InferOutput<typeof loginSchema>;
export type SignupValues = v.InferOutput<typeof signupSchema>;
export type AuthValues = LoginValues | SignupValues;

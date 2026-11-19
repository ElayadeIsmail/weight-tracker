import type { SignupValues } from "./schema";

export const signupDefaultValues = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
} satisfies SignupValues;

export const LABELS = {
  signup: {
    submit: "Create account",
    switch: "Have an account? Log in",
  },
  login: {
    submit: "Log in",
    switch: "Need an account? Sign up",
  },
} as const;

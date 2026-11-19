export type AuthMode = "login" | "signup";

export type AuthSubmitInput = {
  email: string;
  password: string;
  displayName?: string;
};

export type AuthFormProps = Readonly<{
  mode: AuthMode;
  onSubmit: (input: AuthSubmitInput) => Promise<void>;
  onSwitch: () => void;
}>;

import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "@tanstack/react-form";
import * as v from "valibot";

import { Button } from "../ui/button";
import { FormMessage } from "../ui/form/form-message";
import { LABELS, signupDefaultValues } from "./config";
import { FormTextField } from "./form-text-field";
import { fieldErrorsFromIssues, loginSchema, signupSchema } from "./schema";
import type { AuthFormProps } from "./types";
import { Spacing } from "@/constants/theme";

export function AuthForm({ mode, onSubmit, onSwitch }: AuthFormProps) {
  const isLogin = mode === "login";
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: signupDefaultValues,
    validators: {
      onSubmit: ({ value }) => {
        const result = isLogin
          ? v.safeParse(loginSchema, {
              email: value.email,
              password: value.password,
            })
          : v.safeParse(signupSchema, value);

        if (result.success) {
          return undefined;
        }

        return { fields: fieldErrorsFromIssues(result.issues) };
      },
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await onSubmit({
          email: value.email.trim(),
          password: value.password,
          ...(isLogin ? {} : { displayName: value.displayName.trim() }),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
  });

  const labels = LABELS[mode];

  return (
    <View style={styles.form}>
      {!isLogin ? (
        <FormTextField
          form={form}
          name="displayName"
          label="Name"
          placeholder="Your name"
          autoCapitalize="words"
        />
      ) : null}

      <FormTextField
        form={form}
        name="email"
        label="Email"
        placeholder="you@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormTextField
        form={form}
        name="password"
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
      />

      {!isLogin ? (
        <FormTextField
          form={form}
          name="confirmPassword"
          label="Confirm password"
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
        />
      ) : null}

      {error ? <FormMessage>{error}</FormMessage> : null}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            label={isSubmitting ? "Please wait…" : labels.submit}
            disabled={isSubmitting}
            onPress={() => {
              void form.handleSubmit();
            }}
          />
        )}
      </form.Subscribe>

      <Button variant="secondary" label={labels.switch} onPress={onSwitch} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
  },
});

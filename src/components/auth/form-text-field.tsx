import type { ComponentProps } from "react";
import type {
  DeepKeys,
  DeepValue,
  ReactFormExtendedApi,
} from "@tanstack/react-form";

import { errorToString } from "../ui/form/error-to-string";
import { TextField } from "../ui/form/text-field";

type TextFieldOwnProps = Omit<
  ComponentProps<typeof TextField>,
  "value" | "onChangeText" | "onBlur" | "error"
>;

type FormTextFieldProps<
  TFormData extends Record<string, unknown>,
  TName extends DeepKeys<TFormData>,
> = TextFieldOwnProps & {
  form: ReactFormExtendedApi<
    TFormData,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
  name: DeepValue<TFormData, TName> extends string ? TName : never;
};

export function FormTextField<
  TFormData extends Record<string, unknown>,
  TName extends DeepKeys<TFormData>,
>({ form, name, ...props }: FormTextFieldProps<TFormData, TName>) {
  return (
    <form.Field name={name}>
      {(field) => (
        <TextField
          {...props}
          value={field.state.value as string}
          onChangeText={(value) => field.handleChange(value as never)}
          onBlur={field.handleBlur}
          error={errorToString(field.state.meta.errors[0])}
        />
      )}
    </form.Field>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "./form-input";
import { SubmitButton } from "./submit-button";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;
type LoginErrors = Partial<Record<keyof LoginValues | "form", string>>;

export function LoginForm() {
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [pending, setPending] = useState(false);

  function updateField<K extends keyof LoginValues>(key: K, value: LoginValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setPending(true);
    setErrors({});
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    toast.success("Frontend-only sign in screen ready.");
    setPending(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormInput
        autoComplete="email"
        error={errors.email}
        label="Email"
        onChange={(event) => updateField("email", event.target.value)}
        placeholder="you@example.com"
        type="email"
        value={values.email}
      />
      <FormInput
        autoComplete="current-password"
        error={errors.password}
        label="Password"
        onChange={(event) => updateField("password", event.target.value)}
        placeholder="Enter your password"
        type="password"
        value={values.password}
      />

      {errors.form ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
          {errors.form}
        </div>
      ) : null}

      <SubmitButton
        label="Sign in"
        loadingLabel="Signing in..."
        pending={pending}
      />
    </form>
  );
}

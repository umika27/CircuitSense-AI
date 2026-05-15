"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "./form-input";
import { SubmitButton } from "./submit-button";

const signupSchema = z.object({
  name: z.string().max(80, "Name must be 80 characters or less.").optional(),
  email: z.email("Enter a valid email address."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be 128 characters or less."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((values) => values.password === values.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

type SignupValues = {
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
};

type SignupErrors = Partial<Record<keyof SignupValues | "form", string>>;

export function SignupForm() {
  const router = useRouter();
  const [values, setValues] = useState<SignupValues>({
    name: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [pending, setPending] = useState(false);

  function getConfirmPasswordError(password: string, confirmPassword: string) {
    if (!confirmPassword) {
      return undefined;
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return undefined;
  }

  function updateField<K extends keyof SignupValues>(
    key: K,
    value: SignupValues[K],
  ) {
    const nextValues = { ...values, [key]: value };

    setValues(nextValues);
    setErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
      form: undefined,
      confirmPassword: getConfirmPasswordError(
        nextValues.password,
        nextValues.confirmPassword,
      ),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = signupSchema.safeParse({
      name: values.name.trim() || undefined,
      email: values.email.trim(),
      dateOfBirth: values.dateOfBirth,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        dateOfBirth: fieldErrors.dateOfBirth?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setPending(true);
    setErrors({});
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    toast.success("Account created. Please sign in.");
    router.push("/login");
    router.refresh();
    setPending(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormInput
        autoComplete="name"
        error={errors.name}
        label="Name"
        onChange={(event) => updateField("name", event.target.value)}
        placeholder="Optional"
        type="text"
        value={values.name}
      />
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
        autoComplete="bday"
        error={errors.dateOfBirth}
        label="Date of birth"
        onChange={(event) => updateField("dateOfBirth", event.target.value)}
        type="date"
        value={values.dateOfBirth}
      />
      <FormInput
        autoComplete="new-password"
        error={errors.password}
        label="Password"
        onChange={(event) => updateField("password", event.target.value)}
        placeholder="At least 8 characters"
        type="password"
        value={values.password}
      />
      <FormInput
        autoComplete="new-password"
        error={errors.confirmPassword}
        label="Confirm password"
        onChange={(event) => updateField("confirmPassword", event.target.value)}
        placeholder="Re-enter your password"
        type="password"
        value={values.confirmPassword}
      />

      {errors.form ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
          {errors.form}
        </div>
      ) : null}

      <SubmitButton
        label="Create account"
        loadingLabel="Creating account..."
        pending={pending}
      />
    </form>
  );
}

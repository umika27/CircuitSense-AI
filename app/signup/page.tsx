import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Get started in a minute"
      description="Set up your account with a secure email and password."
      footerLabel="Already have an account?"
      footerHref="/login"
      footerText="Sign in"
    >
      <SignupForm />
    </AuthShell>
  );
}

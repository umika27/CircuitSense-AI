import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Use your email and password to continue to your dashboard."
      footerLabel="Need an account?"
      footerHref="/signup"
      footerText="Create one"
    >
      <LoginForm />
    </AuthShell>
  );
}

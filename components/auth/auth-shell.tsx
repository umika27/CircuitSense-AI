import Link from "next/link";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  footerLabel: string;
  footerHref: string;
  footerText: string;
  children: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  footerLabel,
  footerHref,
  footerText,
  children,
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(245,245,244,0.2)_45%,transparent_70%)]" />
      <div className="relative w-full max-w-md rounded-[28px] border bg-card p-8 shadow-card sm:p-10">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-medium text-muted">{eyebrow}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm leading-6 text-muted">{description}</p>
        </div>

        {children}
        {footerHref && (
          <div className="mt-6 text-sm text-center text-gray-600">
            {footerLabel}{" "}
            <Link href={footerHref} className="text-black font-medium">
              {footerText}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

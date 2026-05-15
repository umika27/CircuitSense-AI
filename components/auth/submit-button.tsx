"use client";

type SubmitButtonProps = {
  label: string;
  loadingLabel: string;
  pending: boolean;
};

export function SubmitButton({
  label,
  loadingLabel,
  pending,
}: SubmitButtonProps) {
  return (
    <button
      className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-accent px-4 text-sm font-medium text-accentForeground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? loadingLabel : label}
    </button>
  );
}

"use client";

import { Loader2, Zap } from "lucide-react";

export function AnalyzeButton({
  isLoading,
  message,
  disabled,
}: {
  isLoading: boolean;
  message: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 px-6 py-4 text-base font-semibold text-slate-950 shadow-card transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
      <span>{isLoading ? message : "Analyze circuit"}</span>
    </button>
  );
}

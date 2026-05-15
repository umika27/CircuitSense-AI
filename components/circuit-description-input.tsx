"use client";

import { Sparkles } from "lucide-react";

export function CircuitDescriptionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-200">
        <Sparkles className="h-4 w-4" />
        Natural language input
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe the circuit, symptoms, component values, supply rails, or the output you expected..."
        className="min-h-[220px] w-full resize-none rounded-2xl border border-white/10 bg-black/25 p-4 text-base leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:ring-4 focus:ring-emerald-300/10"
      />
    </div>
  );
}

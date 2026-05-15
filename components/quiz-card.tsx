"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CircuitAnalysis } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function QuizCard({
  question,
  index,
}: {
  question: CircuitAnalysis["quiz_questions"][number];
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <button
      type="button"
      onClick={() => setOpen((value) => !value)}
      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-emerald-300/30 hover:bg-emerald-300/[0.06]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
            Question {index + 1}
          </p>
          <p className="mt-2 font-medium text-white">{question.question}</p>
        </div>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-slate-400 transition", open && "rotate-180")}
        />
      </div>
      {open && <p className="mt-4 leading-7 text-slate-300">{question.answer}</p>}
    </button>
  );
}

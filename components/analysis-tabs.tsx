"use client";

import { useState } from "react";
import { Activity, Bug, Cpu, FileCode2, Lightbulb, ListChecks } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { QuizCard } from "@/components/quiz-card";
import type { CircuitAnalysis } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "analysis", label: "Circuit Analysis", icon: Cpu },
  { id: "debugging", label: "Debugging", icon: Bug },
  { id: "spice", label: "SPICE Netlist", icon: FileCode2 },
  { id: "quiz", label: "Quiz", icon: Lightbulb },
] as const;

type TabId = (typeof tabs)[number]["id"];

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ListBlock({
  title,
  items,
  tone = "sky",
}: {
  title: string;
  items: string[];
  tone?: "sky" | "emerald";
}) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
        <ListChecks className={cn("h-5 w-5", tone === "sky" ? "text-sky-300" : "text-emerald-300")} />
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-slate-300">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export function AnalysisTabs({ analysis }: { analysis: CircuitAnalysis }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border px-4 text-sm font-medium transition",
                active
                  ? "border-sky-300/50 bg-sky-300/15 text-sky-100"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-5">
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-sky-200">{analysis.circuit_category}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{analysis.circuit_name}</h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-300">{analysis.summary}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Pill label="Purpose" value={analysis.purpose} />
              <Pill label="Difficulty" value={analysis.difficulty} />
              <Pill label="Components" value={`${analysis.components.length}`} />
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6">
              <ListBlock title="Working principle" items={analysis.working_principle} />
              <ListBlock title="Key equations" items={analysis.key_equations} tone="emerald" />
            </div>
            <div className="space-y-6">
              <section>
                <h3 className="mb-3 text-lg font-semibold text-white">Components</h3>
                <div className="space-y-3">
                  {analysis.components.map((component) => (
                    <div key={`${component.name}-${component.role}`} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="font-semibold text-white">{component.name}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{component.role}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="mb-3 text-lg font-semibold text-white">Expected values</h3>
                <div className="grid gap-3">
                  {analysis.expected_values.map((item) => (
                    <Pill key={`${item.parameter}-${item.value}`} label={item.parameter} value={item.value} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === "debugging" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <ListBlock title="Common errors" items={analysis.common_errors} />
            <ListBlock title="Debug steps" items={analysis.debug_steps} tone="emerald" />
            <ListBlock title="Optimizations" items={analysis.optimizations} />
          </div>
        )}

        {activeTab === "spice" && <CodeBlock code={analysis.spice_netlist} />}

        {activeTab === "quiz" && (
          <div className="space-y-3">
            {analysis.quiz_questions.map((question, index) => (
              <QuizCard key={question.question} question={question} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

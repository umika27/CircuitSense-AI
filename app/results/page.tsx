"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Cpu, RotateCcw } from "lucide-react";
import { AnalysisTabs } from "@/components/analysis-tabs";
import { analysisSchema, type CircuitAnalysis } from "@/lib/schemas";

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<CircuitAnalysis | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("circuitsense:last-analysis");
    if (raw) {
      try {
        const parsed = analysisSchema.safeParse(JSON.parse(raw));
        if (parsed.success) {
          setAnalysis(parsed.data);
        }
      } catch {
        setAnalysis(null);
      }
    }
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-sky-300/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            New analysis
          </Link>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-3 text-emerald-200">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-white">CircuitSense Results</p>
              <p className="text-sm text-muted">Structured circuit intelligence</p>
            </div>
          </div>
        </header>

        {loaded && analysis ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <AnalysisTabs analysis={analysis} />
          </motion.div>
        ) : (
          <div className="glass-panel rounded-2xl p-8 text-center">
            <RotateCcw className="mx-auto h-10 w-10 text-sky-300" />
            <h1 className="mt-4 text-2xl font-semibold text-white">No analysis yet</h1>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-300">
              Upload a circuit image or enter a description first, then the structured analysis will
              appear here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-sky-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-200"
            >
              Start analysis
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

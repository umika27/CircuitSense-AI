"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, FileCode2, Gauge, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { AnalyzeButton } from "@/components/analyze-button";
import { CircuitDescriptionInput } from "@/components/circuit-description-input";
import { UploadCard } from "@/components/upload-card";

const examplePrompts = [
  "Explain this common emitter amplifier",
  "Debug my LED circuit",
  "Generate LTspice for a voltage divider",
];

const loadingMessages = [
  "Identifying components...",
  "Solving equations...",
  "Generating SPICE netlist...",
  "Preparing quiz questions...",
];

const featureCards = [
  { icon: Cpu, label: "Interpret circuit diagrams" },
  { icon: Gauge, label: "Predict expected outputs" },
  { icon: FileCode2, label: "Export LTspice netlists" },
  { icon: GraduationCap, label: "Learn through guided quiz questions" },
];

export default function HomePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!isLoading) {
      setMessageIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % loadingMessages.length);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [isLoading]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file && !description.trim()) {
      toast.error("Upload a circuit image or enter a description.");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    if (description.trim()) {
      formData.append("description", description.trim());
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Analysis failed.");
      }

      sessionStorage.setItem("circuitsense:last-analysis", JSON.stringify(payload));
      toast.success("Circuit analysis ready");
      router.push("/results");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not analyze circuit.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-sky-300/25 bg-sky-300/10 p-3 text-sky-200">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">CircuitSense AI</p>
              <p className="text-sm text-muted">Intelligent lab assistant</p>
            </div>
          </div>
        </header>

        <section className="grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <p className="mb-4 inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-200">
              Your AI Circuit Copilot
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
              CircuitSense AI
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Turn schematics and rough descriptions into educational analysis, debugging paths,
              expected values, and LTspice-ready netlists.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-slate-200 backdrop-blur-xl"
                  >
                    <Icon className="mb-3 h-5 w-5 text-sky-300" />
                    <p className="text-sm font-medium">{feature.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="space-y-4"
          >
            <UploadCard file={file} previewUrl={previewUrl} onFileChange={setFile} />
            <CircuitDescriptionInput value={description} onChange={setDescription} />

            <div className="glass-panel rounded-2xl p-4">
              <p className="mb-3 text-sm font-medium text-slate-300">Example prompts</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setDescription(prompt)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:border-sky-300/40 hover:text-white"
                  >
                    {prompt}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <AnalyzeButton
                isLoading={isLoading}
                message={loadingMessages[messageIndex]}
                disabled={!file && !description.trim()}
              />
            </div>
          </motion.form>
        </section>
      </div>
    </main>
  );
}

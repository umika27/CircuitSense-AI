import { z } from "zod";

export const componentSchema = z.object({
  name: z.string(),
  role: z.string(),
});

export const expectedValueSchema = z.object({
  parameter: z.string(),
  value: z.string(),
});

export const quizQuestionSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const analysisSchema = z.object({
  circuit_name: z.string(),
  circuit_category: z.string(),
  purpose: z.string(),
  difficulty: z.string(),
  summary: z.string(),
  components: z.array(componentSchema),
  working_principle: z.array(z.string()),
  key_equations: z.array(z.string()),
  expected_values: z.array(expectedValueSchema),
  common_errors: z.array(z.string()),
  debug_steps: z.array(z.string()),
  optimizations: z.array(z.string()),
  spice_netlist: z.string(),
  quiz_questions: z.array(quizQuestionSchema),
});

export type CircuitAnalysis = z.infer<typeof analysisSchema>;

export const fallbackAnalysis: CircuitAnalysis = {
  circuit_name: "Circuit analysis unavailable",
  circuit_category: "Unknown",
  purpose: "The model response could not be parsed into the expected structure.",
  difficulty: "Unknown",
  summary:
    "Try adding clearer component labels, visible values, or a more specific natural-language description.",
  components: [],
  working_principle: [],
  key_equations: [],
  expected_values: [],
  common_errors: ["The AI response was not valid JSON."],
  debug_steps: [
    "Resubmit with a sharper schematic image or a more explicit circuit description.",
    "Include supply voltages, component values, input signal, and expected output.",
  ],
  optimizations: ["Use labeled nodes and standard reference designators."],
  spice_netlist: "* LTspice netlist unavailable: invalid model JSON response",
  quiz_questions: [
    {
      question: "What information helps identify a circuit accurately?",
      answer: "Clear component labels, values, supply rails, inputs, outputs, and ground nodes.",
    },
  ],
};

import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { analysisSchema, fallbackAnalysis, type CircuitAnalysis } from "@/lib/schemas";

export const CIRCUIT_SYSTEM_PROMPT = `You are an expert electronics engineer, educator, and circuit debugging assistant.

Analyze the provided circuit image or circuit description.

Return ONLY valid JSON following the exact schema provided.

Your goals:
1. Identify the circuit type.
2. Explain how the circuit works.
3. Compute key formulas and expected values.
4. Identify common mistakes.
5. Suggest debugging steps.
6. Generate a valid LTspice netlist.
7. Suggest improvements.
8. Create 3 conceptual quiz questions with answers.

Be precise, educational, and concise.`;

const schemaTemplate = {
  circuit_name: "Non-Inverting Op-Amp Amplifier",
  circuit_category: "Analog",
  purpose: "Amplifies input signal without phase inversion",
  difficulty: "Intermediate",
  summary: "This circuit uses an operational amplifier to amplify the input.",
  components: [{ name: "R1", role: "Sets gain with R2" }],
  working_principle: [
    "Input is applied to the non-inverting terminal.",
    "Feedback stabilizes the gain.",
  ],
  key_equations: ["Gain = 1 + R2/R1"],
  expected_values: [{ parameter: "Gain", value: "11" }],
  common_errors: ["Incorrect power supply", "Swapped op-amp terminals"],
  debug_steps: ["Verify supply voltages.", "Check resistor values."],
  optimizations: ["Use precision resistors."],
  spice_netlist: "* LTspice netlist...",
  quiz_questions: [{ question: "What is the gain formula?", answer: "1 + R2/R1" }],
};

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY or GOOGLE_API_KEY.");
  }

  return new GoogleGenerativeAI(apiKey);
}

export function parseAnalysisJson(text: string): CircuitAnalysis {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const jsonStart = withoutFence.indexOf("{");
  const jsonEnd = withoutFence.lastIndexOf("}");
  const candidate =
    jsonStart >= 0 && jsonEnd > jsonStart
      ? withoutFence.slice(jsonStart, jsonEnd + 1)
      : withoutFence;

  try {
    return analysisSchema.parse(JSON.parse(candidate));
  } catch {
    return {
      ...fallbackAnalysis,
      summary:
        "Gemini returned a response, but it was not valid JSON matching the CircuitSense schema.",
      spice_netlist: `* Invalid JSON response from AI\n* Raw response excerpt:\n* ${trimmed
        .slice(0, 420)
        .replaceAll("\n", "\n* ")}`,
    };
  }
}

export async function analyzeCircuit({
  description,
  image,
}: {
  description?: string;
  image?: { mimeType: string; base64: string };
}) {
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const model = getGeminiClient().getGenerativeModel({
    model: modelName,
    systemInstruction: CIRCUIT_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.25,
      responseMimeType: "application/json",
    },
  });

  const parts: Part[] = [
    {
      text: `Analyze this circuit and return the structured JSON response.\n\nSchema example:\n${JSON.stringify(
        schemaTemplate,
        null,
        2,
      )}\n\nCircuit description:\n${description || "No text description provided."}`,
    },
  ];

  if (image) {
    parts.push({
      inlineData: {
        mimeType: image.mimeType,
        data: image.base64,
      },
    });
  }

  const result = await model.generateContent(parts);
  return parseAnalysisJson(result.response.text());
}

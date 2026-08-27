import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1).max(20000),
});

type ResponsesOutput = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  error?: { message?: string };
  message?: string;
};

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured for this app.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.6-sol",
        input: [
          { role: "system", content: data.system },
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as ResponsesOutput;
      const message = body?.error?.message ?? body?.message ?? "AI request failed.";
      if (res.status === 429) throw new Error("Too many requests right now — please try again in a moment.");
      if (res.status === 402) throw new Error(message || "AI credits exhausted. Please add credits to continue.");
      throw new Error(message);
    }

    const json = (await res.json()) as ResponsesOutput;
    const text =
      json.output_text ??
      json.output
        ?.flatMap((item) => item.content ?? [])
        .map((c) => c.text ?? "")
        .join("")
        .trim();

    return { text: text && text.length > 0 ? text : "No response was generated. Try rephrasing your input." };
  });

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, ToolLayout, OutputPanel, useAI } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — IntenAI" },
      {
        name: "description",
        content: "Summarize topics or pasted articles and get insights, risks and clear recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant — IntenAI" },
      {
        property: "og:description",
        content: "Brief yourself fast: key takeaways, insights and next-step recommendations on any topic.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [mode, setMode] = useState("Topic briefing");
  const [depth, setDepth] = useState("Standard");
  const [text, setText] = useState("");
  const { run, result, error, loading } = useAI();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Research"
        title="AI Research Assistant"
        description="Explore a topic or paste an article — get a structured brief with insights and recommendations."
      />
      <ToolLayout
        input={
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Topic briefing">Topic briefing</SelectItem>
                    <SelectItem value="Article summary">Article summary (paste text)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Depth</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quick">Quick</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Deep dive">Deep dive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">{mode === "Topic briefing" ? "Topic or question" : "Article text"}</Label>
              <Textarea
                id="text"
                rows={12}
                placeholder={
                  mode === "Topic briefing"
                    ? "e.g. How are mid-sized retailers using AI for demand forecasting?"
                    : "Paste the article or report text here…"
                }
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={loading || text.trim().length < 5}
              onClick={() =>
                void run(
                  `You are a rigorous research analyst. Mode: ${mode}. Depth: ${depth}. Respond in markdown with: '## Executive Summary', '## Key Points', '## Insights', '## Risks & Caveats', '## Recommendations' (numbered, actionable), '## Suggested Next Steps'. State clearly when something is uncertain or when your knowledge may be outdated. Do not fabricate sources, statistics or citations.`,
                  text,
                )
              }
            >
              Research this
            </Button>
          </>
        }
        output={
          <OutputPanel
            loading={loading}
            error={error}
            result={result}
            placeholder="Your research brief will appear here."
          />
        }
      />
    </AppShell>
  );
}

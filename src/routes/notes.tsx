import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, ToolLayout, OutputPanel, useAI } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — IntenAI" },
      {
        name: "description",
        content:
          "Summarize long meeting notes and extract action items, decisions and deadlines automatically.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — IntenAI" },
      {
        property: "og:description",
        content: "Paste raw meeting notes and get a clean summary with owners, decisions and due dates.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const { run, result, error, loading } = useAI();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Productivity"
        title="Meeting Notes Summarizer"
        description="Paste messy notes or a transcript — get a structured summary with decisions, owners and deadlines."
      />
      <ToolLayout
        input={
          <>
            <div className="space-y-2">
              <Label htmlFor="notes">Meeting notes or transcript</Label>
              <Textarea
                id="notes"
                rows={16}
                placeholder="Paste your raw notes here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{notes.trim().split(/\s+/).filter(Boolean).length} words</p>
            </div>
            <Button
              className="w-full"
              disabled={loading || notes.trim().length < 20}
              onClick={() =>
                void run(
                  "You are a meticulous meeting analyst. Summarize notes into markdown with these sections in order: '## Summary' (3-5 bullets), '## Key Decisions', '## Action Items' (a markdown table with Task | Owner | Deadline), '## Deadlines & Dates', '## Open Questions'. Use 'Unassigned' or 'No date' when information is missing. Never invent facts.",
                  notes,
                )
              }
            >
              Summarize notes
            </Button>
          </>
        }
        output={
          <OutputPanel
            loading={loading}
            error={error}
            result={result}
            placeholder="Your summary, decisions and action items will appear here."
          />
        }
      />
    </AppShell>
  );
}

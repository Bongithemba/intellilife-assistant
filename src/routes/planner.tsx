import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, ToolLayout, OutputPanel, useAI } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Scheduler — IntenAI" },
      {
        name: "description",
        content: "Turn a task list into a prioritised daily or weekly schedule with time blocks and focus slots.",
      },
      { property: "og:title", content: "AI Task Planner & Scheduler — IntenAI" },
      {
        property: "og:description",
        content: "Prioritise tasks by urgency and impact, then get a realistic time-blocked plan.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [horizon, setHorizon] = useState("Daily");
  const [hours, setHours] = useState("8");
  const [start, setStart] = useState("09:00");
  const [tasks, setTasks] = useState("");
  const { run, result, error, loading } = useAI();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Planning"
        title="AI Task Planner"
        description="List what's on your plate. IntenAI prioritises it and builds a realistic, time-blocked schedule."
      />
      <ToolLayout
        input={
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Horizon</Label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours available</Label>
                <Input
                  id="hours"
                  type="number"
                  min={1}
                  max={80}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Start time</Label>
                <Input id="start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks (one per line, add deadlines if known)</Label>
              <Textarea
                id="tasks"
                rows={10}
                placeholder={"Finish Q3 report — due Friday\nCall supplier\nPrep client demo"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={loading || tasks.trim().length < 5}
              onClick={() =>
                void run(
                  "You are an expert productivity coach. Produce markdown with: '## Priority Ranking' (table: Task | Priority (P1-P3) | Impact | Effort | Why), '## Schedule' (time-blocked table with breaks and a deep-work block), '## Focus Tips' (3 short bullets). Be realistic about capacity and flag anything that will not fit under '## Overflow'.",
                  `Horizon: ${horizon}\nAvailable hours: ${hours}\nDay starts at: ${start}\nTasks:\n${tasks}`,
                )
              }
            >
              Build my schedule
            </Button>
          </>
        }
        output={
          <OutputPanel
            loading={loading}
            error={error}
            result={result}
            placeholder="Your prioritised schedule will appear here."
          />
        }
      />
    </AppShell>
  );
}

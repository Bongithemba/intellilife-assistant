import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell, NAV_ITEMS, Disclaimer } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IntenAI — AI Workplace Productivity Suite" },
      {
        name: "description",
        content:
          "IntenAI is an AI workspace for professional emails, meeting summaries, task planning, research briefs and an assistant chat.",
      },
      { property: "og:title", content: "IntenAI — AI Workplace Productivity Suite" },
      {
        property: "og:description",
        content: "Write, summarize, plan and research faster with one mobile-friendly AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = NAV_ITEMS.filter((item) => item.to !== "/");

function Dashboard() {
  return (
    <AppShell>
      <section className="panel relative overflow-hidden p-6 sm:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          AI workplace suite
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Do a day's work in <span className="text-gradient-brand">a few minutes</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          IntenAI brings drafting, summarizing, planning, research and an assistant chat into one clean,
          mobile-friendly workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Open assistant <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Write an email
          </Link>
        </div>
      </section>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Tools
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="panel group flex items-start gap-4 p-5 transition-colors hover:border-primary/50"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <tool.icon className="size-5" />
            </span>
            <span>
              <span className="flex items-center gap-1.5 font-medium">
                {tool.label}
                <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">{tool.blurb}</span>
            </span>
          </Link>
        ))}
      </div>

      <Disclaimer className="mt-8" />
    </AppShell>
  );
}

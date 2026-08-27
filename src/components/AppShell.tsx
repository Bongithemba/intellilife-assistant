import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  CalendarClock,
  Search,
  MessagesSquare,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, blurb: "Overview of your AI workspace" },
  { to: "/email", label: "Email Generator", icon: Mail, blurb: "Draft professional emails in any tone" },
  { to: "/notes", label: "Notes Summarizer", icon: NotebookPen, blurb: "Actions, decisions & deadlines" },
  { to: "/planner", label: "Task Planner", icon: CalendarClock, blurb: "Prioritised daily & weekly schedules" },
  { to: "/research", label: "Research Assistant", icon: Search, blurb: "Summaries, insights & recommendations" },
  { to: "/chat", label: "AI Assistant", icon: MessagesSquare, blurb: "Chat with your workplace copilot" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-primary/40",
          }}
        >
          <item.icon className="size-4.5 shrink-0 text-primary" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
        <Sparkles className="size-5" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Inten<span className="text-gradient-brand">AI</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-xl border border-border bg-card text-foreground"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 top-[61px] z-30 bg-background/95 px-4 py-4 backdrop-blur lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
          <Disclaimer className="mt-6" />
        </div>
      ) : null}

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Brand />
        <div className="mt-8 flex-1">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Workspace
          </p>
          <NavLinks />
        </div>
        <Disclaimer />
      </aside>

      <main className="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card/60 p-3", className)}>
      <p className="flex items-center gap-2 text-xs font-semibold text-accent">
        <ShieldAlert className="size-4" /> Responsible AI
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        IntenAI produces AI-generated content that can be inaccurate or biased. Always review outputs before
        sharing, and never enter confidential or personal data.
      </p>
    </div>
  );
}

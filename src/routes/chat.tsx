import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, SendHorizonal, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ToolPage";
import { runAI } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Assistant Chat — IntenAI" },
      {
        name: "description",
        content: "Chat with IntenAI, an interactive workplace assistant for drafting, planning and problem solving.",
      },
      { property: "og:title", content: "AI Workplace Assistant Chat — IntenAI" },
      {
        property: "og:description",
        content: "Ask questions, draft content and plan work in a conversational AI assistant.",
      },
    ],
  }),
  component: ChatPage,
});

const SYSTEM =
  "You are IntenAI, a concise and practical AI workplace assistant. Help with writing, planning, summarizing and problem solving. Use markdown with short paragraphs and bullets. Ask a clarifying question when the request is ambiguous. Be honest about uncertainty and never invent facts, sources or numbers.";

const SUGGESTIONS = [
  "Draft an agenda for a 30-minute project kickoff",
  "How do I say no to a request politely?",
  "Turn these bullets into a status update",
  "Suggest 5 KPIs for a support team",
];

type Message = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const call = useServerFn(runAI);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const transcript = next
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");
      const res = await call({
        data: { system: SYSTEM, prompt: `${transcript}\n\nAssistant:` },
      });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Assistant"
        title="AI Workplace Assistant"
        description="Ask anything about your work — drafting, planning, analysis or quick advice."
      />

      <div className="panel flex h-[68vh] min-h-[26rem] flex-col p-4 sm:p-5">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <Sparkles className="size-6 text-primary" />
              <p className="text-sm text-muted-foreground">Start a conversation or try a prompt:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground/90",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" /> IntenAI is thinking…
            </div>
          ) : null}
          {error ? (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="mt-4 flex items-end gap-2 border-t border-border pt-4">
          <Textarea
            rows={2}
            value={input}
            placeholder="Ask IntenAI anything…"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            className="min-h-11 resize-none"
          />
          <Button size="icon" className="size-11 shrink-0" disabled={loading || !input.trim()} onClick={() => void send(input)}>
            <SendHorizonal className="size-4" />
          </Button>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        AI-generated responses may be inaccurate — verify important information and avoid sharing confidential data.
      </p>
    </AppShell>
  );
}

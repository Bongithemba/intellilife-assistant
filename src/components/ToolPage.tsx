import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Copy, Check, Sparkles, AlertTriangle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { runAI } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
    </header>
  );
}

export function useAI() {
  const call = useServerFn(runAI);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(system: string, prompt: string) {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await call({ data: { system, prompt } });
      setResult(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return { run, result, error, loading, setResult };
}

export function ToolLayout({ input, output }: { input: ReactNode; output: ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="panel p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Input</h2>
        <div className="space-y-4">{input}</div>
      </section>
      <section className="panel p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          AI Output
        </h2>
        {output}
      </section>
    </div>
  );
}

export function OutputPanel({
  loading,
  error,
  result,
  placeholder,
}: {
  loading: boolean;
  error: string;
  result: string;
  placeholder: string;
}) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        Generating with IntenAI…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-48 items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
        <span>{error}</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        <Sparkles className="size-5 text-primary" />
        {placeholder}
      </div>
    );
  }

  return (
    <div>
      <div className="markdown-body max-h-[28rem] overflow-y-auto pr-1 text-foreground/90">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => {
          void navigator.clipboard.writeText(result);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy output"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        AI-generated content — review for accuracy before use.
      </p>
    </div>
  );
}

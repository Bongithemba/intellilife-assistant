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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — IntenAI" },
      {
        name: "description",
        content:
          "Generate professional emails in formal, friendly, persuasive or apologetic tones with IntenAI.",
      },
      { property: "og:title", content: "Smart Email Generator — IntenAI" },
      {
        property: "og:description",
        content: "Draft polished workplace emails in seconds with adjustable tone and length.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive", "Concise", "Apologetic", "Enthusiastic"];
const LENGTHS = ["Short", "Medium", "Detailed"];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Medium");
  const [points, setPoints] = useState("");
  const { run, result, error, loading } = useAI();

  const disabled = loading || points.trim().length < 3;

  function generate() {
    void run(
      "You are an expert business communication assistant. Write complete, ready-to-send emails. Return markdown with a **Subject:** line, then the email body including greeting and sign-off. Never invent facts that were not provided; use [placeholders] instead.",
      `Write an email.
Recipient: ${recipient || "not specified"}
Subject / purpose: ${subject || "not specified"}
Tone: ${tone}
Length: ${length}
Key points to cover:
${points}`,
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Communication"
        title="Smart Email Generator"
        description="Turn rough notes into a polished, professional email — with the tone and length you need."
      />
      <ToolLayout
        input={
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  placeholder="e.g. Head of Operations"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Purpose</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Project deadline extension"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={7}
                placeholder="Bullet the details the email must include…"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <Button onClick={generate} disabled={disabled} className="w-full">
              Generate email
            </Button>
          </>
        }
        output={
          <OutputPanel
            loading={loading}
            error={error}
            result={result}
            placeholder="Your generated email will appear here."
          />
        }
      />
    </AppShell>
  );
}

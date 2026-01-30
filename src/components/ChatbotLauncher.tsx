"use client";

import { Sparkles, Send, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function ChatbotLauncher() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 I’m your Bank Saathi financial copilot. Ask me *why* a transaction is flagged, *what could happen next*, or *how to reduce risk*.",
    },
  ]);

  // 🔒 Demo transaction context (auto-injected)
  const transactionContext = {
    amount: 5000,
    receiver: "New Contact",
    time: "11:00 PM",
    decision: "ALLOW_WITH_WARNING",
    risk_score: 72,
    evidence_score: 68,
    missing_data: ["location"],
    budget_status: "OVER_BUDGET",
  };

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://bank-saathi-backend.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: input,
            transaction_context: transactionContext,
          }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? formatFallbackReply(transactionContext),
        },
      ]);
    } catch {
      // 🟡 Graceful fallback (VERY IMPORTANT)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: formatFallbackReply(transactionContext),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Launcher */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-600 p-4 shadow-lg hover:scale-105 transition"
      >
        <Sparkles className="text-white" />
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] rounded-xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-emerald-600" />
              <span className="font-bold">Bank Saathi Copilot</span>
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg p-2 leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="text-xs text-gray-400">
                Analyzing transaction context…
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask why / what if / how to reduce risk…"
              className="flex-1 rounded border p-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded bg-emerald-600 p-2 text-white"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* -------------------------------
   🧠 Fallback Explainability Logic
-------------------------------- */

function formatFallbackReply(ctx: any) {
  return `
🔍 **Transaction Review Summary**

• Amount: ₹${ctx.amount}
• Receiver: ${ctx.receiver}
• Time: ${ctx.time}

⚠️ **Why flagged**
- Spending exceeds normal budget
- New / unverified recipient
- Missing location telemetry

📊 **Risk Score:** ${ctx.risk_score}%
📉 **Evidence Confidence:** ${ctx.evidence_score}%

✅ **Recommended Action**
Proceed only if necessary, or delay to improve confidence.
`.trim();
}

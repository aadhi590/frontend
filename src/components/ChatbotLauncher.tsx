"use client";

import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

export default function ChatbotLauncher() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Transaction-scoped context (mock for demo)
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
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const res = await fetch(
        "https://bank-saathi-backend.onrender.com/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            transaction_context: transactionContext,
          }),
        }
      );

      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      setReply(
        "The assistant is temporarily unavailable. Please try again."
      );
    } finally {
      setLoading(false);
      setMessage("");
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-emerald-600 p-4 shadow-lg hover:scale-105 transition"
      >
        <Sparkles className="text-white" />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-emerald-600" />
              <span className="font-semibold">Bank Saathi</span>
            </div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Body */}
          <div className="h-56 p-3 text-sm text-gray-600 overflow-y-auto">
            {!reply && !loading && (
              <p>
                This assistant explains why the system is reviewing
                the current transaction and can simulate outcomes.
              </p>
            )}

            {loading && <p>Analyzing transaction…</p>}

            {reply && (
              <div className="mt-2 rounded bg-gray-100 p-2">
                {reply}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about this transaction…"
              className="flex-1 rounded border p-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
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
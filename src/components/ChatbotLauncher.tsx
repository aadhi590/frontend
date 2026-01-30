"use client";

import { MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ChatbotLauncher() {
  const [open, setOpen] = useState(false);

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
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-emerald-600" />
              <span className="font-semibold">BankSaathi AI</span>
            </div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="h-64 p-3 text-sm text-muted-foreground">
            👋 Hi! I’m your financial co-pilot.  
            Ask me about spending, risk, or savings.
          </div>

          <div className="border-t p-2">
            <input
              placeholder="Ask about your finances..."
              className="w-full rounded border p-2 text-sm"
            />
          </div>
        </div>
      )}
    </>
  );
}

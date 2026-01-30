import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

import Script from "next/script";
import ErrorReporter from "@/components/ErrorReporter";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ChatbotLauncher from "@/components/ChatbotLauncher";

export const metadata: Metadata = {
  title: "Bank Saathi — Intelligent FinTech Command Center",
  description:
    "A secure, explainable, and intelligent financial decision platform for real-time risk-aware transactions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased relative bg-background text-foreground">
        {/* ===============================
           🔍 Observability & Monitoring
        ================================ */}
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="b9de0e37-d608-465a-8504-4720ffe43093"
        />

        <ErrorReporter />

        {/* ===============================
           🧭 Route Intelligence (Dev Tool)
        ================================ */}
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName":"Bank Saathi","version":"1.0.0"}'
        />

        {/* ===============================
           🧠 Main Application
        ================================ */}
        <AuthProvider>{children}</AuthProvider>

        {/* ===============================
           🤝 Global Financial Co-Pilot
           (Visible on dashboard & core flows)
        ================================ */}
        <ChatbotLauncher />

        {/* ===============================
           🎨 Visual Editing / Dev Tool
        ================================ */}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}

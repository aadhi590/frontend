"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon,
  Send,
  LayoutDashboard,
  History as HistoryIcon,
  CreditCard,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Plus,
  Zap,
  Fingerprint,
  AlertTriangle,
  Settings,
  HelpCircle,
  LogOut,
  Loader2,
} from "lucide-react";

import {
  WebAppContainer,
  CopilotButton,
} from "./ui/bank-saathi/LayoutComponents";
import {
  GlassCard,
  SmartButton,
  CircularProgress,
  Shimmer,
} from "./ui/bank-saathi/BaseComponents";
import { cn } from "@/lib/utils";
import { transactionService, type RiskAssessmentResult } from "@/lib/services/transaction-service";
import { useAuthStore } from "@/lib/auth-store";

/* ---------------- TYPES ---------------- */

type Screen = "HOME" | "PAYMENT" | "DASHBOARD" | "HISTORY";

/* ---------------- MAIN APP ---------------- */

export default function BankSaathiApp() {
  const [activeScreen, setActiveScreen] = useState<Screen>("HOME");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const router = useRouter();

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-8">
        {/* Navigation Hub */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Navigation Hub
          </p>
          <div className="space-y-1.5">
            <SidebarItem
              icon={<HomeIcon size={18} />}
              label="Command Center"
              active={activeScreen === "HOME"}
              onClick={() => setActiveScreen("HOME")}
            />
            <SidebarItem
              icon={<Send size={18} />}
              label="Secure Payments"
              active={activeScreen === "PAYMENT"}
              onClick={() => setActiveScreen("PAYMENT")}
            />
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Intelligence Hub"
              active={activeScreen === "DASHBOARD"}
              onClick={() => setActiveScreen("DASHBOARD")}
            />
            <SidebarItem
              icon={<HistoryIcon size={18} />}
              label="Audit Trails"
              active={activeScreen === "HISTORY"}
              onClick={() => setActiveScreen("HISTORY")}
            />
          </div>
        </div>

        {/* Financial Assets */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Financial Assets
          </p>
          <div className="space-y-1.5">
            <SidebarItem
              icon={<CreditCard size={18} />}
              label="Vault Access"
              onClick={() => router.push("/vault")}
            />
            <SidebarItem
              icon={<ShieldCheck size={18} />}
              label="Security Core"
              onClick={() => router.push("/security")}
            />
            <SidebarItem
              icon={<BarChart3 size={18} />}
              label="Neural Analytics"
              onClick={() => router.push("/analytics")}
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-1.5 pt-6 border-t border-white/10">
        <SidebarItem icon={<Settings size={18} />} label="Preferences" />
        <SidebarItem icon={<HelpCircle size={18} />} label="Neural Support" />
        <SidebarItem
          icon={<LogOut size={18} />}
          label="Terminate Session"
          className="text-risk-red hover:bg-risk-red/5"
        />
      </div>
    </div>
  );

  return (
    <WebAppContainer sidebar={sidebar}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScreen}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="pb-20 lg:pb-0"
        >
          {activeScreen === "HOME" && (
            <Home onPay={() => setActiveScreen("PAYMENT")} />
          )}
          {activeScreen === "PAYMENT" && (
            <PaymentFlow onBack={() => setActiveScreen("HOME")} />
          )}
          {activeScreen === "DASHBOARD" && <Dashboard />}
          {activeScreen === "HISTORY" && <History />}
        </motion.div>
      </AnimatePresence>

      <CopilotButton
        onClick={() => setIsCopilotOpen(!isCopilotOpen)}
        isOpen={isCopilotOpen}
      />
    </WebAppContainer>
  );
}

/* ---------------- SIDEBAR ITEM ---------------- */

function SidebarItem({ icon, label, onClick, active, className }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold tracking-tight transition-all",
        active
          ? "bg-primary-green text-white shadow-[0_10px_20px_-5px_rgba(26,95,63,0.3)]"
          : "text-zinc-500 hover:bg-white/50 dark:hover:bg-white/5",
        className,
      )}
    >
      <span
        className={cn(
          "transition-transform group-hover:scale-110",
          active ? "text-white" : "text-primary-green",
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="active-nav-glow"
          className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-gold shadow-[0_0_10px_#D4AF37]"
        />
      )}
    </button>
  );
}

/* ---------------- HOME ---------------- */

function Home({ onPay }: { onPay: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary-green uppercase tracking-[0.3em]">
            Command Center
          </span>
          <div className="h-1 w-1 rounded-full bg-zinc-300" />
          <span className="text-sm font-medium text-zinc-400">
            System Ready
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-charcoal lg:text-5xl dark:text-white">
          Greetings, <span className="text-primary-green">John</span>.
        </h1>
        <p className="text-zinc-500 font-medium">
          Your financial ecosystem is currently{" "}
          <span className="text-safe-green font-bold italic">optimal</span>.
        </p>
      </div>

      {/* Main Card */}
      <GlassCard className="relative overflow-hidden p-8 lg:p-10">
        <Shimmer className="absolute inset-0 opacity-[0.03]" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-accent-gold" />
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">
                Liquidity Threshold
              </h3>
            </div>
            <div className="space-y-1">
              <p className="text-[4rem] font-black leading-none tracking-tighter text-charcoal dark:text-white">
                ₹12,450
              </p>
              <p className="text-sm font-bold text-zinc-400">
                Available safe-spend capital
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 rounded-full bg-safe-green/10 px-4 py-1.5 text-[10px] font-black text-safe-green uppercase tracking-widest border border-safe-green/20">
                <ShieldCheck size={14} />
                98% Confidence Delta
              </span>
            </div>
          </div>
          <CircularProgress
            value={82}
            size={140}
            strokeWidth={14}
            label="System Health"
            color="text-primary-green"
          />
        </div>

        <div className="mt-10 border-t border-white/20 pt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          <MiniStat label="Rent Projection" value="₹25k" />
          <MiniStat label="Subscription Load" value="₹1.2k" />
          <MiniStat label="Passive Yield" value="+₹450" />
          <MiniStat label="Risk Exposure" value="0.02%" />
        </div>
      </GlassCard>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center justify-center gap-4 rounded-[2rem] p-8 bg-white/40 backdrop-blur-xl border border-white/20 shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <CreditCard size={28} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Optical Pay
          </span>
        </motion.button>

        <motion.button
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPay}
          className="flex flex-col items-center justify-center gap-4 rounded-[2rem] p-8 bg-primary-green text-white shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Plus size={28} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Transfer
          </span>
        </motion.button>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-6">
        <h3 className="text-xl font-black tracking-tight text-charcoal dark:text-white">
          Recent Audit Logs
        </h3>
        <div className="space-y-4">
          <TransactionItem
            name="Starbucks Reserves"
            amount="- ₹450"
            time="Today, 10:30"
            status="safe"
            icon="☕"
          />
          <TransactionItem
            name="Amazon Digital Services"
            amount="- ₹2,100"
            time="Yesterday, 20:45"
            status="warn"
            icon="📦"
          />
          <TransactionItem
            name="Netflix Subscription"
            amount="- ₹850"
            time="28 Jan, 13:15"
            status="safe"
            icon="🎬"
          />
        </div>
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">
        {label}
      </span>
      <div className="flex items-center justify-between">
        <span className="text-sm font-black tracking-tight">{value}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-safe-green shadow-[0_0_5px_currentColor]" />
      </div>
    </div>
  );
}

function TransactionItem({
  name,
  amount,
  time,
  status,
  icon,
}: {
  name: string;
  amount: string;
  time: string;
  status: "safe" | "warn" | "risk";
  icon?: string;
}) {
  const statusColors = {
    safe: "bg-safe-green shadow-[0_0_8px_#10B981]",
    warn: "bg-warn-yellow shadow-[0_0_8px_#F59E0B]",
    risk: "bg-risk-red shadow-[0_0_8px_#EF4444]",
  };

  return (
    <div className="group flex items-center justify-between rounded-3xl bg-white/40 border border-white/20 p-5 transition-all hover:bg-white hover:shadow-xl dark:bg-white/5 dark:hover:bg-white/10">
      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl transition-transform group-hover:scale-110 dark:bg-zinc-800">
          {icon || "💸"}
        </div>
        <div>
          <p className="text-base font-black tracking-tight text-charcoal dark:text-white">
            {name}
          </p>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
            {time}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="text-lg font-black tracking-tighter text-charcoal dark:text-white">
          {amount}
        </p>
        <div className={cn("h-1.5 w-1.5 rounded-full", statusColors[status])} />
      </div>
    </div>
  );
}

/* ---------------- PAYMENT FLOW (API-INTEGRATED) ---------------- */

function PaymentFlow({ onBack }: { onBack: () => void }) {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<RiskAssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const review = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await transactionService.createTransaction({
        amount: parseFloat(amount),
        recipientId: "@rahul-sharma",
        recipientName: "Rahul Sharma",
      });

      if (response.success && response.data) {
        setResult(response.data.riskAssessment);
      } else {
        setError(response.error || "Transaction failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
    const isHighRisk = result.decision === "ALLOW_WITH_WARNING" || result.decision === "REVIEW";
    const isRejected = result.decision === "REJECT";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full shadow-lg",
              isRejected
                ? "bg-risk-red text-white shadow-risk-red/30"
                : isHighRisk
                ? "bg-warn-yellow text-white shadow-warn-yellow/30"
                : "bg-safe-green text-white shadow-safe-green/30",
            )}
          >
            {isRejected || isHighRisk ? (
              <AlertTriangle size={40} />
            ) : (
              <ShieldCheck size={40} />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              {isRejected
                ? "Transaction Blocked"
                : isHighRisk
                ? "Proceed with Caution"
                : "Transaction Approved"}
            </h2>
            <p className="text-sm text-zinc-500 font-bold">
              Confidence: {result.confidenceScore}% | Risk Score: {result.riskScore}
            </p>
          </div>
        </div>

        {result.fallbackUsed && (
          <GlassCard className="rounded-xl bg-amber-50/50 border-2 border-amber-300/50 p-6 space-y-3 dark:bg-amber-950/20">
            <div className="flex items-center gap-2">
              <Zap className="text-amber-600" size={20} />
              <p className="font-black text-amber-800 uppercase tracking-wider text-sm dark:text-amber-400">
                Fallback Mode Active
              </p>
            </div>
            <ul className="space-y-2 ml-7">
              {result.reasons.map((r: string, i: number) => (
                <li
                  key={i}
                  className="text-sm font-medium text-amber-700 flex items-start gap-2 dark:text-amber-300"
                >
                  <span className="text-amber-600">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-amber-300/30">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                💡 The system filled in missing data using historical patterns
                to ensure a smooth transaction experience.
              </p>
            </div>
          </GlassCard>
        )}

        {/* Risk Factors Breakdown */}
        {result.riskFactors && result.riskFactors.length > 0 && (
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-lg font-black tracking-tight">Risk Analysis</h3>
            <div className="space-y-3">
              {result.riskFactors
                .filter(f => f.score > 0)
                .map((factor, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full mt-2",
                      factor.severity === 'critical' ? 'bg-risk-red' :
                      factor.severity === 'high' ? 'bg-warn-yellow' :
                      factor.severity === 'medium' ? 'bg-amber-400' :
                      'bg-safe-green'
                    )} />
                    <div className="flex-1">
                      <p className="font-bold text-sm">{factor.name}</p>
                      <p className="text-xs text-zinc-500">{factor.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              factor.severity === 'critical' ? 'bg-risk-red' :
                              factor.severity === 'high' ? 'bg-warn-yellow' :
                              factor.severity === 'medium' ? 'bg-amber-400' :
                              'bg-safe-green'
                            )}
                            style={{ width: `${(factor.score / 25) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-zinc-400">{factor.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Amount
            </span>
            <span className="text-3xl font-black text-charcoal dark:text-white">
              ₹{amount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Recipient
            </span>
            <span className="text-lg font-black text-primary-green">
              @rahul-sharma
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Status
            </span>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider",
                isRejected
                  ? "bg-risk-red/20 text-risk-red"
                  : isHighRisk
                  ? "bg-warn-yellow/20 text-warn-yellow"
                  : "bg-safe-green/20 text-safe-green",
              )}
            >
              {result.decision.replace("_", " ")}
            </span>
          </div>
        </GlassCard>

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <GlassCard className="p-6 space-y-3 bg-blue-50/50 border-2 border-blue-300/50 dark:bg-blue-950/20">
            <h3 className="text-sm font-black text-blue-800 uppercase tracking-wider dark:text-blue-400">
              Recommendations
            </h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="text-sm font-medium text-blue-700 flex items-start gap-2 dark:text-blue-300">
                  <span className="text-blue-600">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        <div className="flex gap-4">
          <SmartButton onClick={onBack} className="flex-1 h-14 rounded-2xl">
            Return to Home
          </SmartButton>
          <SmartButton
            variant="outline"
            onClick={() => setResult(null)}
            className="flex-1 h-14 rounded-2xl"
          >
            New Transaction
          </SmartButton>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-6">
        <button
          onClick={onBack}
          className="rounded-2xl bg-white/50 p-3.5 shadow-sm transition-all hover:bg-white dark:bg-white/5"
        >
          <ChevronRight className="rotate-180" size={24} />
        </button>
        <div className="space-y-0.5">
          <h1 className="text-3xl font-black tracking-tighter">
            Capital Deployment
          </h1>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
            Unified Payment Bridge
          </p>
        </div>
      </div>

      <GlassCard className="flex items-center gap-6 p-8 border-white/20">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 shadow-inner dark:from-zinc-800 dark:to-zinc-900" />
        <div className="space-y-1">
          <p className="text-xl font-black tracking-tight">Rahul Sharma</p>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
            Verified ID: @rahul-sharma-9876
          </p>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="p-4 bg-risk-red/10 border-2 border-risk-red/30">
          <p className="text-sm font-bold text-risk-red">{error}</p>
        </GlassCard>
      )}

      <div className="space-y-6 text-center">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
          Allocation Volume (INR)
        </label>
        <div className="relative group">
          <span className="absolute left-1/2 top-1/2 -translate-x-[5rem] -translate-y-1/2 text-5xl font-black text-zinc-200 group-focus-within:text-primary-green/30 transition-colors">
            ₹
          </span>
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-center text-[6rem] font-black tracking-tighter focus:outline-none placeholder:text-zinc-100 transition-all dark:placeholder:text-zinc-900"
          />
        </div>
      </div>

      <SmartButton
        disabled={!amount || isLoading}
        onClick={review}
        className="h-20 text-xl tracking-tighter italic rounded-[2rem]"
      >
        {isLoading ? (
          <span className="flex items-center gap-3">
            <Loader2 className="animate-spin" size={24} />
            Analyzing Transaction...
          </span>
        ) : (
          "Validate & Execute"
        )}
      </SmartButton>
    </motion.div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tighter italic">
          Intelligence Hub
        </h1>
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
          Neural Ecosystem Overview
        </p>
      </div>

      <GlassCard className="relative bg-primary-green p-10 text-white overflow-hidden border-none shadow-[0_30px_60px_-15px_rgba(26,95,63,0.4)]">
        <Shimmer className="absolute inset-0 opacity-10" />
        <div className="relative z-10 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
            System Liquid Index
          </h3>
          <p className="text-[4rem] font-black leading-none tracking-tighter italic">
            92.00%
          </p>
          <p className="text-lg font-medium text-white/80">
            Reserves maintained at{" "}
            <span className="font-black italic">₹12,450</span> against the
            weekly allocation matrix.
          </p>
        </div>
      </GlassCard>

      <div className="space-y-4">
        <h3 className="text-xl font-black tracking-tight">
          Intelligence Feeds
        </h3>
        <Alert
          label="Fallback transaction completed safely"
          icon={<ShieldCheck />}
          type="success"
        />
        <Alert
          label="Budget threshold nearing limit"
          icon={<AlertTriangle />}
          type="warning"
        />
        <Alert
          label="3 nodes verified & authenticated"
          icon={<ShieldCheck />}
          type="success"
        />
      </div>
    </motion.div>
  );
}

function Alert({
  label,
  icon,
  type,
}: {
  label: string;
  icon?: React.ReactNode;
  type?: string;
}) {
  const colors = {
    success: "bg-emerald-50 border-emerald-300 text-emerald-700",
    warning: "bg-amber-50 border-amber-300 text-amber-700",
    info: "bg-blue-50 border-blue-300 text-blue-700",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border-2 p-4",
        colors[type as keyof typeof colors] || colors.info,
      )}
    >
      {icon && <div className="shrink-0">{icon}</div>}
      <p className="font-bold text-sm">{label}</p>
    </div>
  );
}

/* ---------------- HISTORY ---------------- */

function History() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tighter">Audit Trails</h1>
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
          Complete Transaction History
        </p>
      </div>

      <div className="space-y-4">
        <TransactionItem
          name="Starbucks Reserves"
          amount="- ₹450"
          time="Today, 10:30"
          status="safe"
          icon="☕"
        />
        <TransactionItem
          name="Amazon Digital Services"
          amount="- ₹2,100"
          time="Yesterday, 20:45"
          status="warn"
          icon="📦"
        />
        <TransactionItem
          name="Netflix Subscription"
          amount="- ₹850"
          time="28 Jan, 13:15"
          status="safe"
          icon="🎬"
        />
        <TransactionItem
          name="Capital Growth SIP"
          amount="- ₹10,000"
          time="25 Jan, 09:00"
          status="safe"
          icon="💹"
        />
        <TransactionItem
          name="Swiggy Food Order"
          amount="- ₹680"
          time="24 Jan, 21:15"
          status="safe"
          icon="🍔"
        />
      </div>
    </motion.div>
  );
}

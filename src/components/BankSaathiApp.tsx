"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home as HomeIcon, 
  Send, 
  LayoutDashboard, 
  History, 
  Scan, 
  CreditCard, 
  BarChart3, 
  ShieldCheck,
  ChevronRight,
  Plus,
  X,
  Search,
  Settings,
  HelpCircle,
  LogOut,
  Zap,
  Fingerprint,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { WebAppContainer, CopilotButton } from "./ui/bank-saathi/LayoutComponents";
import { NeuCard, GlassCard, SmartButton, CircularProgress, Shimmer } from "./ui/bank-saathi/BaseComponents";
import { cn } from "@/lib/utils";

type Screen = "HOME" | "PAYMENT" | "DASHBOARD" | "HISTORY" | "COPILOT";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function BankSaathiApp() {
  const [activeScreen, setActiveScreen] = useState<Screen>("HOME");
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Navigation Hub</p>
          <div className="space-y-1.5">
            <SidebarNavItem 
              active={activeScreen === "HOME"} 
              icon={<HomeIcon size={18} />} 
              label="Command Center" 
              onClick={() => setActiveScreen("HOME")} 
            />
            <SidebarNavItem 
              active={activeScreen === "PAYMENT"} 
              icon={<Send size={18} />} 
              label="Secure Payments" 
              onClick={() => setActiveScreen("PAYMENT")} 
            />
            <SidebarNavItem 
              active={activeScreen === "DASHBOARD"} 
              icon={<LayoutDashboard size={18} />} 
              label="Intelligence Hub" 
              onClick={() => setActiveScreen("DASHBOARD")} 
            />
            <SidebarNavItem 
              active={activeScreen === "HISTORY"} 
              icon={<History size={18} />} 
              label="Audit Trails" 
              onClick={() => setActiveScreen("HISTORY")} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Financial Assets</p>
          <div className="space-y-1.5">
            <SidebarNavItem icon={<CreditCard size={18} />} label="Vault Access" />
            <SidebarNavItem icon={<ShieldCheck size={18} />} label="Security Core" />
            <SidebarNavItem icon={<BarChart3 size={18} />} label="Neural Analytics" />
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-1.5 pt-6 border-t border-white/10">
        <SidebarNavItem icon={<Settings size={18} />} label="Preferences" />
        <SidebarNavItem icon={<HelpCircle size={18} />} label="Neural Support" />
        <SidebarNavItem icon={<LogOut size={18} />} label="Terminate Session" className="text-risk-red hover:bg-risk-red/5" />
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (activeScreen) {
      case "HOME":
        return <HomeScreen onNavigate={(s) => setActiveScreen(s)} />;
      case "PAYMENT":
        return <PaymentFlow onBack={() => setActiveScreen("HOME")} />;
      case "DASHBOARD":
        return <Dashboard onBack={() => setActiveScreen("HOME")} />;
      default:
        return <HomeScreen onNavigate={(s) => setActiveScreen(s)} />;
    }
  };

  return (
    <WebAppContainer sidebar={sidebarContent}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pb-20 lg:pb-0"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      <CopilotButton onClick={() => setIsCopilotOpen(!isCopilotOpen)} isOpen={isCopilotOpen} />

      <AnimatePresence>
        {isCopilotOpen && (
          <CopilotOverlay onClose={() => setIsCopilotOpen(false)} />
        )}
      </AnimatePresence>
    </WebAppContainer>
  );
}

function SidebarNavItem({ active, icon, label, onClick, className }: any) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold tracking-tight transition-all",
        active 
          ? "bg-primary-green text-white shadow-[0_10px_20px_-5px_rgba(26,95,63,0.3)]" 
          : "text-zinc-500 hover:bg-white/50 dark:hover:bg-white/5",
        className
      )}
    >
      <span className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-primary-green")}>{icon}</span>
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

function HomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary-green uppercase tracking-[0.3em]">Command Center</span>
            <div className="h-1 w-1 rounded-full bg-zinc-300" />
            <span className="text-sm font-medium text-zinc-400">System Ready</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-charcoal lg:text-5xl dark:text-white">
            Greetings, <span className="text-primary-green">John</span>.
          </h1>
          <p className="text-zinc-500 font-medium">Your financial ecosystem is currently <span className="text-safe-green font-bold italic">optimal</span>.</p>
        </div>
        <div className="flex items-center gap-4">
          <GlassCard className="flex items-center gap-4 px-6 py-3 rounded-2xl border-white/20">
            <Fingerprint className="text-primary-green" size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Status</span>
              <span className="text-sm font-bold tracking-tight">Authenticated</span>
            </div>
          </GlassCard>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Smart Insights Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="relative h-full overflow-hidden p-8 lg:p-10">
            <Shimmer className="absolute inset-0 opacity-[0.03]" />
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-accent-gold" />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Liquidity Threshold</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-[4rem] font-black leading-none tracking-tighter text-charcoal dark:text-white">
                    ₹12,450
                  </p>
                  <p className="text-sm font-bold text-zinc-400">Available safe-spend capital</p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-safe-green/10 px-4 py-1.5 text-[10px] font-black text-safe-green uppercase tracking-widest border border-safe-green/20">
                    <ShieldCheck size={14} />
                    98% Confidence Delta
                  </span>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-zinc-100 dark:border-zinc-900" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400">+12 Verify Agents</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <CircularProgress value={82} size={140} strokeWidth={14} label="System Health" color="text-primary-green" />
                <div className="space-y-1 text-center">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Neural Verdict</p>
                  <span className="text-xs font-black text-primary-green uppercase">High Trust Allocation</span>
                </div>
              </div>
            </div>
            <div className="mt-10 border-t border-white/20 pt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
              <InsightMiniStat label="Rent Projection" value="₹25k" status="verified" />
              <InsightMiniStat label="Subscription Load" value="₹1.2k" status="impending" />
              <InsightMiniStat label="Passive Yield" value="+₹450" status="captured" />
              <InsightMiniStat label="Risk Exposure" value="0.02%" status="minimal" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          <QuickActionCard icon={<Scan size={28} />} label="Optical Pay" color="bg-white/40 backdrop-blur-xl border-white/20" />
          <QuickActionCard icon={<Plus size={28} />} label="Transfer" color="bg-primary-green text-white" onClick={() => onNavigate("PAYMENT")} />
          <QuickActionCard icon={<CreditCard size={28} />} label="Vault" color="bg-white/40 backdrop-blur-xl border-white/20" />
          <QuickActionCard icon={<BarChart3 size={28} />} label="Analytics" color="bg-accent-gold text-white" onClick={() => onNavigate("DASHBOARD")} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight text-charcoal dark:text-white">Recent Audit Logs</h3>
            <button className="text-xs font-black uppercase tracking-widest text-primary-green hover:tracking-[0.2em] transition-all">Full Ledger</button>
          </div>
          <div className="space-y-4">
            <TransactionItem name="Starbucks Reserves" amount="- ₹450" time="Today, 10:30" status="safe" icon="☕" />
            <TransactionItem name="Amazon Digital Services" amount="- ₹2,100" time="Yesterday, 20:45" status="warn" icon="📦" />
            <TransactionItem name="Boulangerie Patisserie" amount="- ₹850" time="28 Jan, 13:15" status="safe" icon="🥐" />
            <TransactionItem name="Capital Growth SIP" amount="- ₹10,000" time="25 Jan, 09:00" status="safe" icon="💹" />
          </div>
        </motion.div>

        {/* Security Overview */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight text-charcoal dark:text-white">Security Sub-Process</h3>
            <button className="text-xs font-black uppercase tracking-widest text-primary-green hover:tracking-[0.2em] transition-all">Encryption Matrix</button>
          </div>
          <GlassCard className="space-y-8 p-8 border-white/20">
            <div className="flex items-center gap-6">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-green/10 text-primary-green">
                <ShieldCheck size={36} />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-3xl border-2 border-primary-green" 
                />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black tracking-tight leading-none">Active Neural Guardian</p>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">47 heuristic scans completed</p>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <span className="text-[10px] font-black text-safe-green uppercase tracking-[0.2em]">Matrix Integrity</span>
                <span className="text-xl font-black">100.00</span>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Intelligence Briefing</p>
              <div className="space-y-3">
                <IntelligenceAlert 
                  status="intercepted" 
                  message="Anomalous midnight latency detected on e-commerce bridge. Verification required." 
                />
                <IntelligenceAlert 
                  status="verified" 
                  message="Recurring capital deployment to SIP authenticated via historical biometric pattern." 
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

function InsightMiniStat({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">{label}</span>
      <div className="flex items-center justify-between">
        <span className="text-sm font-black tracking-tight">{value}</span>
        <span className={cn(
          "h-1.5 w-1.5 rounded-full shadow-[0_0_5px_currentColor]",
          status === "verified" || status === "captured" ? "text-safe-green" : 
          status === "impending" ? "text-accent-gold" : "text-primary-green"
        )} />
      </div>
    </div>
  );
}

function IntelligenceAlert({ status, message }: { status: "intercepted" | "verified"; message: string }) {
  return (
    <div className="group relative flex items-start gap-4 rounded-2xl bg-white/30 p-4 transition-all hover:bg-white/50 dark:bg-black/20">
      <div className={cn(
        "mt-1 h-2 w-2 rounded-full shrink-0",
        status === "intercepted" ? "bg-warn-yellow shadow-[0_0_10px_#F59E0B]" : "bg-safe-green shadow-[0_0_10px_#10B981]"
      )} />
      <p className="text-xs font-bold leading-relaxed text-zinc-600 dark:text-zinc-400">
        <span className="uppercase tracking-widest text-[9px] block mb-0.5">{status}</span>
        {message}
      </p>
    </div>
  );
}

function QuickActionCard({ icon, label, color, onClick }: any) {
  return (
    <motion.button 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick} 
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-[2rem] p-8 shadow-sm transition-all lg:p-10",
        color
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </motion.button>
  );
}

function TransactionItem({ name, amount, time, status, icon }: { name: string; amount: string; time: string; status: "safe" | "warn" | "risk"; icon?: string }) {
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
          <p className="text-base font-black tracking-tight text-charcoal dark:text-white">{name}</p>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{time}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="text-lg font-black tracking-tighter text-charcoal dark:text-white">{amount}</p>
        <div className={cn("h-1.5 w-1.5 rounded-full", statusColors[status])} />
      </div>
    </div>
  );
}

function PaymentFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [isRiskDetected, setIsRiskDetected] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [showExplainability, setShowExplainability] = useState(false);

  const handleReview = () => {
    if (parseFloat(amount) >= 5000) {
      setIsRiskDetected(true);
      setStep(2);
    } else {
      setStep(4);
    }
  };

  if (step === 2 && isRiskDetected) {
    return (
      <div className="mx-auto max-w-2xl space-y-10 py-8">
        <header className="flex items-center gap-6">
          <button onClick={() => setStep(1)} className="rounded-2xl bg-white/50 p-3.5 shadow-sm transition-all hover:bg-white dark:bg-white/5"><ChevronRight className="rotate-180" size={24} /></button>
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tighter italic">Risk Intervention</h1>
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Elevated heuristic alert detected</p>
          </div>
        </header>

        <GlassCard className="p-10 border-risk-red/20 space-y-10 bg-risk-red/[0.02]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-risk-red" size={20} />
              <h3 className="text-lg font-black text-risk-red uppercase tracking-tight">Anomalous pattern identified:</h3>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex gap-5">
                <div className="h-4 w-4 mt-1 rounded-full bg-risk-red shadow-[0_0_10px_#EF4444] shrink-0" />
                <div className="space-y-1">
                  <p className="font-black text-sm uppercase tracking-widest">Liquidity Stress</p>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Transaction exceeds localized weekly allocation by <span className="text-risk-red font-bold">₹1,200</span>.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="h-4 w-4 mt-1 rounded-full bg-warn-yellow shadow-[0_0_10px_#F59E0B] shrink-0" />
                <div className="space-y-1">
                  <p className="font-black text-sm uppercase tracking-widest">Pattern Variance</p>
                  <ul className="text-sm font-medium text-zinc-600 dark:text-zinc-400 space-y-1.5">
                    <li>• 5.4x historical mean volume</li>
                    <li>• Non-whitelisted recipient ID</li>
                    <li>• Late-night temporal signature</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-3xl bg-white/50 p-8 border border-white/20 shadow-inner dark:bg-black/20">
            <CircularProgress value={72} size={80} strokeWidth={8} color="text-warn-yellow" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Confidence Delta</p>
              <p className="text-sm font-bold text-zinc-500">Geo-spatial telemetry unavailable</p>
            </div>
            <button 
              onClick={() => setShowExplainability(true)}
              className="ml-auto rounded-xl bg-primary-green px-5 py-2.5 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-primary-green/20 hover:scale-105 transition-transform"
            >
              Analyze Logic
            </button>
          </div>
        </GlassCard>

        <AnimatePresence>
          {showExplainability && (
            <ExplainabilityPanel onClose={() => setShowExplainability(false)} />
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4 pt-4 md:flex-row">
          <SmartButton className="flex-1 italic" onClick={() => { setIsCoolingDown(true); setStep(3); }}>I'm Confident, Proceed</SmartButton>
          <SmartButton variant="ghost" className="flex-1 opacity-70" onClick={onBack}>Abort Transaction</SmartButton>
        </div>
      </div>
    );
  }

  if (step === 3 && isCoolingDown) {
    return <div className="mx-auto max-w-2xl py-8"><CoolingReview onFinish={() => setStep(4)} onCancel={onBack} amount={amount} /></div>;
  }

  if (step === 4) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-10 text-center">
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="relative flex h-40 w-40 items-center justify-center rounded-full bg-safe-green text-white shadow-[0_20px_60px_-10px_rgba(16,185,129,0.4)]"
        >
          <ShieldCheck size={80} />
          <motion.div 
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-4 border-safe-green"
          />
        </motion.div>
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tighter text-charcoal dark:text-white italic">Protocol Success</h2>
          <p className="text-lg font-bold text-zinc-500">₹{amount} allocated to <span className="text-primary-green">@rahul-sharma</span></p>
        </div>
        <SmartButton className="w-auto px-16 rounded-3xl" onClick={onBack}>Return to Base</SmartButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-12 py-8">
      <header className="flex items-center gap-6">
        <button onClick={onBack} className="rounded-2xl bg-white/50 p-3.5 shadow-sm transition-all hover:bg-white dark:bg-white/5"><ChevronRight className="rotate-180" size={24} /></button>
        <div className="space-y-0.5">
          <h1 className="text-3xl font-black tracking-tighter">Capital Deployment</h1>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Unified Payment Bridge</p>
        </div>
      </header>

      <div className="space-y-12">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 px-2">Recipient Entity</label>
          <GlassCard className="flex items-center gap-6 p-8 border-white/20 group hover:border-primary-green/30 transition-colors">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 shadow-inner group-hover:scale-110 transition-transform dark:from-zinc-800 dark:to-zinc-900" />
            <div className="space-y-1">
              <p className="text-xl font-black tracking-tight">Rahul Sharma</p>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Verified ID: @rahul-sharma-9876</p>
            </div>
            <button className="ml-auto text-primary-green font-black text-xs uppercase tracking-widest hover:tracking-[0.2em] transition-all">Re-route</button>
          </GlassCard>
        </div>

        <div className="space-y-6 text-center">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Allocation Volume (INR)</label>
          <div className="relative group">
            <span className="absolute left-1/2 top-1/2 -translate-x-[5rem] -translate-y-1/2 text-5xl font-black text-zinc-200 group-focus-within:text-primary-green/30 transition-colors">₹</span>
            <input 
              type="number" 
              placeholder="0" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-center text-[6rem] font-black tracking-tighter focus:outline-none placeholder:text-zinc-100 transition-all dark:placeholder:text-zinc-900"
            />
          </div>
        </div>

        <GlassCard className="bg-white/20 border-white/20 p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-accent-gold" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Neural Context Synthesis</h4>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ContextMetric label="Volume Variance" value="Normal" sub="₹500-₹800 Mean" />
            <ContextMetric label="Temporal Sign" value="Optimal" sub="Active Hours" />
            <ContextMetric label="Entity Trust" value="Low" sub="First Contact" color="text-warn-yellow" />
          </div>
        </GlassCard>
      </div>

      <div className="pt-6">
        <SmartButton disabled={!amount} onClick={handleReview} className="h-20 text-xl tracking-tighter italic rounded-[2rem]">Validate & Execute</SmartButton>
      </div>
    </div>
  );
}

function ContextMetric({ label, value, sub, color = "text-charcoal dark:text-white" }: any) {
  return (
    <div className="space-y-1">
      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none block mb-1">{label}</span>
      <p className={cn("text-lg font-black tracking-tight", color)}>{value}</p>
      <p className="text-[10px] font-bold text-zinc-400">{sub}</p>
    </div>
  );
}

function CoolingReview({ onFinish, onCancel, amount }: { onFinish: () => void; onCancel: () => void; amount: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + (100 / 30);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12">
      <header className="flex items-center gap-6">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[2rem] bg-primary-green/10 text-primary-green shadow-inner">
          <ShieldCheck size={40} />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-[2rem] border-2 border-dashed border-primary-green/30"
          />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-3xl font-black tracking-tighter italic">Cooling Protocol</h1>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest italic">Verification in progress</p>
        </div>
      </header>

      <div className="space-y-10">
        <p className="text-xl font-medium text-zinc-500 leading-relaxed max-w-xl">
          Bank Saathi has initiated a <span className="text-primary-green font-bold">Heuristic Review Period</span>. This 30-second window allows for neural verification of non-standard capital flows.
        </p>

        <GlassCard className="border-2 border-dashed border-white/40 p-10 space-y-8">
          <div className="grid grid-cols-2 gap-10">
            <ContextMetric label="Capital Flow" value={`₹${amount}`} sub="Direct Allocation" />
            <ContextMetric label="Entity ID" value="Rahul Sharma" sub="Unverified Whitelist" />
            <ContextMetric label="Temporal Stamp" value="23:32 IST" sub="High Variance Hour" color="text-warn-yellow" />
            <ContextMetric label="Review Mode" value="Manual" sub="Override Active" color="text-accent-gold" />
          </div>
        </GlassCard>

        <div className="space-y-5 pt-4">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Review Matrix Sync</p>
              <p className="text-sm font-black italic">Stabilizing decision vectors...</p>
            </div>
            <p className="text-2xl font-black italic text-primary-green">{Math.ceil(30 - (progress * 30 / 100))}s</p>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary-green to-accent-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 md:flex-row">
        <SmartButton variant="outline" className="flex-1 opacity-60 hover:opacity-100 border-zinc-200" onClick={onCancel}>Abort Protocol</SmartButton>
        <SmartButton disabled={progress < 100} className="flex-1 italic" onClick={onFinish}>Finalize Deployment</SmartButton>
      </div>
    </div>
  );
}

function Dashboard({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      <motion.header variants={itemVariants} className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter italic">Intelligence Hub</h1>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Neural Ecosystem Overview</p>
        </div>
        <GlassCard className="flex items-center gap-3 px-6 py-3 border-primary-green/20">
          <ShieldCheck className="text-primary-green" size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-green">Shield Active</span>
        </GlassCard>
      </motion.header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="relative h-full bg-primary-green p-10 text-white overflow-hidden border-none shadow-[0_30px_60px_-15px_rgba(26,95,63,0.4)]">
            <Shimmer className="absolute inset-0 opacity-10" />
            <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">System Liquid Index</h3>
                  <p className="text-[4rem] font-black leading-none tracking-tighter italic">92.00%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-white/80 leading-snug">
                    Reserves maintained at <span className="font-black italic">₹12,450</span> against the weekly allocation matrix.
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-accent-gold" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold">Optimal Trajectory</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block scale-110">
                <CircularProgress value={92} size={160} strokeWidth={16} color="text-white" />
              </div>
            </div>
            <div className="mt-12 h-3 w-full rounded-full bg-white/20 overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-accent-gold shadow-[0_0_15px_#D4AF37]" 
              />
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
              <span>Deployed: ₹2,550</span>
              <span className="italic">Neural Stability Confirmed</span>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
          <DashboardStatCard title="Guardian Score" value="98.4" icon={<ShieldCheck size={22} />} color="text-safe-green" />
          <DashboardStatCard title="Heuristic Alerts" value="03" icon={<AlertTriangle size={22} />} color="text-warn-yellow" />
          <DashboardStatCard title="Delta Capture" value="₹2,500" icon={<TrendingUp size={22} />} color="text-primary-green" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-xl font-black tracking-tight italic">Temporal Variance Matrix</h3>
          <GlassCard className="h-80 flex items-end justify-between px-8 py-10 border-white/10 group">
            <Shimmer className="absolute inset-0 opacity-[0.02]" />
            {[40, 60, 45, 90, 65, 50, 80, 55, 70, 40, 85, 60].map((h, i) => (
              <div key={i} className="group/bar relative flex flex-1 flex-col items-center gap-3">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1 }}
                  className="w-full max-w-[1.2rem] rounded-t-xl bg-zinc-100 transition-all group-hover/bar:bg-primary-green group-hover/bar:shadow-[0_0_20px_rgba(26,95,63,0.3)] dark:bg-zinc-800"
                />
                <span className="text-[9px] text-zinc-400 font-black opacity-40 group-hover/bar:opacity-100 transition-opacity">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F'][i]}
                </span>
              </div>
            ))}
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-xl font-black tracking-tight italic">Intelligence Feeds</h3>
          <div className="space-y-4">
            <InsightCard title="3 nodes verified & authenticated" icon={<ShieldCheck size={20} />} color="text-safe-green" />
            <InsightCard title="Unusual midnight latency bridge detected" icon={<AlertTriangle size={20} />} color="text-warn-yellow" />
            <InsightCard title="Asset deployment alert: Netflix Renewal" icon={<Zap size={20} />} color="text-accent-gold" />
            <IntelligenceAlert status="intercepted" message="Neural matrix identified & nullified malicious link signature." />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DashboardStatCard({ title, value, icon, color }: any) {
  return (
    <GlassCard className="flex items-center gap-6 py-6 px-8 border-white/20 group hover:border-white/40 transition-all">
      <div className={cn("flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-zinc-50 transition-transform group-hover:scale-110 dark:bg-zinc-800 shadow-inner", color)}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{title}</p>
        <p className="text-2xl font-black italic tracking-tighter">{value}</p>
      </div>
    </GlassCard>
  );
}

function InsightCard({ title, icon, color }: { title: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="group flex items-center justify-between rounded-3xl border border-white/20 bg-white/40 p-6 transition-all hover:bg-white hover:shadow-2xl dark:bg-white/5 dark:hover:bg-white/10">
      <div className="flex items-center gap-5">
        <div className={cn("rounded-2xl p-3 bg-zinc-50 shadow-inner transition-transform group-hover:scale-110 dark:bg-zinc-800", color)}>{icon}</div>
        <p className="text-sm font-black tracking-tight">{title}</p>
      </div>
      <ChevronRight size={18} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
    </div>
  );
}

function CopilotOverlay({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Neural Audit Complete: \n\n1️⃣ Capital outflow variance: High (5.4x Mean)\n2️⃣ Recipient Entity: Non-Whitelisted\n3️⃣ Temporal Signature: Anomalous (23:32 IST)\n\nHeuristic intervention was active to ensure protocol integrity. You remain the primary decision node! 🤝" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: "Neural Matrix Updated. Monitoring real-time latency and capital flow patterns for localized stability. All systems operational. 🤝" }]);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      className="fixed inset-y-0 right-0 z-50 w-full bg-white/80 backdrop-blur-3xl shadow-2xl lg:w-[450px] dark:bg-black/80 flex flex-col border-l border-white/20"
    >
      <header className="flex h-24 items-center justify-between border-b border-white/10 px-8">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.5rem] bg-primary-green text-2xl text-white shadow-lg shadow-primary-green/20">
            🤝
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-[1.5rem] border-2 border-primary-green" 
            />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter italic">Bank Saathi Neural Core</h2>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-safe-green animate-pulse shadow-[0_0_8px_#10B981]" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Heuristic Sync Active</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-2xl bg-white/50 p-3 hover:bg-white dark:bg-white/5 transition-all"><X size={20} /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        {messages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div className={cn(
              "max-w-[90%] rounded-[2.5rem] p-6 text-sm font-medium leading-relaxed shadow-sm",
              m.role === "user" 
                ? "bg-primary-green text-white rounded-tr-none shadow-lg shadow-primary-green/20" 
                : "bg-white/80 text-charcoal rounded-tl-none border border-white/40 dark:bg-white/5 dark:text-zinc-200"
            )}>
              {m.content}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-white/10 p-8 pb-12 lg:pb-8">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Query neural matrix..." 
            className="w-full rounded-3xl border border-white/40 bg-white/50 px-6 py-5 pr-16 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-green/10 dark:bg-white/5 dark:border-white/10"
          />
          <button onClick={handleSend} className="absolute right-2.5 top-2.5 rounded-2xl bg-primary-green p-3 text-white shadow-lg shadow-primary-green/20 hover:scale-110 transition-transform">
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ExplainabilityPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
    >
      <GlassCard className="relative w-full max-w-2xl space-y-10 p-10 lg:p-12 border-white/20">
        <button onClick={onClose} className="absolute right-8 top-8 rounded-2xl bg-white/50 p-3 hover:bg-white dark:bg-white/5">
          <X size={24} />
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-accent-gold" />
            <h2 className="text-3xl font-black tracking-tighter italic">Neural Decision Matrix</h2>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Transparent heuristic breakdown of current intercept.</p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Captured Telemetry</h3>
              <ul className="space-y-4">
                <TelemetryItem label="Ledger History (90d Sync)" status="optimal" />
                <TelemetryItem label="Linguistic Spending Pattern" status="optimal" />
                <TelemetryItem label="Temporal/Entity Vector" status="optimal" />
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Absent Telemetry</h3>
              <ul className="space-y-4">
                <TelemetryItem label="Geo-Spatial Locus" status="null" />
                <TelemetryItem label="Merchant Classification" status="null" />
              </ul>
            </div>
          </div>

          <div className="space-y-8 rounded-[2.5rem] bg-black/5 p-10 dark:bg-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Stability Vectors</h3>
            <div className="space-y-6">
              <ExplainabilityBar label="Allocation Stress" value={65} color="bg-accent-gold shadow-[0_0_10px_#D4AF37]" />
              <ExplainabilityBar label="Malicious Signature" value={42} color="bg-risk-red shadow-[0_0_10px_#EF4444]" />
              <ExplainabilityBar label="Neural Confidence" value={72} color="bg-primary-green shadow-[0_0_10px_#10B981]" />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-primary-green/5 p-6 border border-primary-green/10 flex gap-5">
          <div className="h-10 w-10 shrink-0 rounded-2xl bg-primary-green/10 flex items-center justify-center text-primary-green">
            <HelpCircle size={24} />
          </div>
          <p className="text-xs font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
            <span className="font-black uppercase tracking-widest block mb-1">Verdict Context:</span> 
            Insufficient Geo-Spatial telemetry degraded the confidence matrix. However, the Linguistic Spending Pattern remains consistent with historical nodes, suggesting a legitimate but non-standard deployment.
          </p>
        </div>

        <SmartButton onClick={onClose} className="rounded-[2rem] italic">Acknowledge Synthesis</SmartButton>
      </GlassCard>
    </motion.div>
  );
}

function TelemetryItem({ label, status }: { label: string; status: "optimal" | "null" }) {
  return (
    <li className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-2 w-2 rounded-full",
          status === "optimal" ? "bg-safe-green shadow-[0_0_8px_#10B981]" : "bg-warn-yellow shadow-[0_0_8px_#F59E0B]"
        )} />
        <span className="text-sm font-bold tracking-tight text-zinc-600 group-hover:text-charcoal dark:text-zinc-400 transition-colors">{label}</span>
      </div>
      <span className={cn(
        "text-[9px] font-black uppercase tracking-widest",
        status === "optimal" ? "text-safe-green" : "text-warn-yellow"
      )}>{status}</span>
    </li>
  );
}

function ExplainabilityBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
        <span>{label}</span>
        <span className="italic">{value}.00%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-zinc-100 overflow-hidden dark:bg-zinc-800 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}

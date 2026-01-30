"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Menu, Bell, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopilotButton({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
  return (
    <motion.button
      layoutId="copilot-trigger"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-green text-white shadow-[0_20px_40px_-10px_rgba(26,95,63,0.4)] lg:bottom-10 lg:right-10 lg:h-16 lg:w-16"
      whileTap={{ scale: 0.9 }}
      animate={{
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 0 0 rgba(26, 95, 63, 0.4)",
          "0 0 0 20px rgba(26, 95, 63, 0)",
          "0 0 0 0 rgba(26, 95, 63, 0)",
        ],
      }}
      transition={{
        scale: { duration: 2, repeat: Infinity },
        boxShadow: { duration: 2, repeat: Infinity },
      }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
          >
            <X size={24} className="lg:size-7" />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
          >
            <MessageSquare size={24} className="lg:size-7" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function WebAppContainer({ 
  children, 
  sidebar, 
  topbar 
}: { 
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen font-sans text-charcoal dark:text-zinc-50 overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#f8fafc] dark:bg-zinc-950" />
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary-green/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[30%] w-[30%] rounded-full bg-accent-gold/5 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-safe-green/5 blur-[120px]" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-white/20 bg-white/40 p-8 backdrop-blur-2xl lg:flex dark:border-white/5 dark:bg-black/40">
        <div className="mb-10 flex items-center gap-2">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-green text-white shadow-lg shadow-primary-green/20">🤝</div>
          <span className="text-xl font-black tracking-tighter text-charcoal dark:text-white">BANK SAATHI</span>
        </div>
        {sidebar}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white/80 p-8 backdrop-blur-2xl lg:hidden dark:bg-black/80"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary-green text-white">🤝</div>
                  <span className="text-xl font-black tracking-tighter">BANK SAATHI</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-full bg-zinc-100 p-2 dark:bg-zinc-900">
                  <X size={20} />
                </button>
              </div>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/20 bg-white/40 px-6 backdrop-blur-xl lg:px-10 dark:border-white/5 dark:bg-black/40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-xl bg-white/50 p-2.5 shadow-sm lg:hidden dark:bg-white/5"
            >
              <Menu size={24} />
            </button>
            <div className="hidden flex-col lg:flex">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">FINANCIAL COMMAND CENTER</p>
              <h2 className="text-sm font-black tracking-tight text-charcoal dark:text-white">INTELLIGENT OVERVIEW</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative rounded-xl bg-white/50 p-3 shadow-sm transition-all hover:bg-white dark:bg-white/5 dark:hover:bg-white/10">
              <Bell size={20} className="text-zinc-600 dark:text-zinc-300" />
              <span className="absolute right-3 top-3 flex h-2 w-2 rounded-full bg-risk-red" />
            </button>
            <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
            <button className="flex items-center gap-3 rounded-2xl bg-white/50 p-1.5 pr-4 shadow-sm transition-all hover:bg-white dark:bg-white/5 dark:hover:bg-white/10">
              <div className="h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-accent-gold to-primary-green p-[2px]">
                <div className="h-full w-full rounded-[10px] bg-white dark:bg-zinc-900 flex items-center justify-center">
                  <User size={20} className="text-primary-green" />
                </div>
              </div>
              <div className="hidden flex-col items-start lg:flex">
                <span className="text-sm font-black tracking-tight leading-none">John Doe</span>
                <span className="text-[10px] font-bold text-safe-green uppercase">Premium Member</span>
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Keep MobileContainer for backward compatibility
export function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 font-sans dark:bg-zinc-950">
      <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[3rem] border-[8px] border-zinc-900 bg-white shadow-2xl dark:border-zinc-800 dark:bg-black">
        <div className="h-full overflow-y-auto pt-11 pb-20 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

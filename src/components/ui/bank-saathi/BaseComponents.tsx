"use strict";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function NeuCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[2.5rem] bg-white p-6 shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] dark:bg-zinc-900/50 dark:shadow-none dark:backdrop-blur-xl dark:border dark:border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/40 shadow-xl dark:bg-black/40 dark:border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent", className)} />
  );
}

export function SmartButton({ children, className, variant = "primary", ...props }: any) {
  const variants = {
    primary: "bg-primary-green text-white shadow-lg shadow-primary-green/20",
    gold: "bg-accent-gold text-white shadow-lg shadow-accent-gold/20",
    outline: "border-2 border-primary-green text-primary-green bg-transparent hover:bg-primary-green/5",
    ghost: "bg-transparent text-charcoal hover:bg-zinc-100 dark:text-white dark:hover:bg-white/5",
    safe: "bg-safe-green text-white shadow-lg shadow-safe-green/20",
    risk: "bg-risk-red text-white shadow-lg shadow-risk-red/20",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "flex h-14 w-full items-center justify-center rounded-2xl px-8 font-bold tracking-tight transition-all focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50",
        variants[variant as keyof typeof variants],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function CircularProgress({ value, size = 120, strokeWidth = 10, label, color = "text-primary-green" }: { value: number; size?: number; strokeWidth?: number; label?: string; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-zinc-100 dark:text-zinc-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className={color}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("text-2xl font-black tracking-tighter", color)}
        >
          {value}%
        </motion.span>
        {label && <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</span>}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-primary-gradient flex items-center justify-center px-6">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Inter:wght@300;400;500;600&display=swap");

        .font-montserrat {
          font-family: "Montserrat", sans-serif;
        }

        .bg-primary-gradient {
          background: linear-gradient(135deg, #1a5f3f 0%, #0f3d2a 100%);
        }
      `}</style>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.1 } },
        }}
        className="w-full max-w-md"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              B
            </div>
            <span className="font-montserrat font-bold text-2xl text-white tracking-tight">
              BANK SAATHI
            </span>
          </div>
          <h1 className="text-4xl font-montserrat font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-white/60">Sign in to your account to continue</p>
        </motion.div>

        <motion.form
          variants={fadeInUp}
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-6"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="space-y-2">
            <label className="text-white/80 font-medium text-sm block">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                size={20}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-2">
            <label className="text-white/80 font-medium text-sm block">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            variants={fadeInUp}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white text-[#1A5F3F] font-bold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? "Signing in..." : "Sign In"}{" "}
            {!isLoading && <ArrowRight size={20} />}
          </motion.button>

          <motion.div
            variants={fadeInUp}
            className="text-center text-sm text-white/60"
          >
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-white font-semibold hover:text-white/80"
            >
              Sign up
            </Link>
          </motion.div>
        </motion.form>

        <motion.p
          variants={fadeInUp}
          className="text-center text-white/40 text-xs mt-8"
        >
          Demo: test@email.com | password123
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

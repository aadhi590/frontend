"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  BrainCircuit, 
  SearchCheck, 
  ArrowRight, 
  Play, 
  Check,
  Smartphone,
  ShieldAlert,
  Zap,
  Lock,
  Star
} from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1F2937] font-sans overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        .bg-primary-gradient {
          background: linear-gradient(135deg, #1A5F3F 0%, #0F3D2A 100%);
        }
        
        .text-gold {
          color: #D4AF37;
        }
        
        .neumorphic-card {
          border-radius: 24px;
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05), 0 1px 8px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.03);
        }

        .iphone-frame {
          width: 300px;
          height: 600px;
          border: 12px solid #1a1a1a;
          border-radius: 40px;
          position: relative;
          background: #000;
          overflow: hidden;
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.25);
        }

        .iphone-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 25px;
          background: #1a1a1a;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          z-index: 10;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <span className="font-montserrat font-bold text-xl tracking-tight text-[#1A5F3F]">
              BANK SAATHI
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#6B7280] hover:text-[#1A5F3F] transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-[#6B7280] hover:text-[#1A5F3F] transition-colors font-medium">How it Works</a>
            <a href="#pricing" className="text-[#6B7280] hover:text-[#1A5F3F] transition-colors font-medium">Pricing</a>
            <Link href="/dashboard" className="bg-primary-gradient text-white px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-transform">
              Launch App
            </Link>
          </div>
          
          <button className="md:hidden text-[#1F2937]">
            <Zap size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 bg-primary-gradient flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#10B981] blur-[120px] rounded-full"></div>
        </div>

        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative z-10 max-w-4xl w-full"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8">
            <span className="text-[#D4AF37] font-bold tracking-widest text-sm">🤝 BANK SAATHI</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="font-montserrat font-bold text-5xl md:text-7xl text-white leading-tight mb-6">
            Your Intelligent <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F59E0B]">
              Financial Copilot
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/80 mb-4 font-medium">
            "Evidence-weighted decisions before you pay"
          </motion.p>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Works even with incomplete data • Explains every decision • Graduated protection
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-white text-[#1A5F3F] font-bold rounded-full text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-white/30 font-bold rounded-full text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              Watch Demo <span className="text-white/60 text-sm font-normal">1:23</span> <Play size={18} fill="currentColor" />
            </button>
          </motion.div>

          {/* iPhone Mockup */}
          <motion.div 
            variants={fadeInUp}
            className="flex justify-center"
          >
            <div className="iphone-frame">
              <div className="iphone-notch"></div>
              <div className="w-full h-full bg-[#0F172A] p-6 pt-12 flex flex-col gap-4">
                <div className="flex justify-between items-center text-white/60 text-xs mb-4">
                  <span>10:41</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-3 h-3 border border-white/20 rounded-full"></div>
                    <div className="w-4 h-2 bg-white/40 rounded-sm"></div>
                  </div>
                </div>

                <div className="bg-[#1E293B] rounded-2xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/40 text-[10px] uppercase font-bold">Payment Review</span>
                    <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] px-2 py-0.5 rounded-full font-bold">Pending</span>
                  </div>
                  <div className="text-center py-4">
                    <span className="text-white/40 text-sm">Amount</span>
                    <h3 className="text-white text-3xl font-bold">₹5,000</h3>
                  </div>
                </div>

                <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center text-[#0F172A]">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h4 className="text-[#F59E0B] text-sm font-bold leading-tight">High Risk Alert</h4>
                      <p className="text-white/60 text-[10px]">Decision confidence: 72%</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#F59E0B] w-[72%] h-full"></div>
                    </div>
                    <p className="text-white/80 text-[10px] leading-relaxed">
                      Linguistic patterns match recent EMI scams. Incomplete merchant history detected.
                    </p>
                  </div>
                </div>

                <div className="mt-auto space-y-3 pb-4">
                  <button className="w-full py-3 bg-[#1A5F3F] text-white text-sm font-bold rounded-xl shadow-lg">
                    Approve with Caution
                  </button>
                  <button className="w-full py-3 bg-red-500/10 text-red-500 text-sm font-bold rounded-xl border border-red-500/20">
                    Reject Payment
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-20">
            <p className="text-white/40 text-sm font-medium mb-8">TRUSTED BY 50K+ INDIANS ACROSS ALL MAJOR BANKS</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-40 hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-xl">SBI</span>
              <span className="text-white font-bold text-xl">HDFC</span>
              <span className="text-white font-bold text-xl">ICICI</span>
              <span className="text-white font-bold text-xl">AXIS</span>
              <span className="text-white font-bold text-xl">KOTAK</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-montserrat text-4xl md:text-5xl font-bold text-[#1F2937] mb-6">
              Sophisticated Protection, <br />
              <span className="text-[#1A5F3F]">Simplified for You</span>
            </h2>
            <p className="text-[#6B7280] text-xl max-w-2xl mx-auto">
              Bank Saathi isn't just an app; it's a heuristic shield that evolves with the financial threat landscape.
            </p>
          </div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <ShieldCheck className="text-[#1A5F3F]" size={32} />,
                title: "Real-time Protection",
                desc: "Every UPI, card, and net banking transaction is scrutinized by our neural core before it leaves your account."
              },
              {
                icon: <BrainCircuit className="text-[#D4AF37]" size={32} />,
                title: "Smart Decisions",
                desc: "Advanced NLP analysis of merchant metadata and payment requests ensures you never fall for linguistic manipulation."
              },
              {
                icon: <SearchCheck className="text-[#10B981]" size={32} />,
                title: "Evidence-Based",
                desc: "We don't just say 'No'. We show you the exact evidence - from missing registry data to mismatching patterns."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="neumorphic-card p-10 group hover:scale-[1.02] transition-transform"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-primary-gradient group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[#6B7280] leading-relaxed mb-8">
                  {feature.desc}
                </p>
                <button className="flex items-center gap-2 text-[#1A5F3F] font-bold group-hover:gap-4 transition-all">
                  Learn More <ArrowRight size={18} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-montserrat text-4xl md:text-5xl font-bold text-[#1F2937] mb-6">
              The Matrix of <span className="text-[#1A5F3F]">Integrity</span>
            </h2>
            <p className="text-[#6B7280] text-xl">How Bank Saathi secures every capital deployment</p>
          </div>

          <div className="relative mt-24">
            {/* Timeline Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#1A5F3F] via-[#D4AF37] to-[#10B981] hidden md:block"></div>
            
            <div className="space-y-24">
              {[
                {
                  title: "Payment Attempt",
                  desc: "You initiate a payment via any app. Our copilot instantly intercepts the request metadata for analysis.",
                  icon: <Smartphone />
                },
                {
                  title: "Evidence Analysis",
                  desc: "The neural core cross-references merchant IDs, UPI strings, and transaction amounts against 40+ risk vectors.",
                  icon: <BrainCircuit />
                },
                {
                  title: "Smart Review",
                  desc: "If risk thresholds are exceeded, you receive a briefing showing confidence levels and identified red flags.",
                  icon: <ShieldAlert />
                },
                {
                  title: "Actionable Outcome",
                  desc: "Decide with clarity. Approve, reject, or set timer-based delays for high-value suspicious transfers.",
                  icon: <Check />
                }
              ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex-1 text-center md:text-right">
                    {idx % 2 === 0 ? (
                      <>
                        <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                        <p className="text-[#6B7280] leading-relaxed max-w-sm ml-auto">{step.desc}</p>
                      </>
                    ) : (
                      <div className="md:text-left">
                        <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                        <p className="text-[#6B7280] leading-relaxed max-w-sm">{step.desc}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white border-4 border-[#1A5F3F] flex items-center justify-center text-[#1A5F3F] shadow-xl">
                    {step.icon}
                  </div>
                  
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-montserrat text-4xl md:text-5xl font-bold text-[#1F2937] mb-6">
              Transparent <span className="text-[#1A5F3F]">Security</span>
            </h2>
            <p className="text-[#6B7280] text-xl">Choose the level of protection that fits your lifestyle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Free */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="neumorphic-card p-10 flex flex-col"
            >
              <div className="mb-8">
                <span className="text-[#6B7280] font-bold uppercase tracking-widest text-xs">Essential</span>
                <h3 className="text-3xl font-bold mt-2">FREE</h3>
                <p className="text-sm text-[#6B7280] mt-1">FOREVER</p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#10B981]" /> 50 transactions/month
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#10B981]" /> Basic Scam Detection
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#10B981]" /> Community Alerts
                </li>
              </ul>
              <button className="w-full py-4 bg-gray-100 text-[#1F2937] font-bold rounded-full hover:bg-gray-200 transition-colors">
                Get Started
              </button>
            </motion.div>

            {/* Pro */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="neumorphic-card p-10 bg-primary-gradient text-white flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-6 right-6 bg-[#D4AF37] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <div className="mb-8">
                <span className="text-white/60 font-bold uppercase tracking-widest text-xs">Guardian</span>
                <h3 className="text-3xl font-bold mt-2">₹99 <span className="text-lg font-normal text-white/60">/mo</span></h3>
                <p className="text-sm text-white/60 mt-1">Unlimited Safety</p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#D4AF37]" /> Unlimited Transactions
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#D4AF37]" /> Advanced Neural Scrutiny
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#D4AF37]" /> Priority Support
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#D4AF37]" /> Deep Explainability Panels
                </li>
              </ul>
              <button className="w-full py-4 bg-white text-[#1A5F3F] font-bold rounded-full shadow-lg hover:scale-105 transition-transform">
                Go Pro Now
              </button>
            </motion.div>

            {/* Enterprise */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="neumorphic-card p-10 flex flex-col"
            >
              <div className="mb-8">
                <span className="text-[#6B7280] font-bold uppercase tracking-widest text-xs">Sovereign</span>
                <h3 className="text-3xl font-bold mt-2">CUSTOM</h3>
                <p className="text-sm text-[#6B7280] mt-1">FOR BUSINESS</p>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#10B981]" /> Enterprise API Access
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#10B981]" /> Custom Risk Thresholds
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check size={18} className="text-[#10B981]" /> Team Management
                </li>
              </ul>
              <button className="w-full py-4 bg-gray-100 text-[#1F2937] font-bold rounded-full hover:bg-gray-200 transition-colors">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[#0F3D2A] text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="font-montserrat text-4xl md:text-5xl font-bold mb-6">
                Loved by the <br />
                <span className="text-[#D4AF37]">Vigilant</span>
              </h2>
              <p className="text-white/60 text-xl">Real stories from the Bank Saathi community</p>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ArrowRight size={20} className="rotate-180" />
              </button>
              <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "Bank Saathi caught a ₹25K EMI scam before I even realized it was suspicious. The explanation of why it was flagged was crystal clear.",
                author: "Priya S.",
                role: "Marketing Director",
                stars: 5
              },
              {
                quote: "I love how it explains the WHY. It's not just a blocker; it's a teacher that helps me understand modern financial threats.",
                author: "Arjun K.",
                role: "Tech Entrepreneur",
                stars: 5
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md p-10 rounded-[32px] border border-white/10">
                <div className="flex gap-1 mb-8">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4AF37" className="text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-xl leading-relaxed mb-10 italic">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10"></div>
                  <div>
                    <h4 className="font-bold">{t.author}</h4>
                    <p className="text-sm text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-10">
            Ready to secure your <span className="text-[#1A5F3F]">Financial Future?</span>
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16 text-[#6B7280] font-medium text-sm">
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#1A5F3F]" /> RBI Compliant</span>
            <span className="flex items-center gap-2"><Lock size={18} className="text-[#1A5F3F]" /> AES-256 Encryption</span>
            <span className="flex items-center gap-2"><Zap size={18} className="text-[#1A5F3F]" /> 50K+ Active Users</span>
          </div>

          <Link href="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 bg-primary-gradient text-white font-bold rounded-full text-xl shadow-2xl hover:scale-105 transition-transform mb-20">
            Get Started Free <ArrowRight size={24} />
          </Link>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-left pt-20 border-t border-gray-100">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  B
                </div>
                <span className="font-montserrat font-bold text-lg tracking-tight text-[#1A5F3F]">
                  BANK SAATHI
                </span>
              </div>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                India's leading intelligent financial copilot. Secure, evidence-based, and human-centric.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-[#6B7280]">
                <li><a href="#" className="hover:text-[#1A5F3F]">Features</a></li>
                <li><a href="#" className="hover:text-[#1A5F3F]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#1A5F3F]">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-[#6B7280]">
                <li><a href="#" className="hover:text-[#1A5F3F]">About Us</a></li>
                <li><a href="#" className="hover:text-[#1A5F3F]">Careers</a></li>
                <li><a href="#" className="hover:text-[#1A5F3F]">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-[#6B7280]">
                <li><a href="#" className="hover:text-[#1A5F3F]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#1A5F3F]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#1A5F3F]">Security Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-gray-100 text-sm text-[#6B7280]">
            © 2026 Bank Saathi Technologies Private Limited. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

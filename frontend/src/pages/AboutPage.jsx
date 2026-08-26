import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Leaf,
  ShieldCheck,
  Users,
  Sparkles,
  Gift
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-white">
      
      {/* Hero Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-midnight-900/80 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-glow-amber">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>GL Bajaj Campus Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase text-gradient-celestial">
          Share Books Freely. Zero Waste Academic Network.
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          BookCycle connects students across <strong>GL Bajaj Institute of Technology</strong> to donate, exchange, and access engineering syllabus textbooks for <strong>100% Free (₹0)</strong>.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-aesthetic p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold">
            <Gift className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">100% Free Access</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            By connecting student donors directly on campus, all textbooks are shared for ₹0, eliminating textbook costs for every semester.
          </p>
        </div>

        <div className="glass-aesthetic p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Waste Campus</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Reusing printed engineering textbooks prevents paper waste and saves thousands of trees across our college campus every year.
          </p>
        </div>

        <div className="glass-aesthetic p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">GL Bajaj Verified</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All listings are curated by campus admins (Priyanshi Chaudhary, Purvi Chaurasia, Riya Singh, and Saksham Singh) for reliable on-campus handover.
          </p>
        </div>
      </div>

      {/* Campus Admin Team */}
      <div className="glass-aesthetic p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">GL Bajaj Platform Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. Priyanshi Chaudhary */}
          <div className="p-4 rounded-2xl bg-midnight-950/70 border border-amber-400/20 flex items-center gap-3">
            <img src="/avatars/priyanshi.jpg" alt="Priyanshi Chaudhary" className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400" />
            <div>
              <p className="text-xs font-bold text-white">Priyanshi Chaudhary</p>
              <p className="text-[10px] text-amber-300">Platform Admin</p>
            </div>
          </div>
          {/* 2. Purvi Chaurasia */}
          <div className="p-4 rounded-2xl bg-midnight-950/70 border border-amber-400/20 flex items-center gap-3">
            <img src="/avatars/makima.jpg" alt="Purvi Chaurasia" className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400" />
            <div>
              <p className="text-xs font-bold text-white">Purvi Chaurasia</p>
              <p className="text-[10px] text-amber-300">Platform Admin</p>
            </div>
          </div>
          {/* 3. Riya Singh */}
          <div className="p-4 rounded-2xl bg-midnight-950/70 border border-amber-400/20 flex items-center gap-3">
            <img src="/avatars/reze.jpg" alt="Riya Singh" className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400" />
            <div>
              <p className="text-xs font-bold text-white">Riya Singh</p>
              <p className="text-[10px] text-amber-300">Platform Admin</p>
            </div>
          </div>
          {/* 4. Saksham Singh */}
          <div className="p-4 rounded-2xl bg-midnight-950/70 border border-amber-400/20 flex items-center gap-3">
            <img src="/avatars/denji.jpg" alt="Saksham Singh" className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400" />
            <div>
              <p className="text-xs font-bold text-white">Saksham Singh</p>
              <p className="text-[10px] text-amber-300">Platform Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-600/30 via-midnight-900 to-amber-600/20 border border-amber-400/30 text-center space-y-4 shadow-celestial-card">
        <h2 className="text-2xl font-extrabold text-white">Ready to share or get textbooks?</h2>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Explore all available engineering, mathematics, and entrance exam coursebooks at GL Bajaj Institute of Technology.
        </p>
        <div className="pt-2">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-glow-amber transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Free Textbooks</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

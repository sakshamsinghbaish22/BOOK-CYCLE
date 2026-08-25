import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Sparkles, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center text-white">
      <div className="max-w-md space-y-5 p-8 rounded-3xl glass-aesthetic border border-amber-400/30 shadow-celestial-card">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-400 border border-amber-400/40 rounded-3xl flex items-center justify-center mx-auto shadow-glow-amber">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black text-white text-gradient-celestial tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-slate-100">File / Page Not Found (FNF)</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The requested textbook page or document could not be found in the BookCycle library.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-glow-amber transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-5 py-3 bg-midnight-950/80 hover:bg-midnight-900 border border-white/15 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Browse Library</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Leaf, ShieldCheck, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-midnight-950/90 text-slate-400 pt-16 pb-12 border-t border-amber-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center p-1 shadow-glow-amber">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              </div>
              <span className="font-extrabold text-base tracking-[0.2em] text-white uppercase">
                BOOK<span className="text-amber-400 font-light">CYCLE</span> <span className="text-xs text-amber-300/80 font-normal">/ GL BAJAJ</span>
              </span>
            </Link>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              Student platform to share and donate academic textbooks for 100% free with zero waste across GL Bajaj Institute of Technology.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-amber-300">
                <Leaf className="w-3.5 h-3.5 text-amber-400" />
                Zero Waste Campus
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                GL Bajaj Verified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-300 mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/browse" className="text-slate-400 hover:text-amber-300 transition-colors">
                  All Textbooks
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Computer+Science+%26+AI" className="text-slate-400 hover:text-amber-300 transition-colors">
                  Computer Science & AI
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Applied+Mathematics" className="text-slate-400 hover:text-amber-300 transition-colors">
                  Applied Mathematics
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Competitive+Entrance+Exams" className="text-slate-400 hover:text-amber-300 transition-colors">
                  GATE & JEE Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Admins */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-300 mb-4">
              GL Bajaj Admins
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-300 font-semibold">🛡️ Priyanshi Chaudhary</li>
              <li className="text-slate-300 font-semibold">🛡️ Purvi Chaurasia</li>
              <li className="text-slate-300 font-semibold">🛡️ Riya Singh</li>
              <li className="text-slate-300 font-semibold">🛡️ Saksham Singh</li>
            </ul>
          </div>

          {/* Campus Support */}
          <div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-300 mb-4">
              Campus Support
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              GL Bajaj Institute of Technology & Management, Knowledge Park III, Greater Noida.
            </p>
            <div className="pt-2">
              <a href="mailto:support@bookcycle.edu" className="text-xs text-amber-400 hover:underline">
                support@bookcycle.edu
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BookCycle • GL Bajaj Institute of Technology.</p>
          <div className="text-center font-extrabold tracking-[0.3em] uppercase text-amber-400/80 hover:text-amber-300 transition-colors">
            GL BAJAJ STUDENT NETWORK
          </div>
        </div>
      </div>
    </footer>
  );
}

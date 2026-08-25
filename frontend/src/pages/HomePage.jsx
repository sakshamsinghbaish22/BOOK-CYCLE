import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Users,
  Search,
  GraduationCap,
  Calculator,
  Briefcase,
  Code,
  Layers,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { bookService } from '../services/bookService';
import BookCard from '../components/BookCard';
import { BookGridSkeleton } from '../components/LoadingSkeleton';

// Defined academic disciplines
const DEFINED_TOPIC_SECTIONS = [
  {
    id: 'cs-ai',
    title: 'Computer Science & AI',
    category: 'Computer Science & AI',
    icon: Code,
    color: 'border-amber-400/40 bg-amber-500/10 text-amber-300',
    description: 'Data structures, algorithms, operating systems & artificial intelligence.',
    subtopics: [
      'Data Structures & Algorithms (DSA)',
      'Systems Programming & OS',
      'Artificial Intelligence'
    ]
  },
  {
    id: 'applied-math',
    title: 'Applied Mathematics',
    category: 'Applied Mathematics',
    icon: Calculator,
    color: 'border-yellow-400/40 bg-yellow-500/10 text-yellow-300',
    description: 'Engineering calculus, linear algebra, and differential equations.',
    subtopics: [
      'Differential Equations & Calculus',
      'Linear Algebra & Matrices'
    ]
  },
  {
    id: 'competitive',
    title: 'Competitive Entrance Exams',
    category: 'Competitive Entrance Exams',
    icon: GraduationCap,
    color: 'border-amber-300/40 bg-amber-400/10 text-amber-300',
    description: 'Foundation syllabus textbooks for JEE Advanced, GATE, and placements.',
    subtopics: [
      'JEE Physics, Chemistry & Math',
      'GATE Engineering Syllabus'
    ]
  },
  {
    id: 'mgmt',
    title: 'Business & Management',
    category: 'Business & Management',
    icon: Briefcase,
    color: 'border-amber-500/40 bg-amber-600/10 text-amber-300',
    description: 'Marketing strategy, core management, and business fundamentals.',
    subtopics: [
      'Marketing Management',
      'Business Foundations'
    ]
  }
];

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.getBooks({ limit: 20, sort_by: 'newest' });
        setBooks(data.items || []);
      } catch (err) {
        console.error('Failed to load books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = activeCategory === 'All'
    ? books
    : books.filter(b => b.category === activeCategory || b.category?.includes(activeCategory));

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 text-slate-100 min-h-screen">
      
      {/* 🌟 HERO SECTION: CINEMATIC CELESTIAL VIBE */}
      <section className="relative pt-20 pb-20 sm:pb-28">
        
        {/* Subtle Ethereal Golden Light Corona aligned with the central sunbeam */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] rounded-full blur-[140px] opacity-30 pointer-events-none -z-10 bg-amber-400/50"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          
          {/* Minimalist Campus Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-amber-400/30 text-xs font-semibold text-amber-300/90 shadow-sm backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>GL Bajaj Institute of Technology • Greater Noida</span>
          </div>

          {/* Main Title */}
          <div className="space-y-3">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase leading-none text-gradient-celestial drop-shadow-2xl">
              BOOK<span className="text-amber-400 font-light">CYCLE</span>
            </h1>
            <p className="text-sm sm:text-base font-light tracking-[0.25em] uppercase text-amber-200/80">
              Campus Textbook Sharing & Knowledge Network
            </p>
          </div>

          {/* Tagline */}
          <p className="text-sm sm:text-lg text-slate-200/90 font-normal leading-relaxed max-w-xl mx-auto drop-shadow-md">
            Share and claim syllabus textbooks for <span className="text-amber-300 font-bold underline decoration-amber-400/50 underline-offset-4">100% Free (₹0)</span> with fellow students at GL Bajaj.
          </p>

          {/* Cinematic Search Bar */}
          <div className="pt-2 max-w-xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/browse?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="relative flex items-center bg-midnight-950/60 backdrop-blur-2xl p-2 rounded-2xl border border-amber-400/30 shadow-2xl focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/40 transition-all"
            >
              <Search className="w-5 h-5 text-amber-400/80 ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. Algorithms, Physics, Mathematics)..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-glow-amber transition-all shrink-0"
              >
                Explore
              </button>
            </form>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              to="/browse"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-extrabold uppercase tracking-widest transition-all shadow-glow-amber flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Books (Free)</span>
            </Link>
            <Link
              to="/create-listing"
              className="px-7 py-3.5 rounded-xl bg-midnight-900/60 hover:bg-midnight-800/80 border border-amber-400/30 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-xl"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Share a Book</span>
            </Link>
          </div>

          {/* Clean Frosted Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto pt-8">
            <div className="p-4 rounded-2xl glass-aesthetic text-center">
              <p className="text-2xl font-extrabold text-white">4</p>
              <p className="text-[11px] text-slate-300/80 uppercase tracking-wider mt-0.5">GL Bajaj Admins</p>
            </div>
            <div className="p-4 rounded-2xl glass-aesthetic text-center">
              <p className="text-2xl font-extrabold text-amber-400">100% Free</p>
              <p className="text-[11px] text-slate-300/80 uppercase tracking-wider mt-0.5">₹0 Student Cost</p>
            </div>
            <div className="p-4 rounded-2xl glass-aesthetic text-center">
              <p className="text-2xl font-extrabold text-yellow-400">5</p>
              <p className="text-[11px] text-slate-300/80 uppercase tracking-wider mt-0.5">Textbooks Listed</p>
            </div>
            <div className="p-4 rounded-2xl glass-aesthetic text-center">
              <p className="text-2xl font-extrabold text-amber-300">GL Bajaj</p>
              <p className="text-[11px] text-slate-300/80 uppercase tracking-wider mt-0.5">Campus Network</p>
            </div>
          </div>

        </div>
      </section>

      {/* 📚 DEFINED ACADEMIC TOPICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Academic Disciplines & Defined Topics
              </h2>
            </div>
            <p className="text-xs text-slate-300/80 mt-0.5">
              Organized curriculum topics and course materials at GL Bajaj
            </p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 uppercase tracking-wider shrink-0"
          >
            Explore Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Defined Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {DEFINED_TOPIC_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                className="p-5 rounded-3xl glass-aesthetic-card flex flex-col justify-between space-y-4 glass-card-hover"
              >
                <div>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${sec.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-sm font-extrabold text-white mt-3">{sec.title}</h3>
                  <p className="text-[11px] text-slate-300/80 mt-1 leading-relaxed">{sec.description}</p>

                  <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1">
                    {sec.subtopics.map((st) => (
                      <Link
                        key={st}
                        to={`/browse?search=${encodeURIComponent(st)}`}
                        className="block text-[11px] text-slate-300/90 hover:text-amber-300 truncate"
                      >
                        • {st}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/browse?category=${encodeURIComponent(sec.category)}`}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-white/10 hover:border-amber-400 text-[11px] font-bold uppercase tracking-wider transition-all text-center block"
                >
                  View Category
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 📖 TEXTBOOK SHELF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Shared Textbooks on Campus
            </h2>
            <p className="text-xs text-slate-300/80 mt-0.5">
              Available for immediate pickup at GL Bajaj
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'Computer Science & AI', 'Competitive Entrance Exams', 'Applied Mathematics', 'Business & Management'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === tab
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-glow-amber'
                    : 'bg-midnight-950/60 border border-white/10 text-slate-300 hover:text-white hover:bg-midnight-800/70 backdrop-blur-md'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <BookGridSkeleton count={4} />
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id || book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center glass-aesthetic rounded-3xl border border-white/10 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-white">No books found in this topic</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
            >
              View All Books
            </button>
          </div>
        )}
      </section>

      {/* 👥 GL BAJAJ 4-MEMBER ADMIN GROUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl glass-aesthetic border border-amber-400/20">
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white">GL Bajaj Campus Members</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Saksham Singh */}
            <div className="p-4 rounded-2xl bg-midnight-950/70 border border-amber-400/30 flex items-center gap-3.5 shadow-sm hover:border-amber-400/60 transition-all">
              <img
                src="/avatars/denji.jpg"
                alt="Saksham Singh"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 shadow-glow-amber shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white truncate">Saksham Singh</p>
                <p className="text-xs text-slate-300 truncate">GL Bajaj Institute of Technology</p>
              </div>
            </div>

            {/* Purvi */}
            <div className="p-4 rounded-2xl bg-midnight-950/70 border border-amber-400/20 flex items-center gap-3.5 shadow-sm hover:border-amber-400/50 transition-all">
              <img
                src="/avatars/makima.jpg"
                alt="Purvi"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400/60 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white truncate">Purvi</p>
                <p className="text-xs text-slate-300 truncate">GL Bajaj Institute of Technology</p>
              </div>
            </div>

            {/* Priyanshi */}
            <div className="p-4 rounded-2xl bg-midnight-950/70 border border-amber-400/20 flex items-center gap-3.5 shadow-sm hover:border-amber-400/50 transition-all">
              <img
                src="/avatars/power.jpg"
                alt="Priyanshi"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400/60 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white truncate">Priyanshi</p>
                <p className="text-xs text-slate-300 truncate">GL Bajaj Institute of Technology</p>
              </div>
            </div>

            {/* Riya Singh */}
            <div className="p-4 rounded-2xl bg-midnight-950/70 border border-amber-400/20 flex items-center gap-3.5 shadow-sm hover:border-amber-400/50 transition-all">
              <img
                src="/avatars/reze.jpg"
                alt="Riya Singh"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400/60 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white truncate">Riya Singh</p>
                <p className="text-xs text-slate-300 truncate">GL Bajaj Institute of Technology</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

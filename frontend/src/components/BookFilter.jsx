import React from 'react';
import { Filter, RotateCcw, IndianRupee, BookOpen, Layers, Check } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Computer Science & AI',
  'Competitive Entrance Exams',
  'Applied Mathematics',
  'Core Engineering',
  'Business & Management',
  'Medical & Biosciences',
  'Literature & Humanities',
  'Natural Sciences',
];

const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'];

const LISTING_TYPES = [
  { id: 'All', label: 'All Listings' },
  { id: 'Sell', label: 'For Sale' },
  { id: 'Donate', label: 'Free / Donate' },
  { id: 'Exchange', label: 'Exchange' },
];

export default function BookFilter({ filters, onFilterChange, onReset }) {
  return (
    <div className="bg-slatebg-800/80 backdrop-blur-md rounded-3xl border border-crimson-600/20 p-6 shadow-palette-card space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 font-extrabold text-white text-xs uppercase tracking-wider">
          <Filter className="w-4 h-4 text-crimson-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-crimson-300 transition-colors uppercase tracking-wider"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Listing Type Filter */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2.5">
          Listing Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LISTING_TYPES.map((type) => {
            const isSelected = (filters.listing_type || 'All') === type.id;
            return (
              <button
                key={type.id}
                onClick={() => onFilterChange('listing_type', type.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-crimson-600/20 border-crimson-500 text-crimson-300 shadow-glow-crimson font-bold'
                    : 'border-white/10 text-slate-300 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span>{type.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-crimson-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2.5">
          Academic Category
        </label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full bg-slatebg-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-crimson-500 focus:ring-1 focus:ring-crimson-500 transition-all"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-slatebg-900 text-white">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Condition Filter */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2.5">
          Physical Condition
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CONDITIONS.map((cond) => {
            const isSelected = (filters.condition || 'All') === cond;
            return (
              <button
                key={cond}
                onClick={() => onFilterChange('condition', cond)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-crimson-600 text-white font-bold shadow-glow-crimson'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter in Rupees (₹) */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2.5">
          Maximum Price (₹ INR)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1500"
            step="50"
            value={filters.max_price || 1500}
            onChange={(e) => onFilterChange('max_price', Number(e.target.value))}
            className="w-full h-2 bg-slatebg-900 rounded-lg appearance-none cursor-pointer accent-crimson-500"
          />
          <span className="text-xs font-bold text-crimson-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg shrink-0">
            ₹{filters.max_price || 1500}
          </span>
        </div>
      </div>

      {/* College Filter */}
      <div>
        <label className="block text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2.5">
          University / Campus
        </label>
        <input
          type="text"
          placeholder="e.g. IIT Delhi, BITS, DTU..."
          value={filters.college || ''}
          onChange={(e) => onFilterChange('college', e.target.value)}
          className="w-full bg-slatebg-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-crimson-500 focus:ring-1 focus:ring-crimson-500"
        />
      </div>
    </div>
  );
}

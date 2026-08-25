import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = "Search by textbook title, author, course, ISBN...", initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slatebg-900/90 border border-white/15 rounded-2xl pl-11 pr-24 py-3 text-xs text-white placeholder-slate-400 shadow-sm focus:outline-none focus:border-crimson-500 focus:ring-1 focus:ring-crimson-500 transition-all"
      />
      <div className="absolute right-2 flex items-center gap-1.5">
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="px-3.5 py-1.5 bg-crimson-600 hover:bg-crimson-500 text-white text-[11px] font-extrabold uppercase tracking-wider rounded-xl shadow-glow-crimson transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}

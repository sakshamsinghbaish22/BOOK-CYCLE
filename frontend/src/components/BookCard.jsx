import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Gift, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function BookCard({ book }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const isSaved = isInWishlist(book.id || book._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in or create an account to save books to your wishlist.');
      return;
    }
    toggleWishlist(book.id || book._id);
  };

  const coverImage =
    book.images && book.images.length > 0
      ? book.images[0].startsWith('/uploads')
        ? `http://localhost:8000${book.images[0]}`
        : book.images[0]
      : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group relative flex flex-col glass-aesthetic-card rounded-3xl overflow-hidden glass-card-hover">
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
        <img
          src={coverImage}
          alt={book.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />

        {/* 100% Free Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-glow-amber">
            <Gift className="w-3 h-3 text-slate-950" />
            100% Free
          </span>
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <button
          onClick={handleWishlistClick}
          aria-label="Save to wishlist"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-300 hover:text-amber-400 shadow-md transition-transform active:scale-90 hover:scale-110"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isSaved ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        </button>

        {/* Condition Tag (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md border border-white/10 text-slate-300">
            {book.condition}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5 space-y-2">
        {/* Category */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-bold text-amber-400 uppercase tracking-wider truncate max-w-[170px]">
            {book.category}
          </span>
          {book.edition && (
            <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
              {book.edition}
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          to={`/books/${book.id || book._id}`}
          className="font-bold text-sm sm:text-base text-white line-clamp-2 hover:text-amber-300 transition-colors group-hover:text-amber-300"
          title={book.title}
        >
          {book.title}
        </Link>

        {/* Defined Topic & Module Tag */}
        {book.subject && (
          <p className="text-[11px] text-slate-300/90 bg-midnight-950/60 px-2.5 py-1 rounded-lg border border-white/10 line-clamp-1">
            <span className="text-amber-400 font-semibold">Module:</span> {book.subject}
          </p>
        )}

        {/* Author */}
        <p className="text-xs text-slate-400 line-clamp-1">
          by <span className="font-medium text-slate-200">{book.author}</span>
        </p>

        {/* Campus Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1 mt-auto">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">{book.college || 'GL Bajaj Institute of Technology'}</span>
        </div>

        {/* Bottom Price in ₹ & Explore Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-2">
          <div>
            <span className="text-sm font-extrabold text-amber-400 uppercase tracking-wider block">
              100% Free / ₹0
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">GL Bajaj Giveaway</span>
          </div>

          <Link
            to={`/books/${book.id || book._id}`}
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 border border-amber-400/30 rounded-xl transition-all shadow-xs"
          >
            Claim Free
          </Link>
        </div>
      </div>
    </div>
  );
}

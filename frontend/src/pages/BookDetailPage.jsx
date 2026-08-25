import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  MapPin,
  Heart,
  Share2,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  ArrowRightLeft,
  Gift,
  DollarSign,
  Star,
  CheckCircle2,
  Trash2,
  Edit,
  ArrowLeft,
  ChevronRight,
  Flame
} from 'lucide-react';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency, formatDate, getConditionColor, getListingTypeBadge, getStatusBadge } from '../utils/formatters';
import RequestModal from '../components/RequestModal';
import ReportModal from '../components/ReportModal';
import { BookDetailSkeleton } from '../components/LoadingSkeleton';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [error, setError] = useState('');

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBookById(id);
      setBook(data);
    } catch (err) {
      setError(err.parsedMessage || 'Book not found or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const isOwner = user && book && (book.owner_id === user.id || book.owner_id === user._id);
  const isSaved = book ? isInWishlist(book.id || book._id) : false;

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist(book.id || book._id);
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await bookService.deleteBook(book.id || book._id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.parsedMessage || 'Failed to delete listing.');
    }
  };

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/messages?user=${book.owner_id}&book=${book.id || book._id}`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setSuccessToast('Link copied to clipboard!');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  if (loading) return <BookDetailSkeleton />;

  if (error || !book) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-dark-900 rounded-3xl border border-white/10 text-center space-y-4 shadow-xl text-white">
        <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Listing Unavailable</h2>
        <p className="text-xs text-slate-400">{error || 'This book could not be found.'}</p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-copper-600 hover:bg-copper-500 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const typeBadge = getListingTypeBadge(book.listing_type);
  const images = book.images && book.images.length > 0
    ? book.images.map((img) => (img.startsWith('/uploads') ? `http://localhost:8000${img}` : img))
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      
      {/* Toast alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-dark-900 text-white px-5 py-3 rounded-2xl border border-copper-400 shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-copper-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/browse" className="hover:text-white">Market</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-copper-300 font-semibold truncate max-w-[200px]">{book.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Studio Showcase Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-dark-950 border border-white/15 shadow-2xl">
            <img
              src={images[selectedImage]}
              alt={book.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Condition Pill */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider bg-black/80 backdrop-blur-md border border-white/15 text-copper-300">
                {book.condition} Condition
              </span>
            </div>
            {/* Wishlist Heart */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-900/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-300 hover:text-rose-500 shadow-md transition-transform active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`}
              />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-copper-400 ring-2 ring-copper-400/30'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Book Details & Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider bg-white/5 border border-white/15 text-copper-300">
                {book.listing_type}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-dark-900 border border-white/10 text-slate-300">
                {book.status}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-auto">
                Listed: {formatDate(book.created_at)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {book.title}
            </h1>

            <p className="text-sm text-slate-400">
              by <span className="font-semibold text-white">{book.author}</span>
            </p>
          </div>

          {/* Pricing Highlight Banner */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-white/15 shadow-dark-card flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                {book.listing_type === 'Sell' ? 'Student Asking Price' : book.listing_type}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                {book.listing_type === 'Sell' ? (
                  <span className="text-3xl font-extrabold text-white">
                    ₹{Number(book.price || 0).toLocaleString('en-IN')}
                  </span>
                ) : book.listing_type === 'Donate' ? (
                  <span className="text-2xl font-extrabold text-emerald-400">
                    100% Free / Donation (₹0)
                  </span>
                ) : (
                  <span className="text-xl font-bold text-purple-400">
                    Exchange Preferred
                  </span>
                )}
              </div>
              {book.exchange_preferences && (
                <p className="text-xs text-purple-300 mt-2 bg-purple-950/40 border border-purple-800/50 p-2.5 rounded-xl font-medium">
                  🔄 <strong>Wanted:</strong> {book.exchange_preferences}
                </p>
              )}
            </div>

            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-crimson-400" />
                {book.college || 'Campus'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {book.location_details || 'Campus Library / Hostel Area'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!isOwner ? (
              <>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                      return;
                    }
                    setRequestModalOpen(true);
                  }}
                  disabled={book.status !== 'available'}
                  className="flex-1 min-w-[200px] py-3.5 px-6 bg-crimson-600 hover:bg-crimson-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-glow-crimson transition-all flex items-center justify-center gap-2"
                >
                  {book.listing_type === 'Sell' ? (
                    <>
                      <span>Request to Buy (₹{Number(book.price || 0).toLocaleString('en-IN')})</span>
                    </>
                  ) : book.listing_type === 'Donate' ? (
                    <>
                      <Gift className="w-4 h-4" />
                      <span>Claim Free Donation</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>Offer Book Exchange</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleContactOwner}
                  className="px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-copper-400" />
                  <span>Contact Owner</span>
                </button>

                <button
                  onClick={handleShare}
                  aria-label="Share listing"
                  className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 rounded-xl"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 w-full">
                <Link
                  to={`/edit-listing/${book.id || book._id}`}
                  className="flex-1 py-3 px-4 bg-copper-600/20 hover:bg-copper-600/30 text-copper-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-copper-500/40"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Listing</span>
                </Link>
                <button
                  onClick={handleDeleteListing}
                  className="py-3 px-4 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-rose-800/40"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="bg-dark-900 rounded-2xl border border-white/10 p-5 space-y-3 shadow-xs">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Textbook Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Discipline</p>
                <p className="text-xs font-bold text-slate-200">{book.category}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Subject</p>
                <p className="text-xs font-bold text-slate-200">{book.subject || 'General'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Edition</p>
                <p className="text-xs font-bold text-slate-200">{book.edition || 'Standard'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">ISBN</p>
                <p className="text-xs font-mono font-bold text-copper-300">{book.isbn || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Condition</p>
                <p className="text-xs font-bold text-slate-200">{book.condition}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Campus Location</p>
                <p className="text-xs font-bold text-slate-200 truncate">{book.college || 'Campus'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-dark-900 rounded-2xl border border-white/10 p-5 space-y-2 shadow-xs">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Description & Notes
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          </div>

          {/* Owner Profile Card */}
          <div className="bg-dark-900 rounded-2xl border border-white/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={book.owner_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${book.owner_name || 'Owner'}`}
                alt={book.owner_name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/15"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white">{book.owner_name}</h4>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {book.owner_rating ? book.owner_rating.toFixed(1) : '5.0'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{book.owner_college || book.college}</p>
              </div>
            </div>

            <Link
              to={`/profile/${book.owner_id}`}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl border border-white/15 transition-colors"
            >
              View Profile
            </Link>
          </div>

          {/* Report Button */}
          <div className="pt-2 text-right">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                  return;
                }
                setReportModalOpen(true);
              }}
              className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors inline-flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Report inappropriate or incorrect listing</span>
            </button>
          </div>

        </div>
      </div>

      <RequestModal
        book={book}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSuccess={() => {
          setSuccessToast('Your request has been sent to the book owner!');
          fetchBookDetails();
        }}
      />

      <ReportModal
        targetType="book"
        targetId={book.id || book._id}
        targetTitle={book.title}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}

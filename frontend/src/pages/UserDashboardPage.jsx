import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Inbox,
  Send,
  Heart,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
  Edit,
  Trash2,
  Star,
  ExternalLink,
  MessageSquare,
  DollarSign,
  Gift,
  ArrowRightLeft,
  Check,
  X,
  AlertCircle,
  Flame,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import { requestService } from '../services/requestService';
import { transactionService } from '../services/transactionService';
import { formatCurrency, formatDate, getListingTypeBadge, getStatusBadge } from '../utils/formatters';
import ReviewModal from '../components/ReviewModal';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [myBooks, setMyBooks] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTxForReview, setSelectedTxForReview] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [booksData, incData, sentData, txData, wishData] = await Promise.all([
        bookService.getBooks({ limit: 100 }),
        requestService.getReceivedRequests(),
        requestService.getSentRequests(),
        transactionService.getMyTransactions(),
        bookService.getWishlist(),
      ]);

      const myId = user?.id || user?._id;
      const filteredMyBooks = (booksData.items || []).filter(
        (b) => b.owner_id === myId || b.owner_email === user?.email
      );

      setMyBooks(filteredMyBooks);
      setIncomingRequests(incData || []);
      setSentRequests(sentData || []);
      setTransactions(txData || []);
      setWishlist(wishData || []);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleAcceptRequest = async (reqId) => {
    try {
      await requestService.updateRequestStatus(reqId, 'accepted');
      fetchDashboardData();
    } catch (err) {
      alert(err.parsedMessage || 'Failed to accept request.');
    }
  };

  const handleRejectRequest = async (reqId) => {
    try {
      await requestService.updateRequestStatus(reqId, 'rejected');
      fetchDashboardData();
    } catch (err) {
      alert(err.parsedMessage || 'Failed to reject request.');
    }
  };

  const handleCancelSentRequest = async (reqId) => {
    if (!window.confirm('Cancel this pending book request?')) return;
    try {
      await requestService.updateRequestStatus(reqId, 'cancelled');
      fetchDashboardData();
    } catch (err) {
      alert(err.parsedMessage || 'Failed to cancel request.');
    }
  };

  const handleCompleteTransaction = async (txId) => {
    if (!window.confirm('Confirm that book handoff and exchange has been completed?')) return;
    try {
      await transactionService.updateTransactionStatus(txId, 'completed');
      fetchDashboardData();
    } catch (err) {
      alert(err.parsedMessage || 'Failed to complete transaction.');
    }
  };

  const handleDeleteListing = async (bookId) => {
    if (!window.confirm('Permanently delete this textbook listing?')) return;
    try {
      await bookService.deleteBook(bookId);
      fetchDashboardData();
    } catch (err) {
      alert(err.parsedMessage || 'Failed to delete book.');
    }
  };

  const handleRemoveWishlist = async (bookId) => {
    try {
      await bookService.removeFromWishlist(bookId);
      setWishlist((prev) => prev.filter((b) => (b.id || b._id) !== bookId));
    } catch (err) {
      console.error(err);
    }
  };

  const pendingIncoming = incomingRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white">
      
      {/* Header Profile Greeting */}
      <div className="glass-aesthetic rounded-3xl p-6 sm:p-8 border border-amber-400/20 shadow-celestial-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-glow-amber"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{user?.name}</h1>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {user?.rating ? user.rating.toFixed(1) : '5.0'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{user?.college} • Member since {formatDate(user?.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/edit-profile"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs rounded-xl border border-white/10 transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            to="/create-listing"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-amber transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Book</span>
          </Link>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <button
          onClick={() => handleTabChange('listings')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'listings' ? 'bg-copper-500/20 border-copper-400 shadow-glow-copper' : 'bg-dark-900 border-white/10 hover:border-white/20'
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">My Listings</p>
          <p className="text-2xl font-extrabold text-white mt-1">{myBooks.length}</p>
        </button>

        <button
          onClick={() => handleTabChange('incoming')}
          className={`p-4 rounded-2xl border text-left transition-all relative ${
            activeTab === 'incoming' ? 'bg-copper-500/20 border-copper-400 shadow-glow-copper' : 'bg-dark-900 border-white/10 hover:border-white/20'
          }`}
        >
          {pendingIncoming > 0 && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          )}
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Incoming Requests</p>
          <p className="text-2xl font-extrabold text-white mt-1">{incomingRequests.length}</p>
        </button>

        <button
          onClick={() => handleTabChange('sent')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'sent' ? 'bg-copper-500/20 border-copper-400 shadow-glow-copper' : 'bg-dark-900 border-white/10 hover:border-white/20'
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Sent Requests</p>
          <p className="text-2xl font-extrabold text-white mt-1">{sentRequests.length}</p>
        </button>

        <button
          onClick={() => handleTabChange('transactions')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'transactions' ? 'bg-copper-500/20 border-copper-400 shadow-glow-copper' : 'bg-dark-900 border-white/10 hover:border-white/20'
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Handoffs & Deals</p>
          <p className="text-2xl font-extrabold text-white mt-1">{transactions.length}</p>
        </button>

        <button
          onClick={() => handleTabChange('wishlist')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'wishlist' ? 'bg-copper-500/20 border-copper-400 shadow-glow-copper' : 'bg-dark-900 border-white/10 hover:border-white/20'
          }`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Saved Wishlist</p>
          <p className="text-2xl font-extrabold text-white mt-1">{wishlist.length}</p>
        </button>
      </div>

      {/* Tabs Content */}
      <div className="bg-dark-900 rounded-3xl border border-white/10 shadow-dark-card p-6 sm:p-8 space-y-6">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-copper-400" />
                <span>Pending Incoming Requests ({pendingIncoming})</span>
              </h2>
              {incomingRequests.filter((r) => r.status === 'pending').length > 0 ? (
                <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden">
                  {incomingRequests
                    .filter((r) => r.status === 'pending')
                    .map((req) => (
                      <div key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={req.book_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'}
                            alt=""
                            className="w-12 h-14 object-cover rounded-lg border border-white/10"
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-copper-300 bg-copper-500/15 px-2 py-0.5 rounded-md">
                              {req.request_type} Request
                            </span>
                            <h4 className="font-bold text-xs text-white mt-1">{req.book_title}</h4>
                            <p className="text-xs text-slate-400">From: <strong>{req.requester_name}</strong> ({req.requester_college})</p>
                            {req.message && <p className="text-xs italic text-slate-300 mt-1">"{req.message}"</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-xl"
                          >
                            <X className="w-3.5 h-3.5" /> Decline
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-dark-950 rounded-2xl border border-white/10">
                  <p className="text-xs text-slate-400">No pending incoming requests at the moment.</p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-copper-400" />
                  <span>My Active Listings ({myBooks.length})</span>
                </h2>
                <button
                  onClick={() => handleTabChange('listings')}
                  className="text-xs font-bold text-copper-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myBooks.slice(0, 3).map((book) => (
                  <div key={book.id || book._id} className="p-4 rounded-2xl border border-white/10 bg-dark-950 flex items-center gap-3">
                    <img
                      src={book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'}
                      alt=""
                      className="w-12 h-16 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {book.status}
                      </span>
                      <h4 className="font-bold text-xs text-white truncate mt-1">{book.title}</h4>
                      <p className="text-xs font-extrabold text-copper-300">
                        {book.listing_type === 'Sell' ? `$${book.price?.toFixed(2)}` : book.listing_type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-bold text-base text-white">Manage Your Listings</h3>
              <Link
                to="/create-listing"
                className="px-4 py-2 bg-copper-600 hover:bg-copper-500 text-white rounded-xl text-xs font-bold shadow-glow-copper inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Add Book
              </Link>
            </div>

            {myBooks.length > 0 ? (
              <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden">
                {myBooks.map((book) => (
                  <div key={book.id || book._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5">
                    <div className="flex items-center gap-4">
                      <img
                        src={book.images?.[0]?.startsWith('/uploads') ? `http://localhost:8000${book.images[0]}` : book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'}
                        alt=""
                        className="w-14 h-16 object-cover rounded-xl border border-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300">
                            {book.status}
                          </span>
                          <span className="text-xs text-copper-400 font-semibold">{book.category}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white mt-1">{book.title}</h4>
                        <p className="text-xs text-slate-400">by {book.author}</p>
                        <p className="text-xs font-extrabold text-white mt-1">
                          {book.listing_type === 'Sell' ? `$${book.price?.toFixed(2)}` : book.listing_type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/books/${book.id || book._id}`}
                        className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold rounded-xl"
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit-listing/${book.id || book._id}`}
                        className="px-3.5 py-1.5 bg-copper-500/15 hover:bg-copper-500/25 text-copper-300 text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(book.id || book._id)}
                        className="p-2 text-rose-400 hover:bg-rose-950/30 rounded-xl"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-dark-950 rounded-2xl border border-white/10">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">No books listed yet</p>
                <Link to="/create-listing" className="mt-3 inline-block px-4 py-2 bg-copper-600 text-white rounded-xl text-xs font-bold">
                  Create Listing
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INCOMING */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white">Incoming Requests</h3>
            {incomingRequests.length > 0 ? (
              <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          req.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-xs font-bold text-white">{req.book_title}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Requested by <strong>{req.requester_name}</strong> ({req.requester_college})
                      </p>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-xl"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-dark-950 rounded-2xl border border-white/10 text-xs text-slate-400">
                No incoming requests received yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SENT */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white">Your Outgoing Book Requests</h3>
            {sentRequests.length > 0 ? (
              <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden">
                {sentRequests.map((req) => (
                  <div key={req.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          req.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-300'
                        }`}>
                          {req.status}
                        </span>
                        <Link to={`/books/${req.book_id}`} className="text-xs font-bold text-white hover:text-copper-300">
                          {req.book_title}
                        </Link>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Owner: {req.owner_name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/messages?user=${req.owner_id}&book=${req.book_id}`}
                        className="px-3.5 py-1.5 bg-copper-500/15 text-copper-300 hover:bg-copper-500/25 text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Message
                      </Link>
                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleCancelSentRequest(req.id)}
                          className="px-3 py-1.5 text-rose-400 hover:bg-rose-950/30 text-xs font-bold rounded-xl"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-dark-950 rounded-2xl border border-white/10 text-xs text-slate-400">
                You haven't requested any books yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white">Campus Handoffs & Completed Deals</h3>
            {transactions.length > 0 ? (
              <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden">
                {transactions.map((tx) => {
                  const myId = user?.id || user?._id;
                  const isRequester = tx.requester_id === myId;
                  const targetName = isRequester ? tx.owner_name : tx.requester_name;
                  const targetId = isRequester ? tx.owner_id : tx.requester_id;
                  const hasReviewed = isRequester ? tx.is_reviewed_by_requester : tx.is_reviewed_by_owner;

                  return (
                    <div key={tx.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            tx.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {tx.status}
                          </span>
                          <span className="text-xs font-bold text-white">{tx.book_title}</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Partner: <strong>{targetName}</strong> • Type: <strong className="uppercase">{tx.transaction_type}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {tx.status === 'in_progress' ? (
                          <button
                            onClick={() => handleCompleteTransaction(tx.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Handoff Complete
                          </button>
                        ) : (
                          !hasReviewed ? (
                            <button
                              onClick={() => {
                                setSelectedTxForReview({ ...tx, targetUserId: targetId });
                                setReviewModalOpen(true);
                              }}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
                            >
                              <Star className="w-3.5 h-3.5 fill-white" /> Leave Review
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                              ✓ Reviewed
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-dark-950 rounded-2xl border border-white/10 text-xs text-slate-400">
                No transactions recorded yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 6: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white">Saved Wishlist ({wishlist.length})</h3>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map((book) => (
                  <div key={book.id || book._id} className="p-4 rounded-2xl border border-white/10 bg-dark-950 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'}
                        alt=""
                        className="w-12 h-16 object-cover rounded-lg border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300">
                          {book.status}
                        </span>
                        <h4 className="font-bold text-xs text-white truncate mt-1">{book.title}</h4>
                        <p className="text-xs text-slate-400 truncate">by {book.author}</p>
                        <p className="text-xs font-bold text-copper-300 mt-0.5">
                          {book.listing_type === 'Sell' ? `$${book.price?.toFixed(2)}` : book.listing_type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <Link
                        to={`/books/${book.id || book._id}`}
                        className="text-xs font-bold text-copper-300 hover:underline"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleRemoveWishlist(book.id || book._id)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-dark-950 rounded-2xl border border-white/10">
                <Heart className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Your wishlist is empty.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {selectedTxForReview && (
        <ReviewModal
          transaction={selectedTxForReview}
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => fetchDashboardData()}
        />
      )}
    </div>
  );
}

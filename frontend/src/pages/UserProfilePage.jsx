import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  Star,
  BookOpen,
  MapPin,
  Calendar,
  ShieldAlert,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../services/authService';
import { reviewService } from '../services/reviewService';
import BookCard from '../components/BookCard';
import ReportModal from '../components/ReportModal';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function UserProfilePage() {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [userData, booksData, reviewsData] = await Promise.all([
          authService.getUserProfile(id),
          authService.getUserBooks(id),
          reviewService.getUserReviews(id),
        ]);
        setProfile(userData);
        setUserBooks(booksData || []);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
        <p className="font-bold text-slate-800">Student Profile Not Found</p>
        <Link to="/browse" className="text-xs font-bold text-brand-600 hover:underline">
          Return to Browse
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser && (currentUser.id === id || currentUser._id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={profile.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
            alt={profile.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-brand-50 shadow-md"
          />
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{profile.name}</h1>
              <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {profile.rating?.toFixed(1) || '5.0'}
              </span>
            </div>
            <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>{profile.college}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Joined BookCycle on {formatDate(profile.created_at)} • {profile.completed_transactions || 0} completed exchanges
            </p>
            {profile.bio && (
              <p className="text-xs text-slate-700 max-w-lg mt-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{profile.bio}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isOwnProfile ? (
            <>
              <Link
                to={`/messages?user=${profile.id || profile._id}`}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Message Student
              </Link>
              <button
                onClick={() => setReportModalOpen(true)}
                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Report User"
              >
                <ShieldAlert className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link
              to="/edit-profile"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Edit My Profile
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Listings (Left 8) + Reviews (Right 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Active Listings */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              <span>Active Listings ({userBooks.filter(b => b.status === 'available').length})</span>
            </h2>
          </div>

          {userBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userBooks.map((book) => (
                <BookCard key={book.id || book._id} book={book} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No textbooks currently listed by this student.
            </div>
          )}
        </div>

        {/* User Reviews & Feedback */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>Peer Reviews ({reviews.length})</span>
          </h2>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
            {reviews.length > 0 ? (
              <div className="space-y-3 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id || rev._id} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{rev.reviewer_name}</span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{rev.comment}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(rev.created_at)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">
                No reviews yet. Completed transactions will appear here.
              </p>
            )}
          </div>
        </div>

      </div>

      <ReportModal
        targetType="user"
        targetId={profile.id || profile._id}
        targetTitle={profile.name}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}

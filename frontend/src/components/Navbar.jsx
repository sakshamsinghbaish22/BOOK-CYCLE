import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  PlusCircle,
  Heart,
  MessageSquare,
  User,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Search,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { messageService } from '../services/messageService';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      const checkUnread = async () => {
        try {
          const threads = await messageService.getThreads();
          const unreadTotal = threads.reduce((acc, t) => acc + (t.unread_count || 0), 0);
          setUnreadMessages(unreadTotal);
        } catch (e) {
          // ignore
        }
      };
      checkUnread();
      const interval = setInterval(checkUnread, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-midnight-900/80 backdrop-blur-xl border-b border-amber-500/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Brand Tag with Golden Celestial Glow */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-200 shadow-glow-amber">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-[0.2em] text-white uppercase">
                BOOK<span className="text-amber-400 font-light">CYCLE</span> <span className="text-xs text-amber-300/80 font-normal">/ GL BAJAJ</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-lg text-xs tracking-widest uppercase font-medium transition-all ${
                location.pathname === '/'
                  ? 'text-amber-300 bg-white/5 font-bold border-b-2 border-amber-400 rounded-b-none'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className={`px-3.5 py-1.5 rounded-lg text-xs tracking-widest uppercase font-medium transition-all ${
                location.pathname === '/browse'
                  ? 'text-amber-300 bg-white/5 font-bold border-b-2 border-amber-400 rounded-b-none'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/browse?category=Computer+Science"
              className="px-3.5 py-1.5 rounded-lg text-xs tracking-widest uppercase font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Topics
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-1.5 rounded-lg text-xs tracking-widest uppercase font-medium transition-all ${
                location.pathname === '/about'
                  ? 'text-amber-300 bg-white/5 font-bold border-b-2 border-amber-400 rounded-b-none'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/create-listing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-glow-amber transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Donate Textbook</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 border-l border-white/10 pl-3">
                {/* Wishlist */}
                <Link
                  to="/dashboard?tab=wishlist"
                  className="relative p-2 text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-colors"
                  title="Saved Books"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-glow-amber">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Messages */}
                <Link
                  to="/messages"
                  className="relative p-2 text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-colors"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadMessages}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-white/15 hover:border-amber-400 bg-white/5 transition-all"
                  >
                    <img
                      src={user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                      alt={user?.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-400/40"
                    />
                    <span className="text-xs font-semibold text-slate-200 max-w-[95px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-midnight-800 border border-amber-500/30 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-white"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-white/10">
                        <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-amber-300 truncate">{user?.college || user?.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                        Student Dashboard
                      </Link>

                      <Link
                        to={`/profile/${user?.id}`}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        My Profile
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-white/10 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-white/10 pl-3">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold tracking-wider uppercase text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold tracking-wider uppercase text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 rounded-xl transition-all shadow-glow-amber"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/create-listing"
              className="p-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-semibold"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber-500/20 bg-midnight-900 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg text-xs tracking-widest uppercase font-semibold text-slate-200 hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="px-3 py-2 rounded-lg text-xs tracking-widest uppercase font-semibold text-slate-200 hover:bg-white/5"
            >
              Marketplace
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 rounded-lg text-xs tracking-widest uppercase font-semibold text-slate-200 hover:bg-white/5"
            >
              About
            </Link>
          </nav>

          <div className="border-t border-white/10 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/5 rounded-lg"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Messages {unreadMessages > 0 && `(${unreadMessages})`}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 rounded-lg text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-white/20 text-slate-200 font-bold text-xs uppercase tracking-wider"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-amber"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

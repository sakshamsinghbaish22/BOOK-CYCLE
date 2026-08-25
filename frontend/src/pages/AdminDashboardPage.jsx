import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  DollarSign,
  Trash2,
  Lock,
  Unlock,
  Check,
  X,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { reportService } from '../services/reportService';
import { bookService } from '../services/bookService';
import { formatDate, getStatusBadge } from '../utils/formatters';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, listingsData, reportsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        adminService.getAllListings(),
        reportService.getReports(),
      ]);
      setStats(statsData);
      setUsers(usersData || []);
      setListings(listingsData || []);
      setReports(reportsData || []);
    } catch (err) {
      console.error('Error loading admin portal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user account?`)) return;

    try {
      await adminService.manageUser(userId, { is_active: !currentStatus });
      fetchAdminData();
    } catch (err) {
      alert(err.parsedMessage || 'Failed to update user status.');
    }
  };

  const handleDeleteListing = async (bookId) => {
    if (!window.confirm('Delete this listing as campus moderator?')) return;
    try {
      await bookService.deleteBook(bookId);
      fetchAdminData();
    } catch (err) {
      alert(err.parsedMessage || 'Failed to delete listing.');
    }
  };

  const handleResolveReport = async (reportId, status, actionTaken) => {
    try {
      await reportService.resolveReport(reportId, {
        status,
        action_taken: actionTaken,
      });
      fetchAdminData();
    } catch (err) {
      alert(err.parsedMessage || 'Failed to resolve report.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/80 border border-purple-800 text-purple-300 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span>Campus Moderation Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Platform Administration</h1>
          <p className="text-xs sm:text-sm text-purple-300 mt-1">
            Monitor community activity, moderate textbooks, and handle student reports.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 border border-purple-700 text-xs font-bold rounded-xl flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.total_users || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Listings</p>
          <p className="text-3xl font-extrabold text-brand-600 mt-1">{stats?.active_listings || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Exchanges Completed</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats?.completed_transactions || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Reports</p>
          <p className="text-3xl font-extrabold text-rose-600 mt-1">{stats?.pending_reports || 0}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Reports & Abuse ({reports.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'listings' ? 'bg-purple-100 text-purple-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Listings ({listings.length})
        </button>
      </div>

      {/* Tab 1: Reports Moderation */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Student Abuse & Content Reports</h2>
          
          {reports.length > 0 ? (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {reports.map((rep) => (
                <div key={rep.id || rep._id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        rep.status === 'pending' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {rep.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {rep.report_type.toUpperCase()}: {rep.target_title || rep.target_id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Reason: <strong className="text-rose-700">{rep.reason}</strong> • Reported by {rep.reporter_name} on {formatDate(rep.created_at)}
                    </p>
                    <p className="text-xs text-slate-700 bg-slate-100 p-2.5 rounded-xl mt-1">
                      "{rep.description}"
                    </p>
                    {rep.action_taken && (
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        ✓ Action Taken: {rep.action_taken} ({formatDate(rep.resolved_at)})
                      </p>
                    )}
                  </div>

                  {rep.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleResolveReport(rep.id || rep._id, 'resolved', 'Listing removed / user warned')}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Action & Resolve
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id || rep._id, 'dismissed', 'No violation found')}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
              No reports filed yet. The community is clean!
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Accounts */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Registered Student Accounts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id || u._id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                      <img
                        src={u.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt=""
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      <div>
                        <p>{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600">{u.college}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-600">★ {u.rating ? u.rating.toFixed(1) : '5.0'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.is_active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.is_active !== false ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id || u._id, u.is_active !== false)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            u.is_active !== false
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.is_active !== false ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Listings Moderation */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">All Published Textbooks</h2>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {listings.map((b) => (
              <div key={b.id || b._id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <img
                    src={b.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150'}
                    alt=""
                    className="w-10 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{b.title}</h4>
                    <p className="text-[11px] text-slate-500">by {b.author} • {b.college} • Owner: {b.owner_name}</p>
                    <p className="text-xs font-bold text-brand-600">
                      {b.listing_type === 'Sell' ? `$${b.price?.toFixed(2)}` : b.listing_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/books/${b.id || b._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteListing(b.id || b._id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Remove listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

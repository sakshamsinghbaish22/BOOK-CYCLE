import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Mail, Lock, Building, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INDIAN_COLLEGES = [
  'IIT Delhi',
  'IIT Bombay',
  'IIT Madras',
  'IIT Kharagpur',
  'IIT Kanpur',
  'BITS Pilani',
  'IIIT Hyderabad',
  'DTU Delhi',
  'NIT Trichy',
  'IIM Ahmedabad',
  'IIM Bangalore',
  'VIT Vellore',
  'Manipal Institute of Technology',
  'SRM University Chennai',
  'Delhi University (DU)',
  'Anna University Chennai',
  'Jadavpur University',
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        college: formData.college.trim(),
        phone: formData.phone.trim() || undefined,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.parsedMessage || 'Failed to create student account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-xl bg-slatebg-800/90 backdrop-blur-xl rounded-3xl border border-crimson-600/30 shadow-2xl p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-crimson-600/20 border border-crimson-500/60 flex items-center justify-center p-1 shadow-glow-crimson">
              <div className="w-2.5 h-2.5 rounded-full bg-crimson-500" />
            </div>
            <span className="font-extrabold text-base tracking-[0.2em] text-white uppercase">
              BOOKCYCLE <span className="text-crimson-400 font-light">/ INDIA</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white pt-2">Join Campus Student Network</h1>
          <p className="text-xs text-slate-300">
            Create your account to start buying, selling, and donating textbooks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-crimson-950/60 border border-crimson-500/50 text-crimson-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-crimson-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aarav Sharma, Ananya Patel"
                className="w-full bg-slatebg-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@iitd.ac.in or student@gmail.com"
                className="w-full bg-slatebg-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">University / College *</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                list="college-options"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. IIT Delhi, BITS Pilani, DTU..."
                className="w-full bg-slatebg-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson-500"
              />
              <datalist id="college-options">
                {INDIAN_COLLEGES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">Password *</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-crimson-300 font-semibold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full bg-slatebg-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full bg-slatebg-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-slatebg-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-crimson-600 hover:bg-crimson-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-glow-crimson transition-all disabled:opacity-50 mt-2"
          >
            {submitting ? 'Creating Account...' : 'Create Student Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-white/10 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-crimson-400 hover:underline">
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
}

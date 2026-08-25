import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Upload,
  Plus,
  X,
  DollarSign,
  Gift,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Computer Science',
  'Engineering',
  'Mathematics',
  'Management',
  'Competitive Exams',
  'Literature',
  'Medicine & Healthcare',
  'Natural Sciences',
  'Social Sciences',
  'Other'
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    subject: '',
    edition: '',
    description: '',
    condition: 'Good',
    listing_type: 'Sell',
    price: 15.00,
    exchange_preferences: '',
    college: user?.college || '',
    location_details: 'Campus Library / Student Union',
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    try {
      const data = await bookService.uploadImage(file);
      setImageUrls((prev) => [...prev, data.url]);
    } catch (err) {
      setError(err.parsedMessage || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.author.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.listing_type === 'Sell' && (!formData.price || formData.price <= 0)) {
      setError('Please specify a valid price greater than $0 for sale listings.');
      return;
    }

    if (formData.listing_type === 'Exchange' && !formData.exchange_preferences.trim()) {
      setError('Please specify what book or item you wish to receive in exchange.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: formData.listing_type === 'Donate' ? 0 : formData.price,
        images: imageUrls.length > 0 ? imageUrls : [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
        ]
      };

      const newBook = await bookService.createBook(payload);
      navigate(`/books/${newBook.id}`);
    } catch (err) {
      setError(err.parsedMessage || 'Failed to create listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Campus Marketplace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          List a Textbook
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Give your coursebook a second life. Choose to sell at a student price, donate for free, or trade for your next semester reads.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Listing Type Selection */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            1. Listing Intent
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, listing_type: 'Sell' }))}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                formData.listing_type === 'Sell'
                  ? 'border-brand-600 bg-brand-50/70 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <DollarSign className="w-5 h-5 text-brand-600" />
                {formData.listing_type === 'Sell' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                )}
              </div>
              <div className="mt-3">
                <p className="font-bold text-sm text-slate-900">Sell for Cash</p>
                <p className="text-[11px] text-slate-500">Set your student asking price</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, listing_type: 'Donate', price: 0 }))}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                formData.listing_type === 'Donate'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <Gift className="w-5 h-5 text-emerald-600" />
                {formData.listing_type === 'Donate' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                )}
              </div>
              <div className="mt-3">
                <p className="font-bold text-sm text-slate-900">Free Donation</p>
                <p className="text-[11px] text-slate-500">Pass it forward to juniors</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, listing_type: 'Exchange' }))}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                formData.listing_type === 'Exchange'
                  ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <ArrowRightLeft className="w-5 h-5 text-purple-600" />
                {formData.listing_type === 'Exchange' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                )}
              </div>
              <div className="mt-3">
                <p className="font-bold text-sm text-slate-900">Book Exchange</p>
                <p className="text-[11px] text-slate-500">Trade for a book you need</p>
              </div>
            </button>
          </div>

          {formData.listing_type === 'Sell' && (
            <div className="pt-2 max-w-xs">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Asking Price (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  required
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="350"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500"
                />
              </div>
            </div>
          )}

          {formData.listing_type === 'Exchange' && (
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                What book or subject are you looking for in exchange? *
              </label>
              <input
                type="text"
                required
                name="exchange_preferences"
                value={formData.exchange_preferences}
                onChange={handleChange}
                placeholder="e.g. Signals & Systems by Oppenheim or GRE Prep 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          )}
        </div>

        {/* 2. Book Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            2. Textbook Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Book Title *
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to Algorithms"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Author(s) *
              </label>
              <input
                type="text"
                required
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Cormen, Leiserson, Rivest, Stein"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ISBN (Optional)
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="978-0262033848"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category / Discipline *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Course / Subject (Optional)
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. CS 161 / Data Structures"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Edition (Optional)
              </label>
              <input
                type="text"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
                placeholder="e.g. 3rd Edition (Hardcover)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Physical Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Description & Condition Details *
              </label>
              <textarea
                required
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe any highlighting, markings, binding status, or included access codes/CDs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        </div>

        {/* 3. Photos */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            3. Book Photos
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 group">
                <img
                  src={url.startsWith('/uploads') ? `http://localhost:8000${url}` : url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 shadow-sm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {imageUrls.length < 4 && (
              <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-400 bg-slate-50 hover:bg-brand-50/30 flex flex-col items-center justify-center cursor-pointer transition-all p-4 text-center">
                <Upload className="w-6 h-6 text-brand-600 mb-2" />
                <span className="text-xs font-bold text-slate-700">
                  {uploadingImage ? 'Uploading...' : 'Upload Cover Photo'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">JPG, PNG up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* 4. Campus Location */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            4. Campus Meetup Location
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                University / Institution
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Stanford University"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Preferred Meetup Spot
              </label>
              <input
                type="text"
                name="location_details"
                value={formData.location_details}
                onChange={handleChange}
                placeholder="e.g. Main Library 1st Floor / Campus Center"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all"
          >
            {submitting ? 'Publishing Listing...' : 'Publish Book Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}

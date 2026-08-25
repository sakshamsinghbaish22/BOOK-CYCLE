import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Upload, X, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { bookService } from '../services/bookService';

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
const STATUSES = ['available', 'reserved', 'sold', 'donated', 'exchanged'];

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    price: 0,
    exchange_preferences: '',
    college: '',
    location_details: '',
    status: 'available',
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookService.getBookById(id);
        setFormData({
          title: data.title || '',
          author: data.author || '',
          isbn: data.isbn || '',
          category: data.category || 'Computer Science',
          subject: data.subject || '',
          edition: data.edition || '',
          description: data.description || '',
          condition: data.condition || 'Good',
          listing_type: data.listing_type || 'Sell',
          price: data.price || 0,
          exchange_preferences: data.exchange_preferences || '',
          college: data.college || '',
          location_details: data.location_details || '',
          status: data.status || 'available',
        });
        setImageUrls(data.images || []);
      } catch (err) {
        setError('Failed to load listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await bookService.uploadImage(file);
      setImageUrls((prev) => [...prev, data.url]);
    } catch (err) {
      alert(err.parsedMessage || 'Failed to upload image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await bookService.updateBook(id, {
        ...formData,
        images: imageUrls,
      });
      navigate(`/books/${id}`);
    } catch (err) {
      setError(err.parsedMessage || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Book</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900">Edit Textbook Listing</h1>
        <p className="text-xs text-slate-500 mt-1">Update pricing, description, photos or availability status</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Availability Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 uppercase"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Author</label>
              <input
                type="text"
                required
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.50"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md"
          >
            {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

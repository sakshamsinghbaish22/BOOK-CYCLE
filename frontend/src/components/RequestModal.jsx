import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2, ArrowRightLeft, Gift, DollarSign } from 'lucide-react';
import { requestService } from '../services/requestService';
import { formatCurrency } from '../utils/formatters';

export default function RequestModal({ book, isOpen, onClose, onSuccess }) {
  const [requestType, setRequestType] = useState(
    book?.listing_type?.toLowerCase() === 'donate'
      ? 'donate'
      : book?.listing_type?.toLowerCase() === 'exchange'
      ? 'exchange'
      : 'buy'
  );
  const [offeredExchangeItem, setOfferedExchangeItem] = useState('');
  const [message, setMessage] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !book) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (requestType === 'exchange' && !offeredExchangeItem.trim()) {
      setError('Please mention the book or item you are offering in exchange.');
      return;
    }

    setSubmitting(true);
    try {
      await requestService.createRequest({
        book_id: book.id || book._id,
        request_type: requestType,
        offered_exchange_item: offeredExchangeItem.trim(),
        message: message.trim(),
        contact_phone: contactPhone.trim(),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.parsedMessage || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Request Book
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-xs">{book.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Preview Strip */}
        <div className="flex items-center gap-3 px-6 py-3 bg-brand-50/40 border-b border-brand-100/50">
          <img
            src={
              book.images?.[0]?.startsWith('/uploads')
                ? `http://localhost:8000${book.images[0]}`
                : book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
            }
            alt={book.title}
            className="w-12 h-14 object-cover rounded-lg shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{book.title}</h4>
            <p className="text-[11px] text-slate-500">by {book.author}</p>
            <p className="text-xs font-bold text-brand-600 mt-0.5">
              {book.listing_type === 'Sell' ? `$${book.price?.toFixed(2)}` : book.listing_type}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Request Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Action Intent
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRequestType('buy')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  requestType === 'buy'
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Buy (${book.price?.toFixed(2)})</span>
              </button>

              <button
                type="button"
                onClick={() => setRequestType('donate')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  requestType === 'donate'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>Request Free</span>
              </button>

              <button
                type="button"
                onClick={() => setRequestType('exchange')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  requestType === 'exchange'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Exchange</span>
              </button>
            </div>
          </div>

          {/* If Exchange: Offer Description */}
          {requestType === 'exchange' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Book / Item You Are Offering in Exchange *
              </label>
              <input
                type="text"
                required
                value={offeredExchangeItem}
                onChange={(e) => setOfferedExchangeItem(e.target.value)}
                placeholder="e.g. Operating Systems Concepts (9th Edition) in Like-New condition"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              {book.exchange_preferences && (
                <p className="text-[11px] text-purple-700 mt-1 bg-purple-50 p-2 rounded-lg">
                  💡 <strong>Owner Preference:</strong> {book.exchange_preferences}
                </p>
              )}
            </div>
          )}

          {/* Message to Owner */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Personal Note to {book.owner_name?.split(' ')[0] || 'Owner'}
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I am interested in getting this textbook. Can we meet up at the campus library this week?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Contact Phone (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Your Phone Number / WhatsApp (Optional for faster meetup)
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Sending Request...' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

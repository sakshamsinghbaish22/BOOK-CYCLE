export const formatCurrency = (amount) => {
  if (amount === 0 || amount === '0' || !amount) {
    return 'Free / Donation';
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
};

export const getConditionColor = (condition) => {
  switch (condition?.toLowerCase()) {
    case 'new':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'like new':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'good':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'fair':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'poor':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export const getListingTypeBadge = (type) => {
  switch (type?.toLowerCase()) {
    case 'sell':
      return {
        label: 'For Sale',
        class: 'bg-brand-600 text-white shadow-sm'
      };
    case 'donate':
      return {
        label: 'Donation / Free',
        class: 'bg-emerald-600 text-white shadow-sm'
      };
    case 'exchange':
      return {
        label: 'Exchange',
        class: 'bg-purple-600 text-white shadow-sm'
      };
    default:
      return {
        label: type,
        class: 'bg-slate-600 text-white'
      };
  }
};

export const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'reserved':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'sold':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'donated':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'exchanged':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, SlidersHorizontal, ArrowUpDown, X, Sparkles, Flame } from 'lucide-react';
import { bookService } from '../services/bookService';
import BookCard from '../components/BookCard';
import BookFilter from '../components/BookFilter';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { BookGridSkeleton } from '../components/LoadingSkeleton';

export default function BrowseBooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    condition: searchParams.get('condition') || 'All',
    listing_type: searchParams.get('listing_type') || 'All',
    college: searchParams.get('college') || '',
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : 150,
    sort_by: searchParams.get('sort_by') || 'newest',
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        search: filters.search || undefined,
        category: filters.category !== 'All' ? filters.category : undefined,
        condition: filters.condition !== 'All' ? filters.condition : undefined,
        listing_type: filters.listing_type !== 'All' ? filters.listing_type : undefined,
        college: filters.college || undefined,
        max_price: filters.max_price < 150 ? filters.max_price : undefined,
        sort_by: filters.sort_by,
      };

      const data = await bookService.getBooks(params);
      setBooks(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    setPage(1);

    const newParams = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v && v !== 'All' && v !== 150) {
        newParams.set(k, v.toString());
      }
    });
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      category: 'All',
      condition: 'All',
      listing_type: 'All',
      college: '',
      max_price: 150,
      sort_by: 'newest',
    };
    setFilters(defaultFilters);
    setPage(1);
    setSearchParams({});
  };

  const handleSearch = (query) => {
    handleFilterChange('search', query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-dark-900 p-6 rounded-3xl border border-white/10 shadow-dark-card">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-copper-500/10 border border-copper-400/30 text-copper-300 text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
            <Flame className="w-3 h-3 text-copper-400" />
            <span>CAMPUS MARKETPLACE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Textbook Marketplace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing <strong className="text-copper-300">{total}</strong> available textbooks across universities
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-md">
          <SearchBar onSearch={handleSearch} initialValue={filters.search} />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Left Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <BookFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Books Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-dark-900 p-3.5 rounded-2xl border border-white/10 shadow-xs">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 text-xs font-bold text-slate-200 hover:bg-white/10 border border-white/10"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Active Filters Pills */}
            <div className="hidden sm:flex flex-wrap items-center gap-2">
              {filters.category !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-copper-500/15 border border-copper-400/40 text-copper-300 text-xs font-bold">
                  {filters.category}
                  <button onClick={() => handleFilterChange('category', 'All')}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}
              {filters.listing_type !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 text-xs font-semibold">
                  {filters.listing_type}
                  <button onClick={() => handleFilterChange('listing_type', 'All')}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <label htmlFor="sort_by" className="text-xs text-slate-400 font-medium hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort_by"
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                className="bg-dark-950 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-copper-400"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Book Cards Grid */}
          {loading ? (
            <BookGridSkeleton count={6} />
          ) : books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {books.map((book) => (
                  <BookCard key={book.id || book._id} book={book} />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          ) : (
            <div className="text-center py-16 bg-dark-900 rounded-3xl border border-white/10 p-8 space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-white/5 text-slate-500 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                No textbooks match these filters
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Try widening your price range or searching with broader keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-copper-600 hover:bg-copper-500 text-white text-xs font-bold rounded-xl shadow-glow-copper transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg bg-dark-900 border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-bold text-base text-white">Filter Textbooks</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BookFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
            <div className="pt-4">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-copper-600 hover:bg-copper-500 text-white rounded-xl font-bold text-xs shadow-glow-copper uppercase tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

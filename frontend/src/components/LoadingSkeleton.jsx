import React from 'react';

export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-12 bg-slate-200 rounded" />
        </div>
        <div className="h-5 w-4/5 bg-slate-200 rounded" />
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
          <div className="h-5 w-16 bg-slate-200 rounded" />
          <div className="h-7 w-20 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BookDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 aspect-[3/4] bg-slate-200 rounded-2xl" />
        <div className="lg:col-span-7 space-y-4">
          <div className="h-8 w-3/4 bg-slate-200 rounded" />
          <div className="h-5 w-1/3 bg-slate-200 rounded" />
          <div className="h-6 w-24 bg-slate-200 rounded" />
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 rounded" />
            <div className="h-4 w-4/6 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

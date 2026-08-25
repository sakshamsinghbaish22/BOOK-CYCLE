import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistIds(new Set());
      setWishlistCount(0);
      return;
    }
    try {
      const items = await bookService.getWishlist();
      const ids = new Set(items.map((item) => item.id));
      setWishlistIds(ids);
      setWishlistCount(ids.size);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated, user?.id]);

  const toggleWishlist = async (bookId) => {
    if (!isAuthenticated) return false;
    try {
      if (wishlistIds.has(bookId)) {
        await bookService.removeFromWishlist(bookId);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(bookId);
          setWishlistCount(next.size);
          return next;
        });
        return false;
      } else {
        await bookService.addToWishlist(bookId);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.add(bookId);
          setWishlistCount(next.size);
          return next;
        });
        return true;
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      return wishlistIds.has(bookId);
    }
  };

  const isInWishlist = (bookId) => wishlistIds.has(bookId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  BookOpen,
  User,
  Clock,
  CheckCheck,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { messageService } from '../services/messageService';
import { authService } from '../services/authService';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { formatRelativeTime } from '../utils/formatters';

export default function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('user');
  const initialBookId = searchParams.get('book');

  const [threads, setThreads] = useState([]);
  const [activeUserId, setActiveUserId] = useState(initialUserId || null);
  const [activeUser, setActiveUser] = useState(null);
  const [activeBook, setActiveBook] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch threads
  const loadThreads = async () => {
    try {
      const data = await messageService.getThreads();
      setThreads(data || []);

      // If activeUserId not set and threads exist, select first
      if (!activeUserId && data && data.length > 0) {
        setActiveUserId(data[0].other_user_id);
      }
    } catch (err) {
      console.error('Error fetching threads:', err);
    } finally {
      setLoadingThreads(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  // When activeUserId changes, fetch messages and other user profile
  useEffect(() => {
    if (!activeUserId) return;

    const loadChat = async () => {
      try {
        const [msgs, userProfile] = await Promise.all([
          messageService.getMessagesWithUser(activeUserId),
          authService.getUserProfile(activeUserId),
        ]);
        setMessages(msgs || []);
        setActiveUser(userProfile);

        if (initialBookId) {
          try {
            const bData = await bookService.getBookById(initialBookId);
            setActiveBook(bData);
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.error('Error loading chat:', err);
      }
    };

    loadChat();
    const interval = setInterval(loadChat, 5000);
    return () => clearInterval(interval);
  }, [activeUserId, initialBookId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeUserId) return;

    const content = newMessageText.trim();
    setNewMessageText('');
    setSending(true);

    try {
      const sent = await messageService.sendMessage({
        receiver_id: activeUserId,
        book_id: activeBook?.id || activeBook?._id || undefined,
        content,
      });
      setMessages((prev) => [...prev, sent]);
      loadThreads();
    } catch (err) {
      alert(err.parsedMessage || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const myId = user?.id || user?._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[680px]">
        
        {/* Left Sidebar: Threads (4 cols) */}
        <div className={`md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50 ${activeUserId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-600" />
              <span>Campus Messages</span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingThreads ? (
              <div className="p-6 text-center text-xs text-slate-400 animate-pulse">Loading chats...</div>
            ) : threads.length > 0 ? (
              threads.map((t) => {
                const isSelected = t.other_user_id === activeUserId;
                return (
                  <button
                    key={t.other_user_id}
                    onClick={() => setActiveUserId(t.other_user_id)}
                    className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                      isSelected ? 'bg-brand-50/80 border-l-4 border-brand-600' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <img
                      src={t.other_user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.other_user_name}`}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">{t.other_user_name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{formatRelativeTime(t.last_message_time)}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{t.last_message}</p>
                      {t.book_title && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-600 truncate mt-1">
                          <BookOpen className="w-2.5 h-2.5" /> {t.book_title}
                        </span>
                      )}
                    </div>
                    {t.unread_count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {t.unread_count}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations yet. Visit any textbook listing and click "Contact Owner".
              </div>
            )}
          </div>
        </div>

        {/* Right Chat Pane: (8 cols) */}
        <div className={`md:col-span-8 flex flex-col bg-white ${!activeUserId ? 'hidden md:flex' : 'flex'}`}>
          {activeUserId && activeUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveUserId(null)}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <img
                    src={activeUser.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser.name}`}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <Link
                      to={`/profile/${activeUser.id || activeUser._id}`}
                      className="font-bold text-xs sm:text-sm text-slate-900 hover:text-brand-600"
                    >
                      {activeUser.name}
                    </Link>
                    <p className="text-[11px] text-slate-500">{activeUser.college}</p>
                  </div>
                </div>

                <Link
                  to={`/profile/${activeUser.id || activeUser._id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  View Profile
                </Link>
              </div>

              {/* Book Context Banner if available */}
              {activeBook && (
                <div className="px-4 py-2 bg-brand-50/70 border-b border-brand-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <BookOpen className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="text-slate-600">Discussing:</span>
                    <strong className="text-slate-900 truncate">{activeBook.title}</strong>
                  </div>
                  <Link
                    to={`/books/${activeBook.id || activeBook._id}`}
                    className="text-brand-700 font-bold hover:underline shrink-0 text-[11px]"
                  >
                    View Book
                  </Link>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/30">
                {messages.length > 0 ? (
                  messages.map((m) => {
                    const isMe = m.sender_id === myId;
                    return (
                      <div
                        key={m.id || m._id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                            isMe
                              ? 'bg-brand-600 text-white rounded-br-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {formatRelativeTime(m.created_at)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Send a message to introduce yourself and coordinate book meetup details!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type your message (e.g. Can we meet at the library at 2pm?)..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessageText.trim()}
                  className="p-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-2xl shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <p className="font-bold text-sm text-slate-700">Select a conversation</p>
              <p className="text-xs">Choose a peer from the left sidebar to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

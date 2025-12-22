// src/components/layout/Header.jsx — FIXED: SEARCH WORKS & BELL SHOWS UNREAD CONTACT MESSAGES COUNT
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'unread');

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Unread count error:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search results page or jobs list with query
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      toast('Enter a search term');
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-indigo-100 px-8 py-5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search jobs, companies, messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 pr-6 py-4 rounded-2xl bg-indigo-50 border border-indigo-200 focus:border-indigo-500 focus:outline-none w-full text-lg"
          />
        </form>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/admin/ContactMessages')}
          className="relative p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition"
        >
          <Bell size={28} className="text-indigo-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
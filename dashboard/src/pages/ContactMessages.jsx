// src/pages/ContactMessages.jsx — FULLY WORKING CONTACT MESSAGES PAGE
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Table from '../components/common/Table';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Reply, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('id, name, email, subject, message, status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;

      toast.success('Marked as read');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const markAsReplied = async (id) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'replied' })
        .eq('id', id);

      if (error) throw error;

      toast.success('Marked as replied');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Message deleted');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(m => m.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full border-8 border-indigo-200 border-t-indigo-600 animate-spin mb-6" />
          <p className="text-2xl font-bold text-indigo-600">Loading Messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Contact Messages
        </h1>
        <p className="text-xl text-gray-600">All messages from the Contact Us form</p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={() => setFilter('all')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'all' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          All ({messages.length})
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'unread' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Unread ({messages.filter(m => m.status === 'unread').length})
        </button>
        <button 
          onClick={() => setFilter('read')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'read' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Read ({messages.filter(m => m.status === 'read').length})
        </button>
        <button 
          onClick={() => setFilter('replied')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'replied' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Replied ({messages.filter(m => m.status === 'replied').length})
        </button>
      </div>

      {/* TABLE */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-2xl font-bold">
          No messages yet
        </div>
      ) : (
        <Table
          title="Contact Messages"
          data={filteredMessages}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'subject', header: 'Subject' },
            { key: 'message', header: 'Message', render: (row) => row.message.substring(0, 100) + '...' },
            { key: 'created_at', header: 'Date', render: (row) => new Date(row.created_at).toLocaleString() },
            { key: 'status', header: 'Status', render: (row) => (
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                row.status === 'unread' ? 'bg-yellow-100 text-yellow-800' :
                row.status === 'read' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </span>
            )},
          ]}
          actions={[
            { icon: CheckCircle, label: 'Mark Read', color: 'bg-green-100 hover:bg-green-200 text-green-600', onClick: (row) => markAsRead(row.id) },
            { icon: Reply, label: 'Mark Replied', color: 'bg-blue-100 hover:bg-blue-200 text-blue-600', onClick: (row) => markAsReplied(row.id) },
            { icon: Trash2, label: 'Delete', color: 'bg-red-100 hover:bg-red-200 text-red-600', onClick: (row) => deleteMessage(row.id) },
          ]}
          searchPlaceholder="Search messages..."
        />
      )}
    </div>
  );
}
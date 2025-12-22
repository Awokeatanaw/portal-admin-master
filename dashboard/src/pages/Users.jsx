// src/pages/Users.jsx — FULLY WORKING USERS MANAGEMENT PAGE
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Table from '../components/common/Table';
import { motion } from 'framer-motion';
import { Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, location, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Combine first_name and last_name into full_name
      const usersWithName = data.map(user => ({
        ...user,
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User'
      }));

      setUsers(usersWithName);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full border-8 border-indigo-200 border-t-indigo-600 animate-spin mb-6" />
          <p className="text-2xl font-bold text-indigo-600">Loading Users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          All Users
        </h1>
        <p className="text-xl text-gray-600">Manage all registered users on JobPortal</p>
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
          All ({users.length})
        </button>
        <button 
          onClick={() => setFilter('candidate')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'candidate' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Candidates
        </button>
        <button 
          onClick={() => setFilter('employer')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'employer' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Employers
        </button>
      </div>

      {/* TABLE */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-2xl font-bold">
          No users in this category
        </div>
      ) : (
        <Table
          title="Users List"
          data={filteredUsers}
          columns={[
            { key: 'full_name', header: 'Name' },
            { key: 'phone', header: 'Phone' },
            { key: 'location', header: 'Location' },
            { key: 'role', header: 'Role', render: (row) => row.role.charAt(0).toUpperCase() + row.role.slice(1) },
            { key: 'created_at', header: 'Joined', render: (row) => new Date(row.created_at).toLocaleDateString('en-GB') },
          ]}
          actions={[
            { icon: Eye, label: 'View', color: 'bg-blue-100 hover:bg-blue-200 text-blue-600', onClick: (row) => console.log('View', row.id) },
            { icon: Trash2, label: 'Delete', color: 'bg-red-100 hover:bg-red-200 text-red-600', onClick: (row) => deleteUser(row.id) },
          ]}
          searchPlaceholder="Search users..."
        />
      )}
    </div>
  );
}
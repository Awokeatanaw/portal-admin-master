// src/pages/Companies.jsx — FULLY WORKING COMPANIES MANAGEMENT PAGE
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Table from '../components/common/Table';
import { motion } from 'framer-motion';
import { CheckCircle, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name, description, website, industry, logo_url, created_at, verified')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerified = async (id, isVerified) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ verified: !isVerified })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Company ${!isVerified ? 'verified' : 'unverified'}!`);
      fetchCompanies();
    } catch (err) {
      toast.error('Failed to update verification status');
    }
  };

  const deleteCompany = async (id) => {
    if (!confirm('Delete this company?')) return;

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Company deleted');
      fetchCompanies();
    } catch (err) {
      toast.error('Failed to delete company');
    }
  };

  const filteredCompanies = filter === 'all' 
    ? companies 
    : companies.filter(c => c.verified === (filter === 'verified'));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full border-8 border-indigo-200 border-t-indigo-600 animate-spin mb-6" />
          <p className="text-2xl font-bold text-indigo-600">Loading Companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          All Companies
        </h1>
        <p className="text-xl text-gray-600">Manage all registered companies on JobPortal</p>
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
          All ({companies.length})
        </button>
        <button 
          onClick={() => setFilter('verified')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'verified' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Verified
        </button>
        <button 
          onClick={() => setFilter('unverified')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'unverified' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Unverified
        </button>
      </div>

      {/* TABLE */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-2xl font-bold">
          No companies in this category
        </div>
      ) : (
        <Table
          title="Companies List"
          data={filteredCompanies}
          columns={[
            { key: 'name', header: 'Company Name' },
            { key: 'industry', header: 'Industry' },
            { key: 'website', header: 'Website', render: (row) => row.website ? <a href={row.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Visit</a> : 'N/A' },
            { key: 'verified', header: 'Verified', render: (row) => (
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                row.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {row.verified ? 'Verified' : 'Pending'}
              </span>
            )},
            { key: 'created_at', header: 'Joined', render: (row) => new Date(row.created_at).toLocaleDateString('en-GB') },
          ]}
          actions={[
            { icon: Eye, label: 'View', color: 'bg-blue-100 hover:bg-blue-200 text-blue-600', onClick: (row) => console.log('View', row.id) },
            { icon: CheckCircle, label: 'Verify', color: 'bg-green-100 hover:bg-green-200 text-green-600', onClick: (row) => toggleVerified(row.id, row.verified) },
            { icon: Trash2, label: 'Delete', color: 'bg-red-100 hover:bg-red-200 text-red-600', onClick: (row) => deleteCompany(row.id) },
          ]}
          searchPlaceholder="Search companies..."
        />
      )}
    </div>
  );
}
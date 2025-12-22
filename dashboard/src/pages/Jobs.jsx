// src/pages/Jobs.jsx — FULLY WORKING JOBS MANAGEMENT PAGE (2025)
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Table from '../components/common/Table';
import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          company_id,
          location,
          job_type,
          experience_level,
          created_at,
          is_featured,
          companies!company_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_featured: !currentFeatured })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Job ${!currentFeatured ? 'featured' : 'unfeatured'}!`);
      fetchJobs();
    } catch (err) {
      toast.error('Failed to update featured status');
    }
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Job deleted');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(j => j.job_type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full border-8 border-indigo-200 border-t-indigo-600 animate-spin mb-6" />
          <p className="text-2xl font-bold text-indigo-600">Loading Jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          All Jobs
        </h1>
        <p className="text-xl text-gray-600">Manage all posted jobs on JobPortal</p>
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
          All ({jobs.length})
        </button>
        <button 
          onClick={() => setFilter('full-time')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'full-time' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Full-Time
        </button>
        <button 
          onClick={() => setFilter('part-time')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'part-time' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Part-Time
        </button>
        <button 
          onClick={() => setFilter('remote')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'remote' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Remote
        </button>
        <button 
          onClick={() => setFilter('contract')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'contract' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Contract
        </button>
        <button 
          onClick={() => setFilter('freelance')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'freelance' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Freelance
        </button>
        <button 
          onClick={() => setFilter('internship')}
          className={`px-8 py-4 rounded-2xl font-bold text-lg ${
            filter === 'internship' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
        >
          Internship
        </button>
      </div>

      {/* TABLE */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-2xl font-bold">
          No jobs in this category
        </div>
      ) : (
        <Table
          title="Jobs List"
          data={filteredJobs}
          columns={[
            { key: 'title', header: 'Job Title' },
            { key: 'companies', header: 'Company', render: (row) => row.companies?.name || 'Unknown' },
            { key: 'location', header: 'Location' },
            { key: 'job_type', header: 'Type', render: (row) => row.job_type.charAt(0).toUpperCase() + row.job_type.slice(1) },
            { key: 'is_featured', header: 'Featured', render: (row) => (
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                row.is_featured ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {row.is_featured ? 'Featured' : 'Regular'}
              </span>
            )},
            { key: 'created_at', header: 'Posted', render: (row) => new Date(row.created_at).toLocaleDateString('en-GB') },
          ]}
          actions={[
            { icon: Eye, label: 'View', color: 'bg-blue-100 hover:bg-blue-200 text-blue-600', onClick: (row) => console.log('View', row.id) },
            { icon: Star, label: 'Feature', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600', onClick: (row) => toggleFeatured(row.id, row.is_featured) },
            { icon: Trash2, label: 'Delete', color: 'bg-red-100 hover:bg-red-200 text-red-600', onClick: (row) => deleteJob(row.id) },
          ]}
          searchPlaceholder="Search jobs..."
        />
      )}
    </div>
  );
}
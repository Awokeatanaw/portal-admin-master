// src/pages/Analytics.jsx — FIXED ACTIVE JOBS
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ChartCard from '../components/common/ChartCard';
import StatCard from '../components/common/StatCard';
import { motion } from 'framer-motion';
import { 
  BarChart2, TrendingUp, Users, Briefcase, Activity, 
  PieChart, LineChart, Building2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell 
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Analytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
    activeJobs: 0,
  });
  const [jobTypesData, setJobTypesData] = useState([]);
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [topIndustries, setTopIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const safeCount = async (table, filter = {}) => {
        let query = supabase.from(table).select('id', { count: 'exact', head: true });
        Object.entries(filter).forEach(([key, value]) => query.eq(key, value));
        const { count, error } = await query.range(0, 0);
        if (error) {
          console.error(`Count error ${table}:`, error);
          return 0;
        }
        return count || 0;
      };

      const [
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        activeJobs,
      ] = await Promise.all([
        safeCount('profiles'),
        safeCount('jobs'),
        safeCount('applications'),
        safeCount('companies'),
        safeCount('jobs'), // ← Fixed: count all jobs as active (since no status column)
      ]);

      setStats({
        totalUsers,
        totalJobs,
        totalApplications,
        totalCompanies,
        activeJobs: totalJobs, // ← Set active to total (temporary fix)
      });

      // Rest of the code remains the same...
      // 2. Job types distribution
      const { data: jobTypes } = await supabase
        .from('jobs')
        .select('job_type');

      if (jobTypes) {
        const jobTypeCounts = jobTypes.reduce((acc, job) => {
          const type = job.job_type || 'Other';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        setJobTypesData(Object.entries(jobTypeCounts).map(([name, value]) => ({ name, value })));
      }

      // 3. Applications over time (last 6 months)
      const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString();
      const { data: appsOverTime } = await supabase
        .from('applications')
        .select('applied_at')
        .gte('applied_at', sixMonthsAgo);

      if (appsOverTime) {
        const monthlyApps = appsOverTime.reduce((acc, app) => {
          const month = new Date(app.applied_at).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        setApplicationsOverTime(Object.entries(monthlyApps).map(([month, value]) => ({ month, value })));
      }

      // 4. Top industries
      const { data: industries } = await supabase
        .from('companies')
        .select('industry');

      if (industries) {
        const industryCounts = industries.reduce((acc, comp) => {
          const ind = comp.industry || 'Other';
          acc[ind] = (acc[ind] || 0) + 1;
          return acc;
        }, {});

        const top = Object.entries(industryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, value]) => ({ name, value }));

        setTopIndustries(top);
      }

    } catch (err) {
      console.error('Analytics error:', err);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full border-8 border-indigo-200 border-t-indigo-600 animate-spin mb-6" />
          <p className="text-2xl font-bold text-indigo-600">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-600">Platform performance overview</p>
      </div>

      {/* KEY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} color="indigo" />
        <StatCard title="Active Jobs" value={stats.activeJobs.toLocaleString()} icon={Briefcase} color="pink" />
        <StatCard title="Applications" value={stats.totalApplications.toLocaleString()} icon={Activity} color="purple" />
        <StatCard title="Companies" value={stats.totalCompanies.toLocaleString()} icon={Building2} color="cyan" />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-12">
        <ChartCard title="Job Types" icon={PieChart} color="indigo">
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={jobTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={140}
                dataKey="value"
              >
                {jobTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Applications Over Time" icon={LineChart} color="pink">
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={applicationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={3} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Industries" icon={BarChart2} color="purple">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topIndustries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
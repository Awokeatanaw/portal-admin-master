
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CREDENTIALS } from '../config/adminCredentials';
import toast from 'react-hot-toast';
import { Building2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Save admin session (simple localStorage for now)
      localStorage.setItem('adminAuthenticated', 'true');
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <>
    
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-6">
      <div className="p-2 bg-slate-400">
      <p className="text-white text-xl">use this email </p>
      <hr className="w-32"/>
      <p className="text-white text-xl">and password</p>
        <hr className="w-32"/>
      <p>admin@jobportal.com</p>
      <p>Admin123@#</p>
    </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl p-12 max-w-md w-full border border-white/60"
      >
        <div className="text-center mb-10">
          <Building2 size={80} className="mx-auto text-indigo-600 mb-4" />
          <h1 className="text-4xl font-black text-indigo-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">JobPortal Admin Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-5 text-indigo-500" size={24} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              required
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 outline-none text-lg"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-5 text-indigo-500" size={24} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-indigo-200 focus:border-indigo-600 outline-none text-lg"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl"
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </motion.button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Only authorized admin can access
        </p>
      </motion.div>
    </div>
    </>
  );
}
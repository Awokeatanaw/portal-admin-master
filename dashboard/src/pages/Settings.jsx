// src/pages/Settings.jsx — ADMIN SETTINGS PAGE (CONFIG-BASED)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogOut, User, Shield, Bell } from 'lucide-react';

// Replace with your actual admin config values
const ADMIN_CONFIG = {
  username: 'admin',          // from config
  email: 'admin@jobportal.et',
  role: 'admin',
};

export default function Settings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    job_alerts: true,
    application_updates: true,
    newsletter: false,
  });

  const handleNotifications = (key) => {
    const newNotifs = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifs);
    toast.success('Notification settings updated');
    // Save to localStorage or config if needed
  };

  const handleLogout = () => {
    // Clear session or token
    localStorage.removeItem('adminToken'); // if using token-based auth
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Admin Settings
        </h1>
        <p className="text-xl text-gray-600">Manage admin account preferences</p>
      </div>

      {/* ADMIN INFO */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-12 border border-indigo-100"
      >
        <h2 className="text-3xl font-bold text-indigo-900 mb-8 flex items-center gap-4">
          <User size={36} className="text-indigo-600" /> Admin Info
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Username</label>
            <input
              type="text"
              value={ADMIN_CONFIG.username}
              disabled
              className="w-full p-4 rounded-xl border border-indigo-200 bg-gray-100 text-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              value={ADMIN_CONFIG.email}
              disabled
              className="w-full p-4 rounded-xl border border-indigo-200 bg-gray-100 text-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Role</label>
            <input
              type="text"
              value={ADMIN_CONFIG.role}
              disabled
              className="w-full p-4 rounded-xl border border-indigo-200 bg-gray-100 text-lg"
            />
          </div>
        </div>
      </motion.section>

      {/* PASSWORD */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-xl p-12 border border-indigo-100"
      >
        <h2 className="text-3xl font-bold text-indigo-900 mb-8 flex items-center gap-4">
          <Shield size={36} className="text-indigo-600" /> Password
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          Admin password is managed in the config file. Contact the developer to change it.
        </p>
      </motion.section>

      {/* NOTIFICATIONS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-xl p-12 border border-indigo-100"
      >
        <h2 className="text-3xl font-bold text-indigo-900 mb-8 flex items-center gap-4">
          <Bell size={36} className="text-indigo-600" /> Notifications
        </h2>

        <div className="space-y-6">
          <label className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={notifications.job_alerts}
              onChange={() => handleNotifications('job_alerts')}
              className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-lg">Job Alerts</span>
          </label>
          <label className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={notifications.application_updates}
              onChange={() => handleNotifications('application_updates')}
              className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-lg">Application Updates</span>
          </label>
          <label className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={notifications.newsletter}
              onChange={() => handleNotifications('newsletter')}
              className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-lg">Newsletter</span>
          </label>
        </div>
      </motion.section>

      {/* LOGOUT */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-12 border border-indigo-100"
      >
        <h2 className="text-3xl font-bold text-indigo-900 mb-8 flex items-center gap-4">
          <Shield size={36} className="text-indigo-600" /> Security & Logout
        </h2>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 text-red-600 hover:text-red-700 font-bold text-lg"
        >
          <LogOut size={28} />
          Log Out
        </button>
      </motion.section>
    </div>
  );
}
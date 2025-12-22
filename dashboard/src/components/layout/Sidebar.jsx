import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Briefcase, label: 'Jobs', path: '/admin/jobs' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Building2, label: 'Companies', path: '/admin/companies' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/ContactMessages' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    window.location.href = '/admin/login';
  };

  return (
    <motion.aside
      initial={{ width: 288 }}
      animate={{ width: isCollapsed ? 80 : 288 }}
      className="h-screen bg-white/90 backdrop-blur-xl border-r border-indigo-100 shadow-2xl flex flex-col transition-all duration-300"
    >
      {/* HEADER */}
      <div className="p-6 border-b border-indigo-100 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent"
            >
              Job Portal Admin
            </motion.h1>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 transition"
        >
          {isCollapsed ? (
            <Menu size={22} className="text-indigo-600" />
          ) : (
            <X size={22} className="text-indigo-600" />
          )}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 overflow-y-auto white-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-2xl transition-all
                    ${isCollapsed ? 'justify-center px-0' : 'gap-4 px-4'}
                    py-3
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                >
                  {/* ICON SIZE NEVER CHANGES */}
                  <item.icon size={22} />

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium text-lg whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}

          {/* LOGOUT */}
          <li>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center rounded-2xl transition-all text-red-600 hover:bg-red-50
                ${isCollapsed ? 'justify-center px-0' : 'gap-4 px-4'}
                py-3`}
            >
              <LogOut size={24} />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium text-lg whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </li>
        </ul>
      </nav>
    </motion.aside>
  );
}

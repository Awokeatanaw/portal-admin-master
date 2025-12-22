// src/components/layout/Layout.jsx — RENDERS SIDEBAR + HEADER + CURRENT PAGE
import { Outlet } from 'react-router-dom';  // ← THIS IS KEY
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

export default function Layout() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50">

      {/* FLOATING ORBS */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"
          animate={{ x: [0, 120, -100, 0], y: [0, -120, 100, 0] }}
          transition={{ duration: 28 + i * 5, repeat: Infinity, ease: "linear" }}
          style={{ top: `${12 + i * 15}%`, left: `${8 + i * 17}%` }}
        />
      ))}

      <div className="relative z-10 flex h-screen">
        {/* SIDEBAR */}
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* HEADER */}
          <Header />

          {/* CURRENT PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto p-8">
            <Outlet />  {/* ← THIS SHOWS Dashboard, Jobs, Users, etc. */}
          </main>
        </div>
      </div>
    </div>
  );
}
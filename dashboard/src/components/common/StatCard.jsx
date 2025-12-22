// src/components/common/StatCard.jsx — REUSABLE METRIC CARD
import { motion } from 'framer-motion';

export default function StatCard({ title, value, change, icon: Icon, color = 'indigo' }) {
  const isPositive = change && change.startsWith('+');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="backdrop-blur-xl bg-white/90 border border-white/60 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all"
    >
      <div className="flex items-center justify-between mb-6">
        {Icon && (
          <div className={`p-4 rounded-2xl bg-gradient-to-br from-${color}-100 to-${color}-200`}>
            <Icon size={36} className={`text-${color}-600`} />
          </div>
        )}
        {change && (
          <span className={`text-2xl font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-5xl font-black text-gray-800">{value}</p>
    </motion.div>
  );
}
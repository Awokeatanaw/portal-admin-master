
import { motion } from 'framer-motion';

export default function ChartCard({ title, icon: Icon, children, color = 'indigo' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="backdrop-blur-xl bg-white/90 border border-white/60 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`p-4 rounded-2xl bg-gradient-to-br from-${color}-100 to-${color}-200 shadow-lg`}>
              <Icon size={36} className={`text-${color}-600`} />
            </div>
          )}
          <h3 className="text-3xl font-black text-gray-800">{title}</h3>
        </div>
      </div>

      {/* CHART CONTENT */}
      <div className="w-full h-80">
        {children}
      </div>
    </motion.div>
  );
}
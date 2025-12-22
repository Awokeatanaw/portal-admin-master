// src/components/common/Table.jsx — FIXED: SMALLER ICONS & LONG TEXT WRAPS TO NEW LINE
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Table({ 
  title, 
  data = [], 
  columns = [], 
  actions = [], 
  searchPlaceholder = "Search..." 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter(item =>
    columns.some(col => 
      String(item[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/90 border border-white/60 rounded-3xl shadow-2xl overflow-hidden"
    >
      {/* HEADER */}
      <div className="p-6 md:p-8 border-b border-indigo-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          <h2 className="text-2xl md:text-3xl font-black text-indigo-900">{title}</h2>
          
          {/* SEARCH */}
          <div className="relative w-full md:w-96">
            <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-indigo-50 border border-indigo-200 focus:border-indigo-600 focus:outline-none text-lg"
            />
          </div>
        </div>
      </div>

      {/* TABLE — HORIZONTAL SCROLL ON MOBILE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] md:w-full table-auto">
          <thead>
            <tr className="border-b-2 border-indigo-100">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 md:px-6 py-4 md:py-6 text-indigo-700 font-bold text-sm md:text-lg whitespace-nowrap">
                  {col.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-left px-4 md:px-6 py-4 md:py-6 text-indigo-700 font-bold text-sm md:text-lg whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-20 text-gray-500 text-xl">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-indigo-50 hover:bg-indigo-50/50 transition"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 md:px-6 py-4 md:py-6 text-gray-800 text-sm md:text-lg break-words">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 md:px-6 py-4 md:py-6">
                      <div className="flex items-center gap-2 flex-wrap">
                        {actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => action.onClick(row)}
                            className={`p-2 rounded-xl transition ${action.color || 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'}`}
                            title={action.label}
                          >
                            <action.icon size={16} />
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="p-6 border-t border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-center md:text-left">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-indigo-100 disabled:opacity-50 hover:bg-indigo-200 transition"
            >
              <ChevronsLeft size={20} className="text-indigo-600" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-indigo-100 disabled:opacity-50 hover:bg-indigo-200 transition"
            >
              <ChevronLeft size={20} className="text-indigo-600" />
            </button>

            <span className="px-4 text-indigo-700 font-bold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-indigo-100 disabled:opacity-50 hover:bg-indigo-200 transition"
            >
              <ChevronRight size={20} className="text-indigo-600" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-indigo-100 disabled:opacity-50 hover:bg-indigo-200 transition"
            >
              <ChevronsRight size={20} className="text-indigo-600" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
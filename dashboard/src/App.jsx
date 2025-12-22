// src/App.jsx — FINAL & CLEAN (MOUNTS LAYOUT CORRECTLY)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Applications from './pages/Applications';
import Companies from './pages/Companies';
import ContactMessages from './pages/ContactMessages';
import Jobs from './pages/Jobs';
import Settings from './pages/Settings';
import Users from './pages/Users';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';  // ← THIS IS WHERE YOU MOUNT IT

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC: Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED: All Admin Pages — USE LAYOUT HERE */}
        <Route path="/admin/*" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="applications" element={<Applications />} />
          <Route path="companies" element={<Companies />} />
          <Route path="contactMessages" element={<ContactMessages />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
       </Route>
        
        {/* Catch-all → go to login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
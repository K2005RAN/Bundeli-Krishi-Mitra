import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';

// Import Pages
import { Landing } from '../pages/Landing/Landing';
import { Login } from '../pages/Auth/Login';
import { Register } from '../pages/Auth/Register';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Disease } from '../pages/Disease/Disease';
import { Voice } from '../pages/Voice/Voice';
import { Weather } from '../pages/Weather/Weather';
import { Mandi } from '../pages/Mandi/Mandi';
import { Fertilizer } from '../pages/Fertilizer/Fertilizer';
import { History } from '../pages/History/History';
import { Profile } from '../pages/Profile/Profile';
import { Admin } from '../pages/Admin/Admin';

// Private Route Guard (Check if logged in)
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

// Admin Route Guard (Check if logged in AND is admin scientist)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Guest Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Farmers/Advisors Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/disease"
        element={
          <PrivateRoute>
            <Disease />
          </PrivateRoute>
        }
      />
      <Route
        path="/voice"
        element={
          <PrivateRoute>
            <Voice />
          </PrivateRoute>
        }
      />
      <Route
        path="/weather"
        element={
          <PrivateRoute>
            <Weather />
          </PrivateRoute>
        }
      />
      <Route
        path="/mandi"
        element={
          <PrivateRoute>
            <Mandi />
          </PrivateRoute>
        }
      />
      <Route
        path="/fertilizer"
        element={
          <PrivateRoute>
            <Fertilizer />
          </PrivateRoute>
        }
      />
      <Route
        path="/history"
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Private Admin/Scientist Only Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* Fallback Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { WeatherAlert } from '../../types';
import {
  LayoutDashboard,
  Scan,
  Mic,
  CloudSun,
  CircleDollarSign,
  Calculator,
  History,
  User,
  ShieldAlert,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, theme, toggleTheme, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      const activeAlerts = await mockApi.getWeatherAlerts();
      setAlerts(activeAlerts.filter(a => a.active));
    };
    fetchAlerts();

    // Listen for custom advisory updates
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'डैशबोर्ड', nameEn: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'बीमारी पहचान', nameEn: 'Disease Scan', path: '/disease', icon: Scan },
    { name: 'बुंदेली सहायक', nameEn: 'AI Assistant', path: '/voice', icon: Mic },
    { name: 'मौसम अलर्ट', nameEn: 'Weather', path: '/weather', icon: CloudSun },
    { name: 'मंडी भाव', nameEn: 'Mandi Prices', path: '/mandi', icon: CircleDollarSign },
    { name: 'खाद कैलकुलेटर', nameEn: 'Fertilizer', path: '/fertilizer', icon: Calculator },
    { name: 'इतिहास देखें', nameEn: 'History', path: '/history', icon: History },
    { name: 'प्रोफ़ाइल', nameEn: 'Profile', path: '/profile', icon: User },
  ];

  // Add Admin Panel to menu for admin roles
  if (user?.role === 'admin') {
    menuItems.push({
      name: 'एडमिन पैनल',
      nameEn: 'Admin Panel',
      path: '/admin',
      icon: ShieldAlert
    });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeAlertCount = alerts.filter(a => a.type === 'danger' || a.type === 'warning').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 sticky top-0 h-screen z-20">
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
            <span className="text-xl font-bold font-display">KM</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-850 dark:text-slate-100 leading-tight">बुंदेली कृषि मित्र</h1>
            <p className="text-xs text-secondary font-medium">आपका अपना खेती सलाहकार</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/10'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{user?.language === 'English' ? item.nameEn : item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary dark:text-primary-hover">
              {user?.name.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role === 'admin' ? 'कृषि वैज्ञानिक' : user?.district}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 w-full transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT & MOBILE LAYOUT --- */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Top Navbar */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 sticky top-0 z-30 h-16 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              KM
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-850 dark:text-slate-200">बुंदेली कृषि मित्र</h2>
            </div>
          </div>

          {/* Page Title (Desktop) */}
          <div className="hidden lg:block">
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">नमस्ते, {user?.name}</p>
          </div>

          {/* Quick Actions (Language, Theme, Alerts) */}
          <div className="flex items-center gap-2 relative">
            {/* Language Chip */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Languages className="h-3.5 w-3.5" />
              <span>{user?.language || 'बुंदेली'}</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              title="थीम बदलें"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-accent" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {activeAlertCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                )}
              </button>

              {/* Notification Drawer */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-4 z-50 overflow-hidden"
                    >
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                        <span>ताज़ा अलर्ट ({alerts.length})</span>
                        <span className="text-xs text-primary cursor-pointer hover:underline" onClick={() => navigate('/weather')}>सब देखें</span>
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {alerts.length === 0 ? (
                          <p className="text-xs text-center text-slate-400 py-4">कोई सक्रिय अलर्ट नहीं है।</p>
                        ) : (
                          alerts.map((alert) => (
                            <div
                              key={alert.id}
                              className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                                alert.type === 'danger'
                                  ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300'
                                  : alert.type === 'warning'
                                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-300'
                                  : 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300'
                              }`}
                            >
                              <p className="font-semibold mb-1">
                                {alert.type === 'danger' ? '⚠️ अति महत्वपूर्ण' : alert.type === 'warning' ? '🔔 चेतावनी' : 'ℹ️ सूचना'}
                              </p>
                              <p>{user?.language === 'English' ? alert.message : alert.messageBundeli}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Icon (Drawer Trigger) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* --- MAIN PAGE CONTENT --- */}
        <main className="flex-grow p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* --- MOBILE NAVIGATION BAR --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 h-16 flex items-center justify-around px-2 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {menuItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{user?.language === 'English' ? item.nameEn : item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- MOBILE SIDE DRAWER (Overlay) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 p-6 z-50 flex flex-col justify-between shadow-2xl lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">KM</div>
                    <span className="font-bold text-slate-850 dark:text-slate-200">बुंदेली कृषि मित्र</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{user?.language === 'English' ? item.nameEn : item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                    {user?.name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none mb-1">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.role === 'admin' ? 'कृषि वैज्ञानिक' : user?.district}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 w-full transition-colors cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span>लॉगआउट</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

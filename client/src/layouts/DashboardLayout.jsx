import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, fetchCurrentUser } from '../redux/slices/authSlice';
import { fetchNotifications, markNotificationRead } from '../redux/slices/notificationSlice';
import { useTheme } from '../context/ThemeContext';
import { BACKEND_URL } from '../services/api';
import { 
  FiHome, FiUser, FiBriefcase, FiFileText, FiCalendar, FiBell, FiSettings, 
  FiLogOut, FiSun, FiMoon, FiMenu, FiX, FiLayers, FiActivity, FiUsers, FiSliders
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const { user, profile } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleMarkNotification = (id) => {
    dispatch(markNotificationRead(id));
  };

  const getSidebarLinks = () => {
    const role = user?.role;
    if (role === 'candidate') {
      return [
        { label: 'Dashboard', path: '/candidate', icon: <FiHome /> },
        { label: 'My Profile', path: '/profile', icon: <FiUser /> },
        { label: 'Explore Jobs', path: '/jobs', icon: <FiBriefcase /> },
        { label: 'Applications', path: '/candidate/applications', icon: <FiFileText /> },
        { label: 'Interviews', path: '/candidate/interviews', icon: <FiCalendar /> },
        { label: 'Notifications', path: '/candidate/notifications', icon: <FiBell /> },
        { label: 'Settings', path: '/candidate/settings', icon: <FiSettings /> }
      ];
    } else if (role === 'recruiter') {
      return [
        { label: 'Dashboard', path: '/recruiter', icon: <FiHome /> },
        { label: 'Company Profile', path: '/profile', icon: <FiUser /> },
        { label: 'Post a Job', path: '/recruiter/post-job', icon: <FiLayers /> },
        { label: 'Manage Jobs', path: '/recruiter/jobs', icon: <FiBriefcase /> },
        { label: 'Interviews', path: '/recruiter/interviews', icon: <FiCalendar /> },
        { label: 'Hiring Analytics', path: '/recruiter/analytics', icon: <FiActivity /> },
        { label: 'Notifications', path: '/recruiter/notifications', icon: <FiBell /> },
        { label: 'Settings', path: '/recruiter/settings', icon: <FiSettings /> }
      ];
    } else if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin', icon: <FiHome /> },
        { label: 'Users Manager', path: '/admin/users', icon: <FiUsers /> },
        { label: 'AI Tuning', path: '/admin/settings', icon: <FiSliders /> },
        { label: 'Notifications', path: '/admin/notifications', icon: <FiBell /> },
        { label: 'Settings', path: '/admin/profile-settings', icon: <FiSettings /> }
      ];
    }
    return [];
  };

  const links = getSidebarLinks();

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${theme === 'dark' ? 'bg-darkBg text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-indigo-500/10 dark:bg-darkBg bg-white flex flex-col justify-between transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-indigo-500/10">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gradient">
              <span className="text-2xl">⚡</span>
              <span>SmartRecruit</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-200">
              <FiX size={20} />
            </button>
          </div>

          <nav className="mt-6 px-4 space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-brandIndigo text-white shadow-neonIndigo' 
                      : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-indigo-500/10">
          <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 border border-indigo-500/5 mb-3">
            <div className="w-10 h-10 rounded-full bg-brandIndigo flex items-center justify-center font-bold text-white uppercase overflow-hidden shadow-neonIndigo">
              {profile?.profileImageUrl || profile?.companyLogo ? (
                <img 
                  src={(profile.profileImageUrl || profile.companyLogo).startsWith('http') ? (profile.profileImageUrl || profile.companyLogo) : `${BACKEND_URL}${profile.profileImageUrl || profile.companyLogo}`} 
                  alt="" 
                  className="w-full h-full object-cover rounded-full" 
                />
              ) : (
                profile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{profile?.name || 'Portal User'}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all font-medium text-sm"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        
        <header className="h-16 sticky top-0 z-40 backdrop-blur-md border-b border-indigo-500/5 bg-opacity-70 dark:bg-darkBg/70 bg-white/70 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="text-lg font-semibold tracking-tight capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <FiSun className="text-amber-400" /> : <FiMoon className="text-indigo-600" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 relative transition-colors"
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center badge-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-panel border border-indigo-500/20 bg-white dark:bg-[#0c101d] overflow-hidden shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-indigo-500/10 flex justify-between items-center">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && <span className="text-xs bg-brandIndigo/25 text-brandIndigo px-2 py-0.5 rounded-full font-medium">{unreadCount} New</span>}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">No notifications available</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => { handleMarkNotification(n._id); setShowNotifications(false); }}
                          className={`p-3 border-b border-indigo-500/5 hover:bg-slate-200/35 dark:hover:bg-slate-800/35 cursor-pointer transition-colors text-xs ${!n.readStatus ? 'bg-indigo-500/5 font-medium' : ''}`}
                        >
                          <p>{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-indigo-500/10 text-center">
                    <Link
                      to={user?.role === 'admin' ? '/admin/notifications' : `/${user?.role}/notifications`}
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-brandIndigo hover:underline"
                    >
                      View all alerts
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
              <span className="hidden md:inline font-medium text-sm">{profile?.name || 'Portal User'}</span>
              <div className="w-8 h-8 rounded-full bg-brandIndigo flex items-center justify-center text-xs font-bold text-white shadow-neonIndigo">
                {profile?.profileImageUrl || profile?.companyLogo ? (
                  <img 
                    src={(profile.profileImageUrl || profile.companyLogo).startsWith('http') ? (profile.profileImageUrl || profile.companyLogo) : `${BACKEND_URL}${profile.profileImageUrl || profile.companyLogo}`} 
                    alt="" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                ) : (
                  profile?.name?.charAt(0) || 'U'
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;

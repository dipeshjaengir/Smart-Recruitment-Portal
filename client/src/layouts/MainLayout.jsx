import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { token, user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${theme === 'dark' ? 'bg-darkBg text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-indigo-500/10 bg-opacity-70 dark:bg-darkBg/70 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gradient">
                <span className="text-2xl">⚡</span>
                <span>SmartRecruit</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/jobs" className="hover:text-brandIndigo transition-colors font-medium">Find Jobs</Link>
              <Link to="/about" className="hover:text-brandIndigo transition-colors font-medium">About</Link>
              <Link to="/contact" className="hover:text-brandIndigo transition-colors font-medium">Contact</Link>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <FiSun className="text-amber-400" /> : <FiMoon className="text-indigo-600" />}
              </button>

              {token && user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to={user.role === 'admin' ? '/admin' : user.role === 'recruiter' ? '/recruiter' : '/candidate'}
                    className="flex items-center gap-1 btn-glass px-4 py-2 rounded-lg font-medium text-sm"
                  >
                    <FiUser />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="px-4 py-2 hover:text-brandIndigo font-medium transition-colors">Sign In</Link>
                  <Link to="/register" className="btn-violet px-4 py-2 rounded-lg text-sm font-medium">Get Started</Link>
                </div>
              )}
            </nav>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full">
                {theme === 'dark' ? <FiSun className="text-amber-400" /> : <FiMoon className="text-indigo-600" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-500 hover:text-slate-600 focus:outline-none"
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-darkBg py-4 px-6 space-y-3">
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block hover:text-brandIndigo transition-colors py-1">Find Jobs</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block hover:text-brandIndigo transition-colors py-1">About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block hover:text-brandIndigo transition-colors py-1">Contact</Link>
            <hr className="border-slate-200 dark:border-slate-800" />
            {token && user ? (
              <div className="space-y-2">
                <Link 
                  to={user.role === 'admin' ? '/admin' : user.role === 'recruiter' ? '/recruiter' : '/candidate'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center btn-glass py-2 rounded-lg"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-center bg-red-500/10 border border-red-500/30 text-red-500 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center btn-violet py-2 rounded-lg">Get Started</Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t border-indigo-500/5 bg-white dark:bg-[#080b13] py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SmartRecruit. All rights reserved. Powered by Local AI Scoring.</p>
        </div>
      </footer>

    </div>
  );
};

export default MainLayout;

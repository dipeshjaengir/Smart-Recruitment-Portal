import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/Button';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

export const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
        
        <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-brandIndigo text-3xl flex items-center justify-center rounded-full shadow-neonIndigo">
          <FiAlertCircle />
        </div>
        
        <h2 className="text-4xl font-extrabold tracking-tight">404 - Page Not Found</h2>
        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
          The resources or dashboard coordinates you requested could not be resolved by our server filters.
        </p>

        <Link to="/">
          <Button variant="violet" className="flex items-center gap-2">
            <FiHome />
            <span>Return to Landing</span>
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import { FiArrowRight, FiShield, FiCpu, FiTrendingUp } from 'react-icons/fi';

export const LandingPage = () => {
  return (
    <MainLayout>
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brandIndigo/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-brandCyan/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-brandIndigo text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-brandCyan animate-ping" />
            <span>Next-Gen MERN Recruiter Powered by Local AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto"
          >
            Revolutionize Hiring with <br />
            <span className="text-gradient">AI-Based Match Shortlisting</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
          >
            Streamline candidate matching. Upload resumes, parse parameters instantly, and short-list talent using a custom rule-based scoring engine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/jobs" className="w-full sm:w-auto btn-violet px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 text-base shadow-neonIndigo">
              <span>Explore Active Jobs</span>
              <FiArrowRight />
            </Link>
            <Link to="/register" className="w-full sm:w-auto btn-glass px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 text-base">
              <span>Recruiter Sign Up</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 border-t border-indigo-500/5 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise Capabilities</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built for scalable performance with secure authentication and intelligent features.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -8 }}
              className="glass-panel p-8 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-brandIndigo/10 text-brandIndigo flex items-center justify-center text-2xl mx-auto mb-6 border border-indigo-500/20">
                <FiCpu />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local AI Scoring</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Evaluates candidates dynamically against requirements (Skills, Exp, Education, Keywords) on the server without third-party API dependencies.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="glass-panel p-8 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-brandCyan/10 text-brandCyan flex items-center justify-center text-2xl mx-auto mb-6 border border-cyan-500/20">
                <FiShield />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Operations</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Role-based access, JWT auth sessions, password hashing, and Helmet headers protection ensure data integrity.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8 }}
              className="glass-panel p-8 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-brandEmerald/10 text-brandEmerald flex items-center justify-center text-2xl mx-auto mb-6 border border-emerald-500/20">
                <FiTrendingUp />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hiring Dashboard</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Recruiters and admins view performance metrics, schedule calendar interviews, and export candidate summaries (CSV).
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-10 bg-gradient-to-r from-brandIndigo/5 to-brandCyan/5 border border-indigo-500/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl sm:text-5xl font-extrabold text-gradient-cyan mb-2">98%</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Match Accuracy</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-extrabold text-gradient mb-2">10k+</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Resumes Parsed</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-extrabold text-gradient-cyan mb-2">250+</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Companies Hiring</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-extrabold text-gradient mb-2">&lt; 3s</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Parsing Time</p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;

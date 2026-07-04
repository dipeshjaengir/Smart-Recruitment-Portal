import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

// Layout & Context
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboards
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Shared Pages
import ProfilePage from './pages/ProfilePage';
import InterviewsPage from './pages/InterviewsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import PostJobPage from './pages/PostJobPage';
import RecruiterJobsPage from './pages/RecruiterJobsPage';
import ApplicantsPage from './pages/ApplicantsPage';
import RecruiterAnalytics from './pages/RecruiterAnalytics';

// Protected Route Guard
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Candidate Routes */}
          <Route
            path="/candidate"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/applications"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/interviews"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <InterviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/notifications"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/settings"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <PostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:jobId/applications"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <ApplicantsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/interviews"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <InterviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/analytics"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <RecruiterAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/notifications"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/settings"
            element={
              <ProtectedRoute allowedRoles={['recruiter']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile-settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Profile Page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['candidate', 'recruiter']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </ThemeProvider>
  );
};

export default App;

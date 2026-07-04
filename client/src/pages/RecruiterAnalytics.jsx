import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import api from '../services/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

export const RecruiterAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data.analytics || null);
      } catch (err) {}
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  const getBarChartData = () => {
    if (!data?.categoriesBreakdown) return { labels: [], datasets: [] };
    
    return {
      labels: data.categoriesBreakdown.map(c => c._id || 'General'),
      datasets: [
        {
          label: 'Active Vacancies',
          data: data.categoriesBreakdown.map(c => c.count),
          backgroundColor: 'rgba(99, 102, 241, 0.65)',
          borderColor: '#6366f1',
          borderWidth: 1
        }
      ]
    };
  };

  const getPieChartData = () => {
    if (!data?.applicationStatuses) return { labels: [], datasets: [] };

    return {
      labels: data.applicationStatuses.map(s => s._id.toUpperCase()),
      datasets: [
        {
          data: data.applicationStatuses.map(s => s.count),
          backgroundColor: [
            'rgba(99, 102, 241, 0.65)', // applied
            'rgba(6, 182, 212, 0.65)',  // shortlisted
            'rgba(234, 179, 8, 0.65)',  // interviewing
            'rgba(16, 185, 129, 0.65)', // accepted
            'rgba(239, 68, 68, 0.65)'   // rejected
          ],
          borderWidth: 0
        }
      ]
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gradient-cyan">Hiring Analytics</h2>
          <p className="text-xs text-slate-400">Review aggregates for applicants and vacancy categories</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Aggregating visual logs...</div>
        ) : !data ? (
          <div className="glass-panel p-8 text-center text-slate-400 border border-indigo-500/10">
            No statistics metrics available.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <Card hoverEffect={false} className="border border-indigo-500/10 p-6 flex flex-col justify-between min-h-[350px]">
              <h3 className="text-sm font-bold text-slate-200 mb-6">Vacancies by Category</h3>
              <div className="h-64 flex items-center justify-center">
                <Bar 
                  data={getBarChartData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }} 
                />
              </div>
            </Card>

            <Card hoverEffect={false} className="border border-indigo-500/10 p-6 flex flex-col justify-between min-h-[350px]">
              <h3 className="text-sm font-bold text-slate-200 mb-6">Applicants Pipeline</h3>
              <div className="h-64 flex items-center justify-center">
                <Pie 
                  data={getPieChartData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }} 
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterAnalytics;

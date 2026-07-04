import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import api from '../services/api';
import { FiCalendar, FiClock, FiVideo, FiUser, FiBriefcase } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const InterviewsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const endpoint = user?.role === 'recruiter' ? '/interviews/recruiter' : '/interviews/candidate';
      const res = await api.get(endpoint);
      setInterviews(res.data.interviews || []);
    } catch (err) {
      toast.error('Failed to load interviews.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInterviews();
  }, [user]);

  const handleCancelInterview = async (id) => {
    if (window.confirm('Are you sure you want to cancel this scheduled interview?')) {
      try {
        await api.put(`/interviews/${id}`, { status: 'cancelled' });
        toast.success('Interview marked as cancelled.');
        fetchInterviews();
      } catch (err) {
        toast.error('Failed to cancel interview.');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gradient-cyan">Interviews Calendar</h2>
          <p className="text-xs text-slate-400">Review upcoming virtual interview slots and launch credentials</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading interview queue...</div>
        ) : interviews.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 border border-indigo-500/10">
            <FiCalendar className="mx-auto text-4xl mb-4 text-indigo-500/30" />
            <p>No upcoming interviews have been scheduled yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((int) => (
              <Card key={int._id} hoverEffect={true} className="border border-indigo-500/10 flex flex-col justify-between h-72">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      int.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {int.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{int.platform}</span>
                  </div>

                  <h3 className="font-extrabold text-slate-200 text-sm leading-snug mb-1 truncate">
                    {int.job?.title || 'Hiring Interview'}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">{int.job?.companyName || 'Manager'}</p>

                  <div className="space-y-2 text-xs text-slate-300 font-semibold mb-6">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-brandIndigo" />
                      <span>{int.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-brandIndigo" />
                      <span>{int.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.role === 'recruiter' ? <FiUser className="text-brandIndigo" /> : <FiBriefcase className="text-brandIndigo" />}
                      <span className="truncate">
                        {user?.role === 'recruiter' 
                          ? `Applicant: ${int.candidateProfile?.name || 'Candidate'}` 
                          : `Hiring Representative`
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={int.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-grow flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brandIndigo/15 hover:bg-brandIndigo text-brandIndigo hover:text-white border border-brandIndigo/25 text-xs font-bold transition-all shadow-neonIndigo"
                  >
                    <FiVideo />
                    <span>Launch Meet</span>
                  </a>
                  {user?.role === 'recruiter' && int.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelInterview(int._id)}
                      className="px-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/25 transition-all text-xs font-semibold"
                      title="Cancel Event"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewsPage;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { fetchCandidateApplications } from '../redux/slices/applicationSlice';
import api from '../services/api';
import { 
  FiFileText, FiBookmark, FiCalendar, FiTrendingUp, FiCheckCircle, FiClock, FiPlayCircle 
} from 'react-icons/fi';

export const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);
  const { applications, loading } = useSelector((state) => state.applications);
  
  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCandidateApplications());
    
    const fetchInterviews = async () => {
      setInterviewsLoading(true);
      try {
        const res = await api.get('/interviews/candidate');
        setInterviews(res.data.interviews || []);
      } catch (err) {}
      setInterviewsLoading(false);
    };
    fetchInterviews();
  }, [dispatch]);

  const totalApplied = applications.length;
  const interviewingCount = applications.filter(a => a.status === 'interviewing').length;
  const acceptedCount = applications.filter(a => a.status === 'accepted').length;
  
  const avgAiScore = totalApplied > 0 
    ? Math.round(applications.reduce((acc, app) => acc + (app.aiScore?.overall || 0), 0) / totalApplied)
    : 0;

  const profilePercent = profile?.profileCompletion || 0;

  const upcomingInterviews = interviews.filter(int => {
    if (int.status !== 'scheduled') return false;
    try {
      const time = int.time && /^\d{2}:\d{2}$/.test(int.time) ? int.time : '00:00';
      return new Date(`${int.date}T${time}`) >= new Date();
    } catch (e) {
      return true;
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gradient-cyan">Welcome Back, {profile?.name || 'Candidate'}!</h2>
            <p className="text-xs text-slate-400">Here is a quick overview of your job search progress</p>
          </div>
          
          <div className="w-full md:w-64 bg-slate-900/60 rounded-xl p-3 border border-indigo-500/10 text-xs">
            <div className="flex justify-between items-center mb-1 font-semibold">
              <span className="text-slate-400">Profile Strength</span>
              <span className="text-brandIndigo">{profilePercent}%</span>
            </div>
            <div className="w-full h-2 rounded bg-slate-800 overflow-hidden">
              <div className="h-full bg-brandIndigo transition-all duration-500" style={{ width: `${profilePercent}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hoverEffect={false} className="border border-indigo-500/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applied</p>
                <p className="text-3xl font-extrabold mt-1">{totalApplied}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-brandIndigo"><FiFileText size={20} /></div>
            </div>
          </Card>

          <Card hoverEffect={false} className="border border-indigo-500/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interviews</p>
                <p className="text-3xl font-extrabold mt-1">{interviewingCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500"><FiCalendar size={20} /></div>
            </div>
          </Card>

          <Card hoverEffect={false} className="border border-indigo-500/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accepted</p>
                <p className="text-3xl font-extrabold mt-1">{acceptedCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><FiCheckCircle size={20} /></div>
            </div>
          </Card>

          <Card hoverEffect={false} className="border border-indigo-500/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg AI Suitability</p>
                <p className="text-3xl font-extrabold mt-1">{avgAiScore}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-brandCyan"><FiTrendingUp size={20} /></div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-gradient-cyan">Recent Applications</h3>
            
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="glass-panel p-8 text-center text-slate-400 border border-indigo-500/10">
                You haven't submitted any job applications yet.{' '}
                <Link to="/jobs" className="text-brandIndigo font-semibold hover:underline">Explore openings</Link>.
              </div>
            ) : (
              <Table headers={['Job Title', 'Company', 'AI Score', 'Status', 'Date']}>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app._id} className="hover:bg-slate-800/15 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      <Link to={`/jobs/${app.job?._id}`} className="hover:underline hover:text-brandIndigo">
                        {app.job?.title || 'Unknown Role'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{app.job?.companyName || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${app.aiScore?.overall >= 75 ? 'text-emerald-400' : app.aiScore?.overall >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {app.aiScore?.overall}%
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                        app.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                        app.status === 'interviewing' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-indigo-500/10 text-brandIndigo'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </div>

          <div className="space-y-8">
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gradient-cyan">Interviews Calendar</h3>
              
              {interviewsLoading ? (
                <div className="py-6 text-center text-slate-400 text-xs">Loading calendar...</div>
              ) : upcomingInterviews.length === 0 ? (
                <div className="glass-panel p-6 text-center text-slate-400 border border-indigo-500/10 text-xs">
                  <FiClock className="mx-auto text-2xl mb-2 text-indigo-500/30" />
                  No upcoming virtual interviews.
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingInterviews.slice(0, 3).map((int) => (
                    <Card key={int._id} hoverEffect={true} className="p-4 border border-indigo-500/10 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm truncate">{int.job?.title || 'Job Interview'}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 mb-3">{int.job?.companyName || 'Hiring Manager'}</p>
                        
                        <div className="flex gap-4 text-[10px] text-slate-300 font-semibold mb-4">
                          <span>📅 {int.date}</span>
                          <span>⏰ {int.time}</span>
                        </div>
                      </div>

                      <a
                        href={int.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-brandIndigo/10 text-brandIndigo border border-brandIndigo/25 text-xs font-semibold hover:bg-brandIndigo hover:text-white transition-all shadow-neonIndigo"
                      >
                        <FiPlayCircle />
                        <span>Launch {int.platform} Meeting</span>
                      </a>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gradient-cyan">Saved Opportunities</h3>
              
              {!profile?.savedJobs || profile.savedJobs.length === 0 ? (
                <div className="glass-panel p-6 text-center text-slate-400 border border-indigo-500/10 text-xs">
                  <FiBookmark className="mx-auto text-2xl mb-2 text-indigo-500/30" />
                  No saved bookmarks yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.savedJobs.slice(0, 3).map((job) => (
                    <div 
                      key={job._id}
                      className="p-3.5 glass-panel border border-indigo-500/5 bg-slate-900/30 flex justify-between items-center text-xs"
                    >
                      <div className="overflow-hidden">
                        <Link to={`/jobs/${job._id}`} className="font-bold text-slate-200 hover:text-brandIndigo hover:underline truncate block">
                          {job.title}
                        </Link>
                        <span className="text-[10px] text-slate-400">{job.companyName}</span>
                      </div>
                      <Link to={`/jobs/${job._id}`} className="text-[10px] font-bold text-brandIndigo hover:underline ml-2">
                        Apply
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;

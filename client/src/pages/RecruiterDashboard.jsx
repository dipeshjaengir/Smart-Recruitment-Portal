import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { fetchRecruiterJobs, deleteJobListing } from '../redux/slices/jobSlice';
import api from '../services/api';
import { 
  FiBriefcase, FiUsers, FiCalendar, FiActivity, FiPlus, FiTrash2, FiClock, FiExternalLink 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { recruiterJobs, loading } = useSelector((state) => state.jobs);
  const { profile } = useSelector((state) => state.auth);

  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    dispatch(fetchRecruiterJobs());
    
    const fetchInterviewsAndStats = async () => {
      setInterviewsLoading(true);
      try {
        const intRes = await api.get('/interviews/recruiter');
        setInterviews(intRes.data.interviews || []);

        const statsRes = await api.get('/admin/analytics');
        setApplicationsCount(statsRes.data.analytics?.totalApplications || 0);
      } catch (err) {}
      setInterviewsLoading(false);
    };
    fetchInterviewsAndStats();
  }, [dispatch]);

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting? This action will remove all corresponding candidate applications.')) {
      try {
        await dispatch(deleteJobListing(id));
        toast.success('Job listing removed successfully.');
      } catch (err) {
        toast.error('Failed to remove job posting.');
      }
    }
  };

  const totalJobs = recruiterJobs.length;
  const totalInterviews = interviews.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gradient-cyan">Welcome Back, {profile?.name || 'Recruiter'}!</h2>
            <p className="text-xs text-slate-400">Manage candidate match logs and interview pipelines</p>
          </div>
          <Link to="/recruiter/post-job" className="btn-violet px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs shadow-neonIndigo">
            <FiPlus />
            <span>Create New Job</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hoverEffect={false} className="border border-indigo-500/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jobs Posted</p>
                <p className="text-3xl font-extrabold mt-1">{totalJobs}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-brandIndigo"><FiBriefcase size={20} /></div>
            </div>
          </Card>

          <Card hoverEffect={false} className="border border-indigo-500/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applicants</p>
                <p className="text-3xl font-extrabold mt-1">{applicationsCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-brandCyan"><FiUsers size={20} /></div>
            </div>
          </Card>

          <Card hoverEffect={false} className="border border-indigo-500/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interviews</p>
                <p className="text-3xl font-extrabold mt-1">{totalInterviews}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-500"><FiCalendar size={20} /></div>
            </div>
          </Card>

          <Card hoverEffect={false} className="border border-indigo-500/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hiring Velocity</p>
                <p className="text-3xl font-extrabold mt-1">Optimal</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><FiActivity size={20} /></div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-gradient-cyan">Active Vacancies</h3>
            
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading vacancy lists...</div>
            ) : recruiterJobs.length === 0 ? (
              <div className="glass-panel p-8 text-center text-slate-400 border border-indigo-500/10 text-xs">
                You haven't posted any job vacancies yet.{' '}
                <Link to="/recruiter/post-job" className="text-brandIndigo font-semibold hover:underline">Post your first vacancy</Link>.
              </div>
            ) : (
              <Table headers={['Job Title', 'Location', 'Job Type', 'Status', 'Actions']}>
                {recruiterJobs.slice(0, 5).map((job) => (
                  <tr key={job._id} className="hover:bg-slate-800/15 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      <Link to={`/jobs/${job._id}`} className="hover:underline hover:text-brandIndigo">{job.title}</Link>
                    </td>
                    <td className="px-6 py-4 text-slate-400 capitalize">{job.location}</td>
                    <td className="px-6 py-4 text-slate-400 capitalize">{job.jobType.replace('-', ' ')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${job.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link 
                          to={`/recruiter/jobs/${job._id}/applications`}
                          className="p-1.5 rounded bg-indigo-500/10 border border-indigo-500/25 hover:bg-brandIndigo text-brandIndigo hover:text-white transition-all text-xs"
                          title="View Candidates"
                        >
                          <FiUsers />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-1.5 rounded bg-red-500/10 border border-red-500/25 hover:bg-red-500 text-red-500 hover:text-white transition-all text-xs"
                          title="Delete Vacancy"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gradient-cyan">Interviews Queue</h3>
            
            {interviewsLoading ? (
              <div className="py-6 text-center text-slate-400 text-xs">Loading queue...</div>
            ) : interviews.length === 0 ? (
              <div className="glass-panel p-6 text-center text-slate-400 border border-indigo-500/10 text-xs">
                <FiClock className="mx-auto text-2xl mb-2 text-indigo-500/30" />
                No interviews scheduled.
              </div>
            ) : (
              <div className="space-y-4">
                {interviews.slice(0, 3).map((int) => (
                  <Card key={int._id} hoverEffect={true} className="p-4 border border-indigo-500/10">
                    <h4 className="font-bold text-xs truncate">{int.candidateProfile?.name || 'Candidate'}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 mb-2 truncate">Position: {int.job?.title}</p>
                    
                    <div className="flex gap-4 text-[10px] text-slate-300 font-semibold mb-3">
                      <span>📅 {int.date}</span>
                      <span>⏰ {int.time}</span>
                    </div>

                    <a
                      href={int.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cyan-500/10 text-brandCyan border border-cyan-500/25 text-xs font-semibold hover:bg-cyan-500 hover:text-darkBg transition-all shadow-neonCyan"
                    >
                      <FiExternalLink />
                      <span>Start {int.platform} Meet</span>
                    </a>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;

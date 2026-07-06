import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { fetchJobApplications, updateApplicationStatus } from '../redux/slices/applicationSlice';
import { fetchJobById } from '../redux/slices/jobSlice';
import api, { API_URL } from '../services/api';
import { 
  FiFileText, FiCalendar, FiArrowLeft, FiCheckCircle, FiXCircle, FiTrendingUp 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const ApplicantsPage = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();

  const { applicants, loading } = useSelector((state) => state.applications);
  const { selectedJob } = useSelector((state) => state.jobs);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [meetingPlatform, setMeetingPlatform] = useState('Google Meet');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-defg-hij');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchJobApplications(jobId));
    dispatch(fetchJobById(jobId));
  }, [dispatch, jobId]);

  const handleUpdateStatus = async (id, status) => {
    const comment = `Status updated by recruiter to ${status}`;
    try {
      await dispatch(updateApplicationStatus({ id, status, comment }));
      toast.success(`Applicant status updated to ${status.toUpperCase()}!`);
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewDate || !interviewTime || !meetingLink) {
      return toast.error('Please specify date, time, and meeting link.');
    }

    setScheduleLoading(true);
    try {
      await api.post('/interviews', {
        applicationId: selectedApplication._id,
        date: interviewDate,
        time: interviewTime,
        platform: meetingPlatform,
        meetingLink,
        notes: interviewNotes
      });
      toast.success('Interview scheduled and invitation dispatched successfully!');
      setIsScheduleModalOpen(false);
      dispatch(fetchJobApplications(jobId));
      
      setInterviewDate('');
      setInterviewTime('');
      setInterviewNotes('');
    } catch (err) {
      toast.error('Failed to schedule interview event.');
    }
    setScheduleLoading(false);
  };

  const handleExportCSV = () => {
    window.open(`${API_URL}/applications/export/csv/${jobId}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link to="/recruiter/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brandIndigo">
          <FiArrowLeft />
          <span>Back to Vacancies</span>
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gradient-cyan">Applicants: {selectedJob?.title}</h2>
            <p className="text-xs text-slate-400">Review AI suitability index and coordinate calendar invitations</p>
          </div>
          
          <Button onClick={handleExportCSV} variant="glass" className="text-xs">
            Export List (CSV)
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading applicants data...</div>
        ) : applicants.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 border border-indigo-500/10 text-xs">
            No candidates have applied for this position yet.
          </div>
        ) : (
          <Table headers={['Applicant', 'Overall Match', 'Skills Match', 'Experience Match', 'Status', 'Actions']}>
            {applicants.map((app) => (
              <tr key={app._id} className="hover:bg-slate-800/15 transition-colors">
                <td className="px-6 py-4">
                  <div className="overflow-hidden max-w-xs">
                    <p className="font-semibold text-slate-200 truncate">{app.candidateProfile?.name || 'Parsed Candidate'}</p>
                    <p className="text-[10px] text-slate-400 truncate">{app.candidate?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FiTrendingUp className={app.aiScore?.overall >= 75 ? 'text-emerald-400' : app.aiScore?.overall >= 50 ? 'text-yellow-400' : 'text-red-400'} />
                    <span className={`font-bold ${
                      app.aiScore?.overall >= 75 ? 'text-emerald-400' :
                      app.aiScore?.overall >= 50 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {app.aiScore?.overall}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">({app.aiRecommendation})</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-300">{app.aiScore?.skills}%</td>
                <td className="px-6 py-4 font-semibold text-slate-300">{app.aiScore?.experience}%</td>
                <td className="px-6 py-4 capitalize text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                    app.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                    app.status === 'interviewing' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-indigo-500/10 text-brandIndigo'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 transition-all text-xs"
                      title="View Resume"
                    >
                      <FiFileText />
                    </a>
                    
                    {app.status !== 'rejected' && app.status !== 'accepted' && (
                      <>
                        <button
                          onClick={() => { setSelectedApplication(app); setIsScheduleModalOpen(true); }}
                          className="p-1.5 rounded bg-yellow-500/10 border border-yellow-500/25 hover:bg-yellow-500 text-yellow-500 hover:text-darkBg transition-all text-xs"
                          title="Schedule Interview"
                        >
                          <FiCalendar />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'accepted')}
                          className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500 text-emerald-500 hover:text-white transition-all text-xs"
                          title="Accept Application"
                        >
                          <FiCheckCircle />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'rejected')}
                          className="p-1.5 rounded bg-red-500/10 border border-red-500/25 hover:bg-red-500 text-red-500 hover:text-white transition-all text-xs"
                          title="Reject Application"
                        >
                          <FiXCircle />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}

        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title="Schedule Virtual Interview"
        >
          <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Interview Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="glass-input dark:bg-slate-900 border-indigo-500/10"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase">Time Slot</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM - 10:30 AM"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="glass-input dark:bg-slate-900 border-indigo-500/10"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-400 uppercase">Meeting Platform</label>
              <select
                value={meetingPlatform}
                onChange={(e) => setMeetingPlatform(e.target.value)}
                className="glass-input dark:bg-slate-900 border-indigo-500/10 text-xs"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom Meeting">Zoom Meeting</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-400 uppercase">Video Meeting URL</label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="glass-input dark:bg-slate-900 border-indigo-500/10 text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-400 uppercase">Message / Notes</label>
              <textarea
                placeholder="Include call expectations or instructions..."
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                className="w-full h-24 glass-input dark:bg-slate-900 border-indigo-500/10 text-xs p-2"
              />
            </div>

            <Button type="submit" loading={scheduleLoading} className="w-full">
              Dispatch Calendar Invite
            </Button>
          </form>
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default ApplicantsPage;

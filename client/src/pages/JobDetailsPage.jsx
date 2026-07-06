import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { fetchJobById, clearSelectedJob } from '../redux/slices/jobSlice';
import { submitJobApplication } from '../redux/slices/applicationSlice';
import { FiMapPin, FiCalendar, FiCreditCard, FiClock, FiGrid, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { formatSalary } from '../services/api';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { selectedJob, loading: jobLoading } = useSelector((state) => state.jobs);
  const { user, profile } = useSelector((state) => state.auth);
  const { loading: applyLoading } = useSelector((state) => state.applications);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [appliedSuccessfully, setAppliedSuccessfully] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(id));
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!profile?.resumeUrl) {
      toast.error('You must upload a PDF resume in your profile before applying.');
      return navigate('/profile');
    }

    const actionResult = await dispatch(submitJobApplication({ jobId: id, coverLetter }));
    if (submitJobApplication.fulfilled.match(actionResult)) {
      toast.success('Applied successfully! AI matching analysis completed.');
      setAppliedSuccessfully(true);
    } else {
      toast.error(actionResult.payload || 'Failed to submit application.');
    }
  };

  if (jobLoading || !selectedJob) {
    return (
      <MainLayout>
        <div className="py-24 text-center text-slate-400">Loading vacancy details...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <Link to="/jobs" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brandIndigo mb-8">
          <FiArrowLeft />
          <span>Back to Opportunities</span>
        </Link>

        <div className="glass-panel p-8 border border-indigo-500/10 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-[10px] font-bold bg-brandIndigo/10 text-brandIndigo px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                {selectedJob.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">{selectedJob.title}</h2>
              <p className="text-slate-400 text-sm font-medium">{selectedJob.companyName} • {selectedJob.location}</p>
            </div>

            {user?.role === 'recruiter' && selectedJob.recruiter === user.id ? (
              <Link to={`/recruiter/jobs/${selectedJob._id}/applications`} className="btn-glass px-5 py-2.5 rounded-xl text-sm font-semibold shadow-neonIndigo">
                Review Applicants
              </Link>
            ) : (
              <Button 
                onClick={() => setIsApplyModalOpen(true)}
                variant="violet" 
                className="px-6 py-3 shadow-neonIndigo"
              >
                Apply for Position
              </Button>
            )}
          </div>

          <hr className="border-indigo-500/10 my-6" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-brandIndigo"><FiCreditCard size={16} /></div>
              <div>
                <p className="text-slate-400 font-medium">Annual Salary</p>
                <p className="font-bold text-slate-200">{formatSalary(selectedJob.salaryMin)} - {formatSalary(selectedJob.salaryMax)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-brandIndigo"><FiCalendar size={16} /></div>
              <div>
                <p className="text-slate-400 font-medium">Work Mode</p>
                <p className="font-bold text-slate-200 capitalize">{selectedJob.workMode}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-brandIndigo"><FiClock size={16} /></div>
              <div>
                <p className="text-slate-400 font-medium">Job Type</p>
                <p className="font-bold text-slate-200 capitalize">{selectedJob.jobType.replace('-', ' ')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-brandIndigo"><FiGrid size={16} /></div>
              <div>
                <p className="text-slate-400 font-medium">Experience</p>
                <p className="font-bold text-slate-200">{selectedJob.experienceRequired}+ Years Required</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 border border-indigo-500/10 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gradient-cyan mb-4">Job Description</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gradient-cyan mb-4">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {selectedJob.skillsRequired.map((s) => (
                <span key={s} className="text-xs px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gradient-cyan mb-4">Education Requirement</h3>
            <p className="text-sm text-slate-300 font-medium">{selectedJob.educationRequired}</p>
          </div>
        </div>

        <Modal 
          isOpen={isApplyModalOpen} 
          onClose={() => { setIsApplyModalOpen(false); setAppliedSuccessfully(false); }} 
          title="Apply for Position"
        >
          {!appliedSuccessfully ? (
            <form onSubmit={handleApplySubmit} className="space-y-5">
              <div className="text-center mb-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  We will evaluate your uploaded resume against the requirements of this job.
                </p>
                {profile?.resumeUrl ? (
                  <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-500 text-xs font-semibold inline-flex items-center gap-1.5">
                    <FiCheck />
                    <span>Active resume linked: {profile.name}'s Resume</span>
                  </div>
                ) : (
                  <div className="mt-3 p-2.5 bg-red-500/10 border border-red-500/25 rounded-lg text-red-500 text-xs font-semibold">
                    Warning: You haven't uploaded a resume PDF.
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">
                  Cover Letter (Optional)
                </label>
                <textarea
                  placeholder="Explain why you are a good match for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-32 glass-input dark:bg-slate-900 text-xs p-3 border-indigo-500/10"
                />
              </div>

              <Button 
                type="submit" 
                loading={applyLoading} 
                className="w-full"
                disabled={!profile?.resumeUrl}
              >
                Submit Application
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-2xl flex items-center justify-center rounded-full mx-auto animate-bounce">
                <FiCheck />
              </div>
              <h3 className="font-bold text-lg">Application Submitted!</h3>
              <p className="text-xs text-slate-400 px-4 leading-relaxed">
                Your application has been received. Our local AI Scoring Engine is evaluating your profile suitability. You can check the dashboard to review your status.
              </p>
              <Button 
                onClick={() => { setIsApplyModalOpen(false); navigate('/candidate/applications'); }}
                variant="violet" 
                className="w-full"
              >
                Go to Applications Tracker
              </Button>
            </div>
          )}
        </Modal>

      </div>
    </MainLayout>
  );
};

export default JobDetailsPage;

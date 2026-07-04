import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Table } from '../components/Table';
import { fetchRecruiterJobs, deleteJobListing } from '../redux/slices/jobSlice';
import { FiUsers, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const RecruiterJobsPage = () => {
  const dispatch = useDispatch();
  const { recruiterJobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchRecruiterJobs());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job posting permanently?')) {
      try {
        await dispatch(deleteJobListing(id));
        toast.success('Listing removed successfully.');
      } catch (err) {
        toast.error('Failed to remove job posting.');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gradient-cyan">Manage Posted Jobs</h2>
          <p className="text-xs text-slate-400">Review candidate matches and edit active job descriptions</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Syncing vacancy postings...</div>
        ) : recruiterJobs.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 border border-indigo-500/10">
            No active job postings.
          </div>
        ) : (
          <Table headers={['Vacancy Name', 'Location', 'Job Type', 'Status', 'Actions']}>
            {recruiterJobs.map((job) => (
              <tr key={job._id} className="hover:bg-slate-800/15 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-200">
                  <Link to={`/jobs/${job._id}`} className="hover:underline hover:text-brandIndigo">{job.title}</Link>
                </td>
                <td className="px-6 py-4 text-slate-400 capitalize">{job.location}</td>
                <td className="px-6 py-4 text-slate-400 capitalize">{job.jobType.replace('-', ' ')}</td>
                <td className="px-6 py-4 capitalize">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    job.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/recruiter/jobs/${job._id}/applications`}
                      className="p-1.5 rounded bg-indigo-500/10 border border-indigo-500/25 hover:bg-brandIndigo text-brandIndigo hover:text-white transition-all text-xs"
                      title="Applicants"
                    >
                      <FiUsers />
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-1.5 rounded bg-red-500/10 border border-red-500/25 hover:bg-red-500 text-red-500 hover:text-white transition-all text-xs"
                      title="Delete"
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
    </DashboardLayout>
  );
};

export default RecruiterJobsPage;

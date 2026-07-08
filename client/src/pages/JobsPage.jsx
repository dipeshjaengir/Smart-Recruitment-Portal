import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { fetchJobs } from '../redux/slices/jobSlice';
import api, { API_URL, formatSalary } from '../services/api';
import { 
  FiSearch, FiMapPin, FiCreditCard, FiFilter, FiBookmark, 
  FiChevronLeft, FiChevronRight, FiBriefcase 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const JobsPage = () => {
  const dispatch = useDispatch();
  const { jobs, loading, totalPages, currentPage } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setCategories([
      'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 
      'MERN Stack Developer', 'Java Developer', 'Python Developer', 
      'DevOps Engineer', 'Cloud Engineer', 'Data Analyst', 'Data Scientist', 
      'AI/ML Engineer', 'UI/UX Designer', 'Product Manager'
    ]);
  }, []);

  const handleFetchJobs = () => {
    const params = {
      search: search || undefined,
      location: location || undefined,
      workMode: workMode || undefined,
      jobType: jobType || undefined,
      experience: experience || undefined,
      salaryMin: salaryMin || undefined,
      category: selectedCategory || undefined,
      sort,
      page,
      limit: 6
    };
    dispatch(fetchJobs(params));
  };

  useEffect(() => {
    handleFetchJobs();
  }, [dispatch, page, sort, workMode, jobType, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    handleFetchJobs();
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setWorkMode('');
    setJobType('');
    setExperience('');
    setSalaryMin('');
    setSelectedCategory('');
    setSort('newest');
    setPage(1);
  };

  const handleSaveJob = async (id) => {
    if (!user || user.role !== 'candidate') {
      return toast.error('Please log in as a candidate to bookmark jobs.');
    }
    try {
      const res = await api.post(`/jobs/save/${id}`);
      toast.success(res.data.message || 'Job added to bookmarks!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-10 text-center md:text-left">
          {user && user.role === 'candidate' && (
            <div className="mb-6 flex justify-start">
              <Link 
                to="/candidate" 
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brandIndigo transition-colors"
              >
                <FiChevronLeft className="text-sm" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          )}
          <h2 className="text-3xl font-extrabold text-gradient-cyan mb-2">Explore Opportunities</h2>
          <p className="text-slate-400 text-sm">Find software engineering positions scored directly by our AI engine</p>

          <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col md:flex-row gap-4 max-w-4xl">
            <div className="flex-grow relative col-span-2">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search job titles, descriptions, or companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '3rem' }}
                className="w-full pr-4 py-3 glass-input dark:bg-slate-900 border-indigo-500/10 focus:border-brandIndigo text-sm"
              />
            </div>
            <div className="w-full md:w-60 relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="City or remote..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ paddingLeft: '3rem' }}
                className="w-full pr-4 py-3 glass-input dark:bg-slate-900 border-indigo-500/10 focus:border-brandIndigo text-sm"
              />
            </div>
            <Button type="submit" variant="violet" className="px-8 py-3">
              Search
            </Button>
          </form>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          <aside className="glass-panel p-6 h-fit border border-indigo-500/10 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-indigo-500/10">
              <span className="font-bold flex items-center gap-2 text-sm text-gradient-cyan">
                <FiFilter />
                <span>Filters</span>
              </span>
              <button 
                onClick={handleClearFilters}
                className="text-xs text-slate-400 hover:text-brandIndigo hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 glass-input dark:bg-slate-900 border-indigo-500/10 text-xs focus:border-brandIndigo"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Work Mode</label>
              <div className="space-y-2 text-xs">
                {['remote', 'hybrid', 'onsite'].map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer hover:text-brandIndigo">
                    <input
                      type="radio"
                      name="workMode"
                      checked={workMode === mode}
                      onChange={() => setWorkMode(mode)}
                      className="accent-brandIndigo"
                    />
                    <span className="capitalize">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Job Type</label>
              <div className="space-y-2 text-xs">
                {['full-time', 'part-time', 'contract', 'internship'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer hover:text-brandIndigo">
                    <input
                      type="radio"
                      name="jobType"
                      checked={jobType === type}
                      onChange={() => setJobType(type)}
                      className="accent-brandIndigo"
                    />
                    <span className="capitalize">{type.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wide">Max Exp Required</span>
                <span className="font-bold text-slate-200">{experience ? `${experience} Yrs` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={experience || 15}
                onChange={(e) => setExperience(e.target.value === '15' ? '' : e.target.value)}
                className="w-full accent-brandIndigo"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Min Salary (₹)</label>
              <div className="relative">
                <FiCreditCard className="absolute left-3 top-3 text-slate-400 text-xs" />
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full pl-8 py-2.5 glass-input dark:bg-slate-900 border-indigo-500/10 text-xs"
                />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Showing matches</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="py-1.5 px-3 glass-input dark:bg-slate-900 border-indigo-500/10 text-xs focus:border-brandIndigo"
              >
                <option value="newest">Latest Posted</option>
                <option value="oldest">Oldest Posted</option>
                <option value="salary_desc">Salary (High to Low)</option>
                <option value="salary_asc">Salary (Low to High)</option>
              </select>
            </div>

            {loading ? (
              <div className="py-24 text-center text-slate-400">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="glass-panel p-12 text-center text-slate-400 border border-dashed border-indigo-500/10">
                <FiBriefcase className="mx-auto text-4xl mb-4 text-indigo-500/30" />
                <p>No job postings match your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <Card key={job._id} className="flex flex-col justify-between h-64 border border-indigo-500/5">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-semibold bg-brandIndigo/10 text-brandIndigo px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {job.category}
                        </span>
                        <button 
                          onClick={() => handleSaveJob(job._id)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-brandIndigo transition-colors"
                          title="Bookmark Job"
                        >
                          <FiBookmark />
                        </button>
                      </div>

                      <h3 className="font-bold text-lg mb-1 leading-tight hover:text-brandIndigo transition-colors">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-400 mb-4">{job.companyName} • {job.location}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skillsRequired.slice(0, 3).map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                            {s}
                          </span>
                        ))}
                        {job.skillsRequired.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium self-center">
                            +{job.skillsRequired.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-indigo-500/5 pt-4">
                      <span className="text-xs font-semibold text-slate-300">
                        {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)} / yr
                      </span>
                      <Link to={`/jobs/${job._id}`} className="text-xs font-bold text-brandIndigo flex items-center gap-1 hover:underline">
                        <span>Details</span>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-indigo-500/10 hover:bg-slate-800 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-xs text-slate-400 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-indigo-500/10 hover:bg-slate-800 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobsPage;

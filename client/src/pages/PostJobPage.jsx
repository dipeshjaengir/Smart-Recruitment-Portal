import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { createNewJob } from '../redux/slices/jobSlice';
import { toast } from 'react-hot-toast';

export const PostJobPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Full Stack Developer');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [experienceRequired, setExperienceRequired] = useState(0);
  const [educationRequired, setEducationRequired] = useState('Bachelor of Science');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('onsite');
  const [jobType, setJobType] = useState('full-time');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !skillsRequired.trim() || !location.trim()) {
      return toast.error('Please fill in all required fields.');
    }

    setLoading(true);
    const jobData = {
      title,
      description,
      category,
      skillsRequired,
      experienceRequired,
      educationRequired,
      salaryMin: salaryMin ? parseInt(salaryMin) : 0,
      salaryMax: salaryMax ? parseInt(salaryMax) : 0,
      location,
      workMode,
      jobType
    };

    const actionResult = await dispatch(createNewJob(jobData));
    if (createNewJob.fulfilled.match(actionResult)) {
      toast.success('Job position posted successfully!');
      navigate('/recruiter/jobs');
    } else {
      toast.error(actionResult.payload || 'Failed to create job posting');
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gradient-cyan">Post a Job Position</h2>
          <p className="text-xs text-slate-400">Specify skills requirements and work scopes for candidates matching</p>
        </div>

        <Card hoverEffect={false} className="border border-indigo-500/10 p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Job Title *"
                placeholder="e.g. Senior React Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hiring Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input dark:bg-slate-900 focus:border-brandIndigo text-xs"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="MERN Stack Developer">MERN Stack Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Cloud Engineer">Cloud Engineer</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Description *</label>
              <textarea
                placeholder="List responsibility logs, daily tasks, and requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full h-36 glass-input dark:bg-slate-900 focus:border-brandIndigo p-3 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Required Skills * (Comma Separated)"
                placeholder="React, Redux, Tailwind CSS, JavaScript"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                required
              />
              <span className="text-[10px] text-slate-500 italic block">Separate terms using commas for exact parser match</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Min Experience Required (Years) *"
                type="number"
                min="0"
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(parseInt(e.target.value))}
                required
              />
              <Input
                label="Required Education Benchmarks *"
                placeholder="Bachelor of Science / B.Tech"
                value={educationRequired}
                onChange={(e) => setEducationRequired(e.target.value)}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Min Salary ($/yr)"
                type="number"
                placeholder="e.g. 60000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
              <Input
                label="Max Salary ($/yr)"
                type="number"
                placeholder="e.g. 90000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Office Location *"
                placeholder="e.g. New York, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="glass-input dark:bg-slate-900 focus:border-brandIndigo text-xs"
                >
                  <option value="onsite">Onsite</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="glass-input dark:bg-slate-900 focus:border-brandIndigo text-xs"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Post Vacancy
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PostJobPage;

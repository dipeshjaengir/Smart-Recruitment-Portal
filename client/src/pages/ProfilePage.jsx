import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { updateProfileLocally } from '../redux/slices/authSlice';
import api, { BACKEND_URL } from '../services/api';
import { 
  FiFileText, FiUploadCloud, FiPlus, FiCpu 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.auth);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [about, setAbout] = useState('');
  const [designation, setDesignation] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setTitle(profile.title || '');
      setBio(profile.bio || '');
      setSkills(profile.skills || []);

      if (user?.role === 'recruiter') {
        setCompanyName(profile.companyName || '');
        setCompanyWebsite(profile.companyWebsite || '');
        setIndustry(profile.industry || '');
        setAbout(profile.about || '');
        setDesignation(profile.designation || '');
      }
    }
  }, [profile, user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let res;
      if (user?.role === 'candidate') {
        res = await api.put('/profile/candidate', {
          name, phone, title, bio, skills
        });
      } else {
        res = await api.put('/profile/recruiter', {
          name, phone, companyName, companyWebsite, industry, about, designation
        });
      }
      toast.success('Profile updated successfully!');
      dispatch(updateProfileLocally(res.data.profile));
    } catch (err) {
      toast.error('Failed to update profile.');
    }
    setSaving(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      return toast.error('Only PDF files are supported.');
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploadingResume(true);
    toast.loading('Analyzing resume & extracting skills with AI...', { id: 'parser' });

    try {
      const res = await api.post('/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume parsed and details merged successfully!', { id: 'parser' });
      dispatch(updateProfileLocally(res.data.profile));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resume upload failed.', { id: 'parser' });
    }
    setUploadingResume(false);
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile image updated successfully!');
      dispatch(updateProfileLocally(res.data.profile));
    } catch (err) {
      toast.error('Image upload failed.');
    }
    setUploadingImage(false);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      setNewSkill('');
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="space-y-6">
          
          <Card hoverEffect={false} className="text-center p-6 border border-indigo-500/10">
            <div className="relative w-28 h-28 mx-auto mb-4 group">
              <div className="w-full h-full rounded-full bg-brandIndigo flex items-center justify-center font-bold text-white text-3xl uppercase overflow-hidden shadow-neonIndigo border-2 border-indigo-500/20">
                {profile?.profileImageUrl || profile?.companyLogo ? (
                  <img 
                    src={profile.profileImageUrl || profile.companyLogo} 
                    alt="profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile?.name?.charAt(0) || 'U'
                )}
              </div>
              <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span>Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfileImageUpload} 
                  className="hidden" 
                  disabled={uploadingImage}
                />
              </label>
            </div>

            <h3 className="font-extrabold text-lg">{profile?.name}</h3>
            <p className="text-xs text-slate-400 capitalize mt-1 mb-4">{user?.role} Profile</p>

            {user?.role === 'candidate' && (
              <div className="pt-4 border-t border-indigo-500/5 text-left text-xs space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase">Resume Status</span>
                  <span className={profile?.resumeUrl ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {profile?.resumeUrl ? 'Uploaded' : 'Missing'}
                  </span>
                </div>
                {profile?.resumeUrl && (
                  <a 
                    href={profile.resumeUrl.startsWith('http') ? profile.resumeUrl : `${BACKEND_URL}${profile.resumeUrl}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800 transition-all block text-center"
                  >
                    <FiFileText />
                    <span>View Current Resume</span>
                  </a>
                )}
              </div>
            )}
          </Card>

          {user?.role === 'candidate' && (
            <Card hoverEffect={false} className="border border-indigo-500/10 p-6 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-gradient-cyan pb-2 border-b border-indigo-500/10">
                <FiCpu />
                <span>AI Resume Parsing</span>
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Upload your PDF resume. Our rule-based analyzer will extract skills, experience periods, and education details automatically.
              </p>

              <label className={`flex flex-col items-center justify-center h-32 rounded-xl border border-dashed ${uploadingResume ? 'border-brandIndigo bg-indigo-500/5' : 'border-indigo-500/20 hover:border-brandIndigo/50'} cursor-pointer transition-all`}>
                <div className="flex flex-col items-center text-center p-4">
                  <FiUploadCloud className={`text-3xl mb-2 ${uploadingResume ? 'animate-bounce text-brandIndigo' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold text-slate-300">
                    {uploadingResume ? 'Processing PDF...' : 'Click to Upload Resume'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">PDF format only (Max 5MB)</span>
                </div>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleResumeUpload} 
                  className="hidden" 
                  disabled={uploadingResume}
                />
              </label>
            </Card>
          )}

        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card hoverEffect={false} className="border border-indigo-500/10 p-6">
            <h3 className="text-lg font-bold text-gradient-cyan pb-4 border-b border-indigo-500/10 mb-6">Profile Settings</h3>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Display Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {user?.role === 'candidate' && (
                <>
                  <Input
                    label="Professional Title"
                    name="title"
                    placeholder="e.g. MERN Stack Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bio Description</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full h-24 glass-input dark:bg-slate-900/60 dark:border-indigo-500/10 text-sm p-3"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Skills & Core Tech</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add skill (e.g. Next.js)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-grow glass-input dark:bg-slate-900/60 dark:border-indigo-500/10 text-xs px-3 py-2"
                      />
                      <Button onClick={handleAddSkill} className="py-2.5 px-4"><FiPlus /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {skills.map(s => (
                        <span 
                          key={s} 
                          className="text-xs px-3 py-1 rounded bg-brandIndigo/10 text-slate-200 border border-indigo-500/25 flex items-center gap-1.5"
                        >
                          <span>{s}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSkill(s)} 
                            className="text-red-400 hover:text-red-600 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {user?.role === 'recruiter' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
                      name="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <Input
                      label="Company Website"
                      name="companyWebsite"
                      value={companyWebsite}
                      placeholder="https://example.com"
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Designation / Role"
                      name="designation"
                      placeholder="e.g. Talent Acquisition Lead"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                    />
                    <Input
                      label="Industry Category"
                      name="industry"
                      placeholder="e.g. Software & IT"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">About Company</label>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className="w-full h-24 glass-input dark:bg-slate-900/60 dark:border-indigo-500/10 text-sm p-3"
                    />
                  </div>
                </>
              )}

              <Button type="submit" loading={saving} className="w-full">
                Save Profile Changes
              </Button>

            </form>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;

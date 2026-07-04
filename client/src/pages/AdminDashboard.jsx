import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import api from '../services/api';
import { 
  FiUsers, FiBriefcase, FiFileText, FiSliders, FiLock, FiUnlock, FiPlus 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [skillsWeight, setSkillsWeight] = useState(35);
  const [experienceWeight, setExperienceWeight] = useState(25);
  const [educationWeight, setEducationWeight] = useState(20);
  const [keywordsWeight, setKeywordsWeight] = useState(10);
  const [projCertWeight, setProjCertWeight] = useState(10);
  const [weightsLoading, setWeightsLoading] = useState(false);

  const [newSkill, setNewSkill] = useState('');
  const [skillLoading, setSkillLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {}
    setUsersLoading(false);
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data.analytics || null);
      if (res.data.analytics?.aiWeights) {
        const w = res.data.analytics.aiWeights;
        setSkillsWeight(w.skills);
        setExperienceWeight(w.experience);
        setEducationWeight(w.education);
        setKeywordsWeight(w.keywords);
        setProjCertWeight(w.projectsCertificates || w.projectsCertificates === 0 ? w.projectsCertificates : 10);
      }
    } catch (err) {}
    setAnalyticsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const handleBlockUser = async (id, status) => {
    const isBlock = status === 'active';
    const action = isBlock ? 'block' : 'unblock';
    
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        const url = `/admin/users/${action}/${id}`;
        await api.put(url);
        toast.success(`User successfully ${action}ed!`);
        fetchUsers();
      } catch (err) {
        toast.error(`Failed to ${action} user.`);
      }
    }
  };

  const handleUpdateWeightsSubmit = async (e) => {
    e.preventDefault();
    const sum = skillsWeight + experienceWeight + educationWeight + keywordsWeight + projCertWeight;
    if (sum !== 100) {
      return toast.error(`AI Weights must sum up to exactly 100%. Current sum: ${sum}%`);
    }

    setWeightsLoading(true);
    try {
      await api.put('/admin/settings/weights', {
        skills: skillsWeight,
        experience: experienceWeight,
        education: educationWeight,
        keywords: keywordsWeight,
        projectsCertificates: projCertWeight
      });
      toast.success('AI scoring weights updated successfully!');
      fetchAnalytics();
    } catch (err) {
      toast.error('Failed to update scoring parameters.');
    }
    setWeightsLoading(false);
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setSkillLoading(true);
    try {
      await api.post('/admin/skills', { name: newSkill.trim() });
      toast.success('Technical skill added to predefined seed lists.');
      setNewSkill('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register skill.');
    }
    setSkillLoading(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setCategoryLoading(true);
    try {
      await api.post('/admin/categories', { name: newCategory.trim() });
      toast.success('Hiring category registered successfully.');
      setNewCategory('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register category.');
    }
    setCategoryLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        
        {analyticsLoading ? (
          <div className="text-center text-slate-400 py-6">Aggregating database stats...</div>
        ) : analytics ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hoverEffect={false} className="border border-indigo-500/5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Candidates</p>
                  <p className="text-3xl font-extrabold mt-1">{analytics.totalCandidates}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-brandIndigo"><FiUsers size={20} /></div>
              </div>
            </Card>

            <Card hoverEffect={false} className="border border-indigo-500/5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Recruiters</p>
                  <p className="text-3xl font-extrabold mt-1">{analytics.totalRecruiters}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-brandCyan"><FiUsers size={20} /></div>
              </div>
            </Card>

            <Card hoverEffect={false} className="border border-indigo-500/5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Job Posts</p>
                  <p className="text-3xl font-extrabold mt-1">{analytics.totalJobs}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-brandIndigo"><FiBriefcase size={20} /></div>
              </div>
            </Card>

            <Card hoverEffect={false} className="border border-indigo-500/5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications Submitted</p>
                  <p className="text-3xl font-extrabold mt-1">{analytics.totalApplications}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><FiFileText size={20} /></div>
              </div>
            </Card>
          </div>
        ) : null}

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold text-gradient-cyan">System Users</h3>
            
            {usersLoading ? (
              <div className="text-center text-slate-400 py-12">Loading system users...</div>
            ) : (
              <Table headers={['User Email', 'Name', 'Role', 'Status', 'Actions']}>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/15 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-200">{u.email}</td>
                    <td className="px-6 py-4 text-slate-400">{u.profile?.name || 'N/A'}</td>
                    <td className="px-6 py-4 capitalize text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        u.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                        u.role === 'recruiter' ? 'bg-cyan-500/10 text-brandCyan' :
                        'bg-indigo-500/10 text-brandIndigo'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleBlockUser(u._id, u.status)}
                          className={`p-1.5 rounded transition-all text-xs border ${
                            u.status === 'active' 
                              ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' 
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                          }`}
                          title={u.status === 'active' ? 'Block Login' : 'Activate Login'}
                        >
                          {u.status === 'active' ? <FiLock /> : <FiUnlock />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </div>

          <div className="space-y-8">
            <div className="glass-panel p-6 border border-indigo-500/10 space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2 text-gradient-cyan pb-3 border-b border-indigo-500/10">
                <FiSliders />
                <span>AI Scoring Weights</span>
              </h3>

              <form onSubmit={handleUpdateWeightsSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Skills Matching</span>
                    <span>{skillsWeight}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={skillsWeight}
                    onChange={(e) => setSkillsWeight(parseInt(e.target.value))}
                    className="w-full accent-brandIndigo"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Experience Match</span>
                    <span>{experienceWeight}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={experienceWeight}
                    onChange={(e) => setExperienceWeight(parseInt(e.target.value))}
                    className="w-full accent-brandIndigo"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Education Check</span>
                    <span>{educationWeight}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={educationWeight}
                    onChange={(e) => setEducationWeight(parseInt(e.target.value))}
                    className="w-full accent-brandIndigo"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Resume Keywords density</span>
                    <span>{keywordsWeight}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={keywordsWeight}
                    onChange={(e) => setKeywordsWeight(parseInt(e.target.value))}
                    className="w-full accent-brandIndigo"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Projects & Certificates</span>
                    <span>{projCertWeight}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={projCertWeight}
                    onChange={(e) => setProjCertWeight(parseInt(e.target.value))}
                    className="w-full accent-brandIndigo"
                  />
                </div>

                <div className="text-right text-[10px] text-slate-400 pt-2 border-t border-indigo-500/5">
                  Sum total: <strong className={skillsWeight + experienceWeight + educationWeight + keywordsWeight + projCertWeight === 100 ? 'text-emerald-400' : 'text-red-400'}>
                    {skillsWeight + experienceWeight + educationWeight + keywordsWeight + projCertWeight}%
                  </strong> / 100%
                </div>

                <Button type="submit" loading={weightsLoading} className="w-full py-2">
                  Update AI Engine
                </Button>
              </form>
            </div>

            <div className="glass-panel p-6 border border-indigo-500/10 space-y-4">
              <h3 className="text-sm font-bold text-gradient-cyan pb-2 border-b border-indigo-500/10">Data Settings</h3>
              
              <form onSubmit={handleAddSkill} className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Register Skill</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. AWS Lambda"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-grow glass-input px-3 py-1.5 text-xs focus:border-brandIndigo"
                  />
                  <Button type="submit" loading={skillLoading} className="px-3 py-2"><FiPlus /></Button>
                </div>
              </form>

              <form onSubmit={handleAddCategory} className="space-y-2 pt-2 border-t border-indigo-500/5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Register Category</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Rust Developer"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-grow glass-input px-3 py-1.5 text-xs focus:border-brandIndigo"
                  />
                  <Button type="submit" loading={categoryLoading} className="px-3 py-2"><FiPlus /></Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

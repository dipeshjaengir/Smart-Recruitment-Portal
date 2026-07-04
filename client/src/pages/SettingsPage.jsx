import React, { useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gradient-cyan">Account Security</h2>
          <p className="text-xs text-slate-400">Manage security settings, access credentials, and parameters</p>
        </div>

        <Card hoverEffect={false} className="border border-indigo-500/10 p-6">
          <h3 className="text-sm font-bold text-slate-200 pb-3 border-b border-indigo-500/10 mb-6">Modify Password</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

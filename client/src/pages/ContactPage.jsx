import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { toast } from 'react-hot-toast';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Your message has been received! Our support team will follow up.');
      setName('');
      setEmail('');
      setMsg('');
      setLoading(false);
    }, 800);
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gradient-cyan">Get in Touch</h2>
          <p className="text-slate-400 text-sm mt-2">Have questions about the local AI parser or configurations?</p>
        </div>

        <div className="glass-panel p-8 border border-indigo-500/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Message</label>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
                className="w-full h-32 glass-input dark:bg-slate-900/60 text-sm p-3"
              />
            </div>
            <Button type="submit" loading={loading} className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;

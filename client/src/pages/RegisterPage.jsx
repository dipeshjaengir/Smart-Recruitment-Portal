import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { registerUser, verifyOTPCode, clearAuthError } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FiUser, FiBriefcase, FiMail } from 'react-icons/fi';

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isRegistered, registeredEmail, token, user } = useSelector((state) => state.auth);
  
  const [selectedRole, setSelectedRole] = useState('candidate');
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, selectedRole]);

  useEffect(() => {
    if (token && user) {
      toast.success('Registration and Verification complete!');
      if (user.role === 'recruiter') navigate('/recruiter');
      else navigate('/candidate');
    }
  }, [token, user, navigate]);

  const onRegisterSubmit = async (data) => {
    dispatch(clearAuthError());
    const signUpPayload = {
      email: data.email,
      password: data.password,
      name: data.name,
      role: selectedRole
    };
    
    const resultAction = await dispatch(registerUser(signUpPayload));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Registration successful! Verification code sent.');
    } else {
      toast.error(resultAction.payload || 'Registration failed');
    }
  };

  const onVerifyOTPSubmit = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      return toast.error('OTP code must be exactly 6 digits');
    }

    setOtpLoading(true);
    const resultAction = await dispatch(verifyOTPCode({ email: registeredEmail, otp: otpCode }));
    setOtpLoading(false);

    if (verifyOTPCode.rejected.match(resultAction)) {
      toast.error(resultAction.payload || 'Verification code failed. Try 123456 as master bypass.');
    }
  };

  const passwordVal = watch('password');

  return (
    <MainLayout>
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-brandViolet/5 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md glass-panel p-8 relative z-10 border border-indigo-500/15">
          {!isRegistered ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-gradient">Create Account</h2>
                <p className="text-slate-400 text-xs mt-2">Join our recruitment management system</p>
              </div>

              <div className="flex border border-indigo-500/20 rounded-xl p-1 bg-slate-950/40 mb-6">
                <button
                  type="button"
                  onClick={() => setSelectedRole('candidate')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedRole === 'candidate'
                      ? 'bg-brandIndigo text-white shadow-neonIndigo'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FiUser />
                  <span>Candidate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('recruiter')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedRole === 'recruiter'
                      ? 'bg-brandIndigo text-white shadow-neonIndigo'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FiBriefcase />
                  <span>Recruiter</span>
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-medium mb-4 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder={selectedRole === 'candidate' ? 'John Doe' : 'Recruitment Manager'}
                  register={register}
                  error={errors.name}
                  required="Name is required"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  register={register}
                  error={errors.email}
                  required="Email is required"
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  register={register}
                  error={errors.password}
                  required="Password is required"
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  register={register}
                  error={errors.confirmPassword}
                  required="Please confirm your password"
                  validate={(v) => v === passwordVal || 'Passwords must match'}
                />

                <Button type="submit" loading={loading} className="w-full mt-2">
                  Sign Up
                </Button>
              </form>

              <p className="text-center text-xs text-slate-400 mt-6">
                Already registered?{' '}
                <Link to="/login" className="text-brandIndigo font-semibold hover:underline">Log in</Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mx-auto mb-4 text-brandIndigo text-xl">
                  <FiMail />
                </div>
                <h2 className="text-xl font-bold">Verify Your Email</h2>
                <p className="text-slate-400 text-xs mt-2">
                  Enter the 6-digit verification code sent to <br />
                  <strong className="text-slate-200">{registeredEmail}</strong>
                </p>
              </div>

              <form onSubmit={onVerifyOTPSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Verification Code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-xl font-bold tracking-[8px] py-3 glass-input dark:bg-slate-900 border-indigo-500/20 focus:border-brandIndigo"
                  />
                </div>

                <p className="text-[10px] text-center text-slate-400 italic">
                  * Tip: Use the master code <strong>123456</strong> if testing locally.
                </p>

                <Button type="submit" loading={otpLoading} className="w-full">
                  Verify OTP
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;

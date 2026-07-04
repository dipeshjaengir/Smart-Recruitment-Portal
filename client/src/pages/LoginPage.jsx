import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginUser, verifyOTPCode, clearAuthError } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { loading, error, token, user } = useSelector((state) => state.auth);
  
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(clearAuthError());
    if (searchParams.get('session_expired')) {
      toast.error('Session expired, please sign in again.');
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (token && user) {
      toast.success('Signed in successfully!');
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'recruiter') navigate('/recruiter');
      else navigate('/candidate');
    }
  }, [token, user, navigate]);

  const onLoginSubmit = async (data) => {
    dispatch(clearAuthError());
    const resultAction = await dispatch(loginUser(data));
    
    if (loginUser.fulfilled.match(resultAction)) {
      const payload = resultAction.payload;
      if (payload.success === false && payload.isVerified === false) {
        setUnverifiedEmail(payload.email);
        setNeedsVerification(true);
        toast.error('Your email is not verified yet.');
      }
    } else {
      toast.error(resultAction.payload || 'Failed to authenticate');
    }
  };

  const onVerifyOTPSubmit = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      return toast.error('OTP code must be exactly 6 digits');
    }

    setOtpLoading(true);
    const resultAction = await dispatch(verifyOTPCode({ email: unverifiedEmail, otp: otpCode }));
    setOtpLoading(false);

    if (verifyOTPCode.fulfilled.match(resultAction)) {
      toast.success('Account verified successfully!');
      setNeedsVerification(false);
    } else {
      toast.error(resultAction.payload || 'Verification failed. Use 123456 as master OTP in development.');
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brandIndigo/5 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md glass-panel p-8 relative z-10 border border-indigo-500/15">
          {!needsVerification ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-gradient">Welcome Back</h2>
                <p className="text-slate-400 text-xs mt-2">Sign in to manage your recruitment portal</p>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-medium mb-4 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
                <div className="relative">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    register={register}
                    error={errors.email}
                    required="Email is required"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase">Password</label>
                    <Link to="/forgot-password" className="text-xs text-brandIndigo hover:underline">Forgot?</Link>
                  </div>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    register={register}
                    error={errors.password}
                    required="Password is required"
                  />
                </div>

                <Button type="submit" loading={loading} className="w-full mt-2">
                  Sign In
                </Button>
              </form>

              <p className="text-center text-xs text-slate-400 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-brandIndigo font-semibold hover:underline">Register here</Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center mx-auto mb-4 text-yellow-500 text-xl">
                  <FiMail />
                </div>
                <h2 className="text-xl font-bold">Email Verification</h2>
                <p className="text-slate-400 text-xs mt-2">
                  Enter the 6-digit verification code sent to <br />
                  <strong className="text-slate-200">{unverifiedEmail}</strong>
                </p>
              </div>

              <form onSubmit={onVerifyOTPSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter Code (e.g. 123456)"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-xl font-bold tracking-[8px] py-3 glass-input dark:bg-slate-900 border-indigo-500/20 focus:border-brandIndigo"
                  />
                </div>

                <p className="text-[10px] text-center text-slate-400 italic">
                  * Tip: In local development, you can use <strong>123456</strong> as the bypass code.
                </p>

                <Button type="submit" loading={otpLoading} className="w-full">
                  Verify Code
                </Button>

                <button
                  type="button"
                  onClick={() => setNeedsVerification(false)}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200"
                >
                  Back to Sign In
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;

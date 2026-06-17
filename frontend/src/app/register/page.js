'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import useAuth from '../../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
import { Leaf, User, Mail, Lock, AlertCircle, X, User as UserIcon } from 'lucide-react';

export default function RegisterPage() {
  const { register, verifyRegister, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Simulated Modal state (used if real Client ID is missing)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogle, setCustomGoogle] = useState(false);
  const [gName, setGName] = useState('');
  const [gEmail, setGEmail] = useState('');
  const [gLoading, setGLoading] = useState(false);

  // Security Verification (OTP)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = !!googleClientId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email format validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      setLoading(false);
      return;
    }

    const res = await register(name, email, password);
    if (res.success && res.otpSent) {
      setOtpError('');
      setOtpInput('');
      setShowOtpModal(true);
    } else {
      setError(res.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);

    const res = await verifyRegister(email, otpInput);
    if (res.success) {
      setShowOtpModal(false);
    } else {
      setOtpError(res.message || 'Invalid or expired verification code');
    }
    setOtpLoading(false);
  };

  const handleGoogleSelect = async (name, email) => {
    setGLoading(true);
    setError('');
    const res = await loginWithGoogle(null, name, email); // Passing null token for simulation
    if (res.success) {
      setShowGoogleModal(false);
    } else {
      setError(res.message);
      setShowGoogleModal(false);
    }
    setGLoading(false);
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!gName || !gEmail) return;
    handleGoogleSelect(gName, gEmail);
  };

  const handleRealGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    const res = await loginWithGoogle(credentialResponse.credential);
    if (!res.success) {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {/* Glow Element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-800/20 mb-3">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Join EcoCarbon
          </h1>
          <p className="text-sm text-slate-400 mt-1">Start tracking and offsetting emissions today</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-950/30 border border-rose-800/30 text-rose-400 text-sm px-4 py-3 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="registerName" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" aria-hidden="true" />
              <input
                id="registerName"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="registerEmail" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" aria-hidden="true" />
              <input
                id="registerEmail"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="registerPassword" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" aria-hidden="true" />
              <input
                id="registerPassword"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="registerConfirmPassword" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" aria-hidden="true" />
              <input
                id="registerConfirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/80 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-850" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-2 text-slate-500 font-bold">Or continue with</span>
          </div>
        </div>

        {isGoogleConfigured ? (
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleRealGoogleSuccess}
              onError={() => setError('Google Authentication failed')}
              theme="filled_dark"
              shape="pill"
              text="continue_with"
            />
          </div>
        ) : (
          <button
            onClick={() => setShowGoogleModal(true)}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.6 15.01 1 12 1 7.37 1 3.4 3.67 1.48 7.56l3.89 3.01C6.3 7.56 8.96 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.91 3.41-8.6z"
              />
              <path
                fill="#FBBC05"
                d="M5.37 14.43c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3L1.48 6.82C.54 8.7 0 10.79 0 13c0 2.21.54 4.3 1.48 6.18l3.89-3.75z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.1.74-2.51 1.18-4.26 1.18-3.04 0-5.7-2.52-6.63-5.53L1.48 16.82C3.4 20.33 7.37 23 12 23z"
              />
            </svg>
            Google Auth
          </button>
        )}

        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </div>

      {/* Google Simulated Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => {
                setShowGoogleModal(false);
                setCustomGoogle(false);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.6 15.01 1 12 1 7.37 1 3.4 3.67 1.48 7.56l3.89 3.01C6.3 7.56 8.96 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.91 3.41-8.6z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.37 14.43c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3L1.48 6.82C.54 8.7 0 10.79 0 13c0 2.21.54 4.3 1.48 6.18l3.89-3.75z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.1.74-2.51 1.18-4.26 1.18-3.04 0-5.7-2.52-6.63-5.53L1.48 16.82C3.4 20.33 7.37 23 12 23z"
                />
              </svg>
              <h3 className="text-base font-bold text-slate-200">Sign in with Google</h3>
              <p className="text-xs text-slate-500">to continue to EcoCarbon</p>
            </div>

            {gLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : customGoogle ? (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Google Profile Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Google Citizen"
                    value={gName}
                    onChange={(e) => setGName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Google Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. user@gmail.com"
                    value={gEmail}
                    onChange={(e) => setGEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomGoogle(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl"
                  >
                    Authorize
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleGoogleSelect('Google Citizen', 'google.citizen@gmail.com')}
                  className="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-850 rounded-xl text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-650/30 border border-emerald-800/40 text-emerald-400 rounded-full flex items-center justify-center font-bold text-sm">
                      GC
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Google Citizen</p>
                      <p className="text-[10px] text-slate-500">google.citizen@gmail.com</p>
                    </div>
                  </div>
                  <UserIcon className="w-4 h-4 text-slate-650" />
                </button>

                <button
                  onClick={() => handleGoogleSelect('Ava Sterling', 'ava.sterling@gmail.com')}
                  className="w-full flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-850 rounded-xl text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-teal-650/30 border border-teal-800/40 text-teal-400 rounded-full flex items-center justify-center font-bold text-sm">
                      AS
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Ava Sterling</p>
                      <p className="text-[10px] text-slate-500">ava.sterling@gmail.com</p>
                    </div>
                  </div>
                  <UserIcon className="w-4 h-4 text-slate-650" />
                </button>

                <button
                  onClick={() => setCustomGoogle(true)}
                  className="w-full py-2.5 text-center text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline border border-dashed border-emerald-950 rounded-xl"
                >
                  Use another account
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
              aria-label="Close verification modal"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="text-center space-y-1">
              <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-800/20 mb-3 mx-auto w-fit">
                <Lock className="w-6 h-6 text-emerald-400" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-200">Security Verification</h3>
              <p className="text-xs text-slate-400">We sent a 6-digit verification code to:</p>
              <p className="text-xs text-emerald-400 font-semibold">{email}</p>
              <p className="text-[11px] text-slate-500 mt-2">Please check your email inbox (including spam folder) for the verification code.</p>
            </div>

            {otpError && (
              <div className="flex items-center gap-2 bg-rose-950/30 border border-rose-800/30 text-rose-400 text-xs px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="registerOtpCode" className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Enter Verification Code</label>
                <input
                  id="registerOtpCode"
                  type="text"
                  maxLength="6"
                  placeholder="e.g. 123456"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-center font-bold tracking-widest text-lg focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50"
              >
                {otpLoading ? 'Verifying...' : 'Verify & Register'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

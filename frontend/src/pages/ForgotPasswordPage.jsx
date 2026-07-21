import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiKey, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { authService } from '../services/auth.service';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  // Step 1: Send Verification Code
  const onSendCode = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      setStep(2);
      toast.success('Verification code sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Code
  const onVerifyCode = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyResetCode(email, data.code);
      setTempToken(response.tempToken);
      setStep(3);
      toast.success('Code verified successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid or expired code');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const onResetPassword = async (data) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(tempToken, data.password);
      setStep(4);
      toast.success('counting 7 sec live and redirecting to the login page');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Countdown Effect
  useEffect(() => {
    if (step === 4) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/auth/login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, navigate]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto mt-10">
      <Link to="/auth/login" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 text-sm transition">
        <FiArrowLeft className="mr-2" /> Back to Login
      </Link>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {step === 1 && 'Forgot Password'}
          {step === 2 && 'Verify Code'}
          {step === 3 && 'New Password'}
          {step === 4 && 'Password Updated'}
        </h2>
        <p className="text-gray-600 mt-2">
          {step === 1 && "Enter your email to receive a verification code."}
          {step === 2 && `Enter the 6-character code sent to ${email}`}
          {step === 3 && "Create a new strong password."}
          {step === 4 && "Your password has been changed successfully!"}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit(onSendCode)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                {...register('email', { required: 'Email is required' })} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="you@example.com" 
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onVerifyCode)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
            <div className="relative">
              <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                {...register('code', { required: 'Code is required' })} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono tracking-widest uppercase" 
                placeholder="A1B2C3" 
                maxLength={6}
              />
            </div>
            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start gap-3">
            <FiAlertCircle className="text-yellow-600 mt-1 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Code not received?</p>
              <p>Please check your spam folder or contact our support admin at:</p>
              <a href="mailto:supportcollegediscovery@gmail.com" className="text-blue-600 font-medium hover:underline block mt-1">supportcollegediscovery@gmail.com</a>
            </div>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit(onResetPassword)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="••••••••" 
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                {...register('confirmPassword', { 
                  required: 'Confirm Password is required',
                  validate: value => value === password || 'Passwords do not match'
                })} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="••••••••" 
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

      {step === 4 && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-600 mb-6">Your password has been changed securely.</p>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">Redirecting to login in...</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{countdown}s</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;

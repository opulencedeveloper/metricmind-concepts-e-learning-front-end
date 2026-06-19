'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useHttp } from '@/hooks/useHttp';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import Alert from '@/components/ui/Alert';
import Input from '@/components/form/Input';
import { AlertType } from '@/types/ui';
import { HttpMethod } from '@/types/http';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { getAuthStudent } from '@/lib/utils/auth';

interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  status?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { isLoading, sendHttpRequest } = useHttp();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Profile form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const student = getAuthStudent();
    if (student) {
      setProfile(student);
      setFullName(student.fullName);
      setEmail(student.email);
      setLoading(false);
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.PUT,
        url: '/student/profile',
        body: { fullName, email },
        isAuth: true,
      },
      successRes: (data: any) => {
        setProfile(data.student);
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to update profile');
      },
    });
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: '/student/change-password',
        body: { currentPassword, newPassword },
        isAuth: true,
      },
      successRes: () => {
        setSuccessMessage('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to change password');
      },
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && !successMessage) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={() => setError('')} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">Settings</h1>
        <p className="text-lg text-gray-600 mt-3 max-w-2xl">Manage your account and preferences</p>
      </motion.div>

      {/* Success Alert */}
      {successMessage && (
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8 mb-6">
          <Alert type={AlertType.Success} message={successMessage} dismissible />
        </motion.div>
      )}

      {/* Settings Container */}
      <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0 ${
                    activeTab === 'profile'
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-100 last:border-b-0 ${
                    activeTab === 'password'
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Password
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Full Name */}
                  <Input
                    type="text"
                    label="Full Name"
                    icon={User}
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="flex-1 bg-transparent text-gray-600 text-sm focus:outline-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Email cannot be changed. Contact support if you need to update it.
                    </p>
                  </div>

                  {/* Member Since */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <div className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-600">
                        {profile && new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gray-900 text-white font-semibold rounded-xl px-6 py-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                      {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  {/* Current Password */}
                  <Input
                    type="password"
                    label="Current Password"
                    icon={Lock}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />

                  {/* New Password */}
                  <Input
                    type="password"
                    label="New Password"
                    icon={Lock}
                    placeholder="Enter new password (min 8 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  {/* Confirm Password */}
                  <Input
                    type="password"
                    label="Confirm Password"
                    icon={Lock}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  {/* Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gray-900 text-white font-semibold rounded-xl px-6 py-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? 'Updating...' : 'Change Password'}
                      {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="h-12" />
    </motion.div>
  );
}

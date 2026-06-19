'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import Alert from '@/components/ui/Alert';
import { ButtonVariant, AlertType } from '@/types/ui';
import { clearAuth } from '@/lib/utils/auth';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'MetricMind',
    siteDescription: 'Online Learning Platform',
    contactEmail: 'support@metricmind.com',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    setIsSaving(true);

    setTimeout(() => {
      setSuccess('Settings saved successfully');
      setIsSaving(false);
    }, 800);
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage admin account and platform settings</p>
      </div>

      {error && <Alert type={AlertType.Error} message={error} dismissible />}
      {success && <Alert type={AlertType.Success} message={success} dismissible />}

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Settings</h2>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <Input
            label="Site Name"
            name="siteName"
            value={settings.siteName}
            onChange={handleInputChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
            <textarea
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>

          <Input
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={settings.contactEmail}
            onChange={handleInputChange}
          />

          <Button
            type="submit"
            variant={ButtonVariant.Primary}
            disabled={isSaving}
            isLoading={isSaving}
          >
            Save Settings
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
        <Button
          variant={ButtonVariant.Primary}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Card>
    </div>
  );
}

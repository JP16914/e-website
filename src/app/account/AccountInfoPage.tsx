
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { User, Mail, Shield, Key, ChevronRight, Settings, Bell, Lock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AccountInfoPage() {
  const { user } = useAuthStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: '', success: '' });

  if (!user) return <div className="p-12 text-center font-medium">Please sign in to view your account.</div>;

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: '', success: '' });

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      return setPasswordStatus({ loading: false, error: 'New passwords do not match', success: '' });
    }

    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setPasswordStatus({ loading: false, error: '', success: 'Password updated successfully!' });
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err: any) {
      setPasswordStatus({ loading: false, error: err.response?.data?.message || 'Failed to update password', success: '' });
    }
  };

  return (
    <div className="container max-w-4xl py-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-6 mb-12 bg-white p-8 rounded-2xl border shadow-sm">
        <Avatar className="h-24 w-24 ring-4 ring-muted shadow-lg">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
          <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{user.firstName} {user.lastName}</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Mail className="h-4 w-4" /> {user.email}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { icon: User, label: 'Profile Info', active: true },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Lock, label: 'Security', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${item.active ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted'}`}>
              <item.icon className="h-5 w-5" />
              <span className="font-semibold">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" /> General Information
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">First Name</label>
                  <Input value={user.firstName} readOnly className="bg-muted/30 font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Last Name</label>
                  <Input value={user.lastName} readOnly className="bg-muted/30 font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <Input value={user.email} readOnly className="bg-muted/30 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Account Role</label>
                <div className="flex items-center gap-2 text-sm font-bold bg-muted w-fit px-3 py-1 rounded-full text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" /> {user.role}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" /> Security Settings
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Manage your account password and security preferences here.</p>

            <Button
              onClick={() => setShowPasswordModal(true)}
              className="rounded-full px-8 font-bold bg-primary hover:shadow-lg transition-all"
            >
              Reset Password
            </Button>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b bg-muted/20">
              <h2 className="text-2xl font-black">Reset Password</h2>
              <p className="text-sm text-muted-foreground mt-1">Enter your details to change the password.</p>
            </div>

            <form onSubmit={handlePasswordReset} className="p-8 space-y-4">
              {passwordStatus.error && (
                <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl font-medium border border-destructive/20 text-center">
                  {passwordStatus.error}
                </div>
              )}
              {passwordStatus.success && (
                <div className="bg-green-100 text-green-700 text-sm p-4 rounded-xl font-medium border border-green-200 text-center">
                  {passwordStatus.success}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Current Password</label>
                <Input name="currentPassword" type="password" required className="rounded-xl h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">New Password</label>
                <Input name="newPassword" type="password" required className="rounded-xl h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Confirm New Password</label>
                <Input name="confirmPassword" type="password" required className="rounded-xl h-11" />
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 rounded-full font-bold h-11"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-full font-bold h-11 shadow-lg shadow-primary/20"
                  disabled={passwordStatus.loading}
                >
                  {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

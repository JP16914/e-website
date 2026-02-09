'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

const schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await api.post('/auth/signup', data);
      alert('Account successfully created! Please sign in to continue.');
      router.push('/auth/login');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Registration failed. Email might be in use.');
    }
  };

  return (
    <div className="container max-w-sm py-24 flex flex-col justify-center animate-in fade-in slide-in-from-bottom duration-500">
      <div className="border p-8 rounded-lg shadow-sm bg-card">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">First Name</label>
              <Input {...register('firstName')} className={errors.firstName ? "border-destructive" : ""} />
              {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Last Name</label>
              <Input {...register('lastName')} className={errors.lastName ? "border-destructive" : ""} />
              {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="name@example.com" {...register('email')} className={errors.email ? "border-destructive" : ""} />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" placeholder="At least 6 characters" {...register('password')} className={errors.password ? "border-destructive" : ""} />
            {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input type="password" {...register('confirmPassword')} className={errors.confirmPassword ? "border-destructive" : ""} />
            {errors.confirmPassword && <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    try {
      await login(data);
      // Merge guest cart if needed
      try {
        await api.post('/cart/merge-guest');
        // Refresh cart in store after merge
        await useCartStore.getState().fetchCart(true);
      } catch (e) {
        console.error("Cart merge failed", e);
      }

      const returnTo = searchParams.get('return_to') || '/';
      router.push(returnTo);
    } catch (e: any) {
      if (e.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="container max-w-sm py-24 flex flex-col justify-center animate-in fade-in slide-in-from-bottom duration-500">
      <div className="border p-8 rounded-lg shadow-sm bg-card">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
            </div>
            <Input
              type="password"
              placeholder="••••••"
              {...register('password')}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">New customer? </span>
          <Link href="/auth/signup" className="text-primary font-medium hover:underline">Create account</Link>
        </div>
      </div>
    </div>
  );
}

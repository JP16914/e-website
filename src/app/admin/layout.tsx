'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, ShoppingBag, Package, BarChart } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) return <div className="flex h-screen items-center justify-center">Loading Admin Panel...</div>;

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/orders', label: 'Orders', icon: Package },
    { href: '/admin/inventory', label: 'Inventory', icon: BarChart },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r bg-muted/10 hidden md:block shrink-0">
        <div className="p-6 font-bold text-xl border-b flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          Admin Panel
        </div>
        <nav className="p-4 space-y-1">
          {links.map(l => {
            const isActive = pathname === l.href;
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all font-medium ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <Icon className="h-5 w-5" />
                {l.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto bg-muted/5">
        {children}
      </main>
    </div>
  );
}

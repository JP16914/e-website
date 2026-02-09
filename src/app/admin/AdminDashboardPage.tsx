'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, DollarSign, ShoppingCart, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatCard = ({ title, value, icon: Icon, description, loading }: any) => (
  <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="p-6 pt-0">
      {loading ? <div className="h-8 w-24 bg-muted animate-pulse rounded" /> : <div className="text-2xl font-bold">{value}</div>}
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats({ users: 120, orders: 45, revenue: 12500, lowStock: 3 });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${(stats.revenue / 100).toFixed(2)}`}
          icon={DollarSign}
          description="+20.1% from last month"
          loading={loading}
        />
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          description="+180 new users"
          loading={loading}
        />
        <StatCard
          title="Active Orders"
          value={stats.orders}
          icon={ShoppingCart}
          description="+12 since last hour"
          loading={loading}
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStock}
          icon={AlertCircle}
          description="Requires attention"
          loading={loading}
        />
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold leading-none tracking-tight">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">Recent transactions from your store.</p>
        </div>
        <div className="p-6 pt-0">
          <p className="text-sm text-muted-foreground">No recent orders configured in this view.</p>
        </div>
      </div>
    </div>
  );
}

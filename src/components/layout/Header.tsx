
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingCart, User as UserIcon, LogOut, Settings, CreditCard, UserCircle, ChevronRight, HelpCircle, Moon, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuthStore();
  const { count, fetchCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Hide search on specific pages
  const isAuthPage = pathname?.startsWith('/auth');
  const isCartPage = pathname === '/cart';
  const hideSearch = isAuthPage || isCartPage;

  useEffect(() => {
    fetchCart(!!user);
  }, [user, fetchCart]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || user.email[0].toUpperCase() : '';
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            E
          </div>
          <span className="hidden sm:inline-block tracking-tight">ShopMega</span>
        </Link>

        {/* Search Bar */}
        {!hideSearch && (
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground rounded-full"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </form>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer relative group">
                  <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-muted transition-all">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-background rounded-full border-2 border-background flex items-center justify-center">
                    <div className="h-full w-full bg-green-500 rounded-full" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[320px] p-2 mt-2 shadow-2xl rounded-xl border-muted">
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <Link href="/account" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-base font-bold leading-none">{fullName}</p>
                        <p className="text-xs text-muted-foreground mt-1">See your profile</p>
                      </div>
                    </Link>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2" />

                <div className="py-1">
                  <DropdownMenuItem onClick={() => router.push('/account')} className="flex items-center justify-between p-3 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <Settings className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">Settings & privacy</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center justify-between p-3 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">Help & support</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center justify-between p-3 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <Moon className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">Display & accessibility</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center justify-between p-3 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <span className="font-semibold">Give feedback</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="mx-2" />

                <DropdownMenuItem onClick={logout} className="p-3 rounded-lg cursor-pointer focus:bg-destructive/10 group">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-full group-focus:bg-destructive/20 transition-colors">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <span className="font-semibold group-focus:text-destructive">Log Out</span>
                  </div>
                </DropdownMenuItem>

                <p className="text-[10px] text-muted-foreground p-3 leading-relaxed">
                  Privacy  ·  Terms  ·  Advertising  ·  Ad Choices ·  Cookies  ·  More  ·  ShopMega © 2026
                </p>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push('/auth/login')} className="font-medium">
                Login
              </Button>
              <Button size="sm" onClick={() => router.push('/auth/signup')} className="font-medium px-6 rounded-full">
                Sign Up
              </Button>
            </div>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative h-10 w-10 bg-muted/40 rounded-full hover:bg-muted transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-background">
                  {count}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

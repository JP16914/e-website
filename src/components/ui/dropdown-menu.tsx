'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

// Simplified DropdownMenu to avoid Radix dependency issues in this setup
// In a real app, I would use @radix-ui/react-dropdown-menu

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="relative inline-block text-left" onMouseLeave={() => setIsOpen(false)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // @ts-ignore
          return React.cloneElement(child, { isOpen, setIsOpen });
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, asChild, isOpen, setIsOpen, className }: any) => {
  return (
    <div onClick={() => setIsOpen(!isOpen)} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ children, isOpen, align = 'center', className }: any) => {
  if (!isOpen) return null;
  return (
    <div className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      align === 'end' ? 'right-0' : 'left-0',
      "mt-2",
      className
    )}>
      {children}
    </div>
  );
}

export const DropdownMenuItem = ({ children, onClick, className }: any) => {
  return (
    <div
      className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export const DropdownMenuLabel = ({ children, className }: any) => <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>{children}</div>
export const DropdownMenuSeparator = ({ className }: any) => <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />

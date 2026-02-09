
'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

export const Avatar = ({ children, className }: any) => (
  <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
    {children}
  </div>
)

export const AvatarImage = ({ src, className, alt }: any) => (
  <img src={src} alt={alt} className={cn("aspect-square h-full w-full", className)} />
)

export const AvatarFallback = ({ children, className }: any) => (
  <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}>
    {children}
  </div>
)

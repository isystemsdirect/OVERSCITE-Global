'use client';

import React from 'react';
import AppShell from '@/components/app-shell';
import { useAuthStore } from '@/lib/auth/auth-service';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  
  return (
    <>
      {children}
    </>
  );
}

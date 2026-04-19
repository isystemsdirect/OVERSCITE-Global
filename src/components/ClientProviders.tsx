'use client';

import { SplashProvider } from '@/context/SplashContext';
// @ts-ignore
import { LayoutProvider } from '../context/LayoutContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <SplashProvider>
        {children}
      </SplashProvider>
    </LayoutProvider>
  );
}
 

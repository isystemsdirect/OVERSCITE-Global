'use client';

import { cn } from "@/lib/utils";
import LogoSvg from '../../public/logo.svg';
import styles from './logo.module.css';

export default function Logo({ 
  className,
  isLoginPage = false,
  isCollapsed = false,
  disableMask = false,
}: { 
  className?: string; 
  isLoginPage?: boolean;
  isCollapsed?: boolean;
  disableMask?: boolean;
}) {
  // Adjusted sizes for better layout
  const width = isLoginPage ? 300 : (isCollapsed ? 48 : 180);
  const height = isLoginPage ? 300 : (isCollapsed ? 48 : 180);

  return (
    <div className={cn("flex flex-col items-center justify-center select-none group w-full", className)}>
      <div 
        className={cn("relative traveling-glow-container flex items-center justify-center")}
        style={{ width, height }}
      >
        <LogoSvg 
          width={width}
          height={height} 
          className="relative z-10 w-full h-full object-contain text-[#FFC107] fill-current"
          style={{ color: '#FFC107' }}
        />
      </div>
      {!isCollapsed && (
        <span className={cn(
            "tracking-[0.5em] font-medium uppercase text-[#FFC107] mt-2 text-center",
            isLoginPage ? "text-xl mt-4" : "text-xs"
        )}>
          G L O B A L
        </span>
      )}
    </div>
  );
}

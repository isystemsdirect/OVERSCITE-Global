'use client';

import { cn } from "@/lib/utils";
import LogoSvg from '../../public/Pb_SCINGULAR_Logo_White.svg';
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
        className={cn("relative flex items-center justify-center")}
        style={{ width, height }}
      >
        {typeof LogoSvg === 'function' ? (
          <LogoSvg 
            width={width}
            height={height} 
            className="relative z-10 w-full h-full object-contain text-foreground fill-current"
          />
        ) : (
          <img 
            src={(LogoSvg as any)?.src || LogoSvg} 
            width={width}
            height={height}
            alt="SCINGULAR Logo"
            className="relative z-10 w-full h-full object-contain brightness-200"
          />
        )}
      </div>
      {!isCollapsed && (
        <span className={cn(
            "tracking-[0.5em] font-light uppercase text-muted-foreground mt-2 text-center",
            isLoginPage ? "text-xl mt-4" : "text-[10px]"
        )}>
          S O V E R E I G N
        </span>
      )}
    </div>
  );
}

import React from 'react';
import { 
  Folder, Settings, Book, Shield, Camera, Radio, Network, 
  LayoutGrid, FileText, ArrowLeftRight, PackageOpen, Archive, 
  Wrench, Zap, User, FileImage, FileVideo, FileClock, AlertCircle, File
} from 'lucide-react';
import { CanonicalRoot, NodeKind } from '@/lib/types/repository';

interface RepoIconProps {
  canonicalClass: CanonicalRoot | string;
  kind: NodeKind;
  size?: number;
  className?: string;
  isOpen?: boolean;
}

export function RepoIconBuilder({ canonicalClass, kind, size = 16, className, isOpen }: RepoIconProps) {
  // Common style overlays for hybrid icons
  const iconBase = "text-muted-foreground";

  if (kind === 'file') {
    // Resolve File Treatment
    if (canonicalClass.includes('Images') || canonicalClass.includes('.jpg')) return <FileImage size={size} className={className || iconBase} />;
    if (canonicalClass.includes('Video')) return <FileVideo size={size} className={className || iconBase} />;
    if (canonicalClass.includes('Audit')) return <FileClock size={size} className={className || "text-amber-500/70"} />;
    if (canonicalClass.includes('Error')) return <AlertCircle size={size} className={className || "text-red-500/70"} />;
    // Generic fallback for sg* or unknown types
    return <File size={size} className={className || iconBase} />;
  }

  // Resolve Folder / Root Treatment
  const rootType = canonicalClass.split('.')[0] as CanonicalRoot;
  
  // Base overlay configurations
  const resolveDomainIcon = () => {
    switch (rootType) {
      case CanonicalRoot.System: return <Settings size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-zinc-300 bg-background rounded-full" />;
      case CanonicalRoot.Audit: return <Book size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-amber-500 bg-background rounded-full" />;
      case CanonicalRoot.Evidence: return <Shield size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-emerald-500 bg-background rounded-full" />;
      case CanonicalRoot.CaptureSessions: return <Camera size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-blue-400 bg-background rounded-full" />;
      case CanonicalRoot.Sensors: return <Radio size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-cyan-400 bg-background rounded-full" />;
      case CanonicalRoot.Devices: return <Network size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-indigo-400 bg-background rounded-full" />;
      case CanonicalRoot.Analysis: return <LayoutGrid size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-fuchsia-400 bg-background rounded-full" />;
      case CanonicalRoot.Reports: return <FileText size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-primary bg-background rounded-full" />;
      case CanonicalRoot.Sync: return <ArrowLeftRight size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-sky-400 bg-background rounded-full" />;
      case CanonicalRoot.Exports: return <PackageOpen size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-purple-400 bg-background rounded-full" />;
      case CanonicalRoot.Archives: return <Archive size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-stone-400 bg-background rounded-full" />;
      case CanonicalRoot.Recovery: return <Wrench size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-rose-500 bg-background rounded-full" />;
      case CanonicalRoot.Temp: return <Zap size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-yellow-500 bg-background rounded-full" />;
      case CanonicalRoot.UserSpace: return <User size={size * 0.5} className="absolute bottom-[-1px] right-[-1px] text-zinc-400 bg-background rounded-full" />;
      default: return null;
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <Folder 
        size={size} 
        className={className || (isOpen ? "text-primary/70 fill-primary/10" : "text-muted-foreground")} 
      />
      {resolveDomainIcon()}
    </div>
  );
}

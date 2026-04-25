'use client';

import { useState, useEffect } from 'react';
import { Rss, Hash, AlertTriangle, TrafficCone, Newspaper, Clock, Calendar } from 'lucide-react';
import { mockNotifications as staticNotifications } from '@/lib/data';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type Notification = typeof staticNotifications[0];
type TimeFormat = '12h' | '24h';

const typeInfo = {
    post: { icon: Rss, label: 'New Post', href: '/social', className: 'bg-blue-500/20 text-blue-300 border-blue-500/50' },
    topic: { icon: Hash, label: 'Trending', href: '/topics', className: 'bg-purple-500/20 text-purple-300 border-purple-500/50' },
    safety: { icon: AlertTriangle, label: 'Safety Alert', href: '/dashboard', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' },
    traffic: { icon: TrafficCone, label: 'Traffic Alert', href: '/maps-weather', className: 'bg-orange-500/20 text-orange-300 border-orange-500/50' },
    weather_news: { icon: Newspaper, label: 'Weather News', href: '/weather', className: 'bg-sky-500/20 text-sky-300 border-sky-500/50' },
}

export function FlashNotificationBar() {
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const [showTime, setShowTime] = useState(true);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('12h');

  // Filter out direct weather notifications that required fetching, keep others
  const notifications = staticNotifications.filter(n => n.type !== 'weather');

  useEffect(() => {
    setNow(new Date());

    const handleStorageChange = () => {
        const newFormat = localStorage.getItem('time-format-24h') === 'true' ? '24h' : '12h';
        if (newFormat === '24h' || newFormat === '12h') {
             setTimeFormat(newFormat);
        }
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);

    const timeInterval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    
    // Toggle between time and date every 4 seconds
    const toggleInterval = setInterval(() => {
        setShowTime(prev => !prev);
    }, 4000);

    return () => {
        clearInterval(timeInterval);
        clearInterval(toggleInterval);
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;
    
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % notifications.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  if (notifications.length === 0) {
    return null;
  }

  const notification = notifications[index];
  if (!notification) return null;

  const info = typeInfo[notification.type as keyof typeof typeInfo] || { icon: Rss, label: 'Notification', href: '#', className: '' };
  const Icon = info.icon;

  const formatTime = (date: Date) => {
    if (timeFormat === '24h') {
        return format(date, 'HH:mm:ss');
    }
    return format(date, 'hh:mm:ss a');
  };

  return (
    // Pinned intelligence header
    <div className="sticky top-16 z-20 w-full bg-black/20 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="mx-auto flex h-14 max-w-full items-center justify-between px-4 lg:px-6">

            {/* Notification Stream */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 min-w-0"
                >
                <Link href={info.href} className="flex items-center gap-3 w-full group">
                        <Badge variant="outline" className={cn("gap-2 transition-all group-hover:bg-opacity-30", info.className)}>
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{info.label}</span>
                        </Badge>
                        <p className="text-sm text-muted-foreground truncate group-hover:text-foreground transition-colors">
                            <span className="font-semibold text-foreground mr-2">{notification.title}:</span>
                            <span className="hidden md:inline">{notification.description}</span>
                        </p>
                </Link>
                </motion.div>
            </AnimatePresence>
            
            {/* Clock / Date Integration */}
            <div className="ml-4 pl-4 border-l border-border/50 flex items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={showTime ? 'time' : 'date'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 text-sm font-mono w-[120px] justify-end"
                    >
                        {now ? (
                            showTime ? (
                                <>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-foreground font-semibold">{formatTime(now)}</span>
                                </>
                            ) : (
                                <>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-foreground font-semibold">{format(now, 'MM/dd/yyyy')}</span>
                                </>
                            )
                        ) : (
                           <div className="h-5 w-24 bg-muted/50 rounded-md animate-pulse" />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
}
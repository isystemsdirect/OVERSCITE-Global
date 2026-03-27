'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function BackgroundSlideshow() {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Authority: ScingGPT - Always pull from canonical public registry
    fetch('/background-images.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            setImages(data);
        }
      })
      .catch(err => console.error("ScingGPT: Background Registry Failure", err));
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // 10s for stability
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return <div className="fixed inset-0 bg-zinc-950 -z-20" />;

  return (
    <div className="background-slideshow fixed inset-0 w-screen h-screen -z-10 overflow-hidden bg-zinc-950">
      {images.map((url, i) => (
         <div
          key={url}
          className={cn(
            "absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-[3000ms] ease-in-out",
            i === index ? 'opacity-100' : 'opacity-0'
          )}
        >
             <div 
                className="absolute inset-0 w-full h-full animate-kenburns" 
                style={{ 
                    backgroundImage: `url(${url})`, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }} 
            />
        </div>
      ))}
      <div className="background-overlay absolute inset-0 bg-black/20 backdrop-blur-[1px] z-0"></div>
    </div>
  );
}

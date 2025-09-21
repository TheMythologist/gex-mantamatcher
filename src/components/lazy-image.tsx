import { useState, useRef, useEffect } from 'react';
import { cn } from '../utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function LazyImage({ src, alt, className }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            'transition-opacity duration-200',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <div className={`${className} bg-gray-200 animate-pulse min-h-[100px] w-full`} />
      )}
    </div>
  );
}

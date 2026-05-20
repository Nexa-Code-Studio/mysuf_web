"use client";

import { useEffect, useState, useRef } from "react";

export function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
          
          let startTime: number;
          let animationFrame: number;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - percentage, 4);
            
            setCount(Math.floor(easeOut * value));

            if (progress < duration) {
              animationFrame = requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          animationFrame = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString('en-US')}</span>;
}

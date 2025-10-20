'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export function useScrollHeader(threshold = 100) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('up');
  const ticking = useRef(false);
  const lastUpdate = useRef(Date.now());

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const now = Date.now();
    
    // Chỉ xử lý sau mỗi 16ms (tương đương ~60fps)
    if (now - lastUpdate.current < 16) {
      return;
    }

    if (!ticking.current) {
      requestAnimationFrame(() => {
        const delta = currentScrollY - lastScrollY.current;
        const newDirection = delta > 0 ? 'down' : 'up';

        // Luôn hiện header khi scroll lên hoặc ở gần đầu trang
        if (newDirection === 'up' || currentScrollY < threshold) {
          setShowHeader(true);
        } 
        // Ẩn header khi scroll xuống và đã scroll đủ xa
        else if (newDirection === 'down' && currentScrollY > threshold && Math.abs(delta) > 10) {
          setShowHeader(false);
        }

        scrollDirection.current = newDirection;
        lastScrollY.current = currentScrollY;
        ticking.current = false;
        lastUpdate.current = now;
      });

      ticking.current = true;
    }
  }, [threshold]);

  useEffect(() => {
    // Luôn hiện header khi component mount
    setShowHeader(true);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Reset header khi resize window
    const onResize = () => {
      if (window.scrollY < threshold) {
        setShowHeader(true);
      }
    };
    
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [handleScroll, threshold]);

  return showHeader;
}

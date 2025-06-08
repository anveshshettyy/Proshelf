import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScrollWrapper({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      smooth: true,
    });

    function raf(time) {
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenisRef.current.destroy();
  }, []);

  return (
    <div data-scroll-container>
      {children}
    </div>
  );
}

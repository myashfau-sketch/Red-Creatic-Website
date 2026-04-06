'use client';

import { useEffect } from 'react';

const ScrollToTopOnMount = () => {
  useEffect(() => {
    const scrollToTop = () => window.scrollTo(0, 0);

    scrollToTop();
    const rafId = window.requestAnimationFrame(scrollToTop);
    const timeoutId = window.setTimeout(scrollToTop, 300);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
};

export default ScrollToTopOnMount;

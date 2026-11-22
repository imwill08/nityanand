'use client';
import { useEffect, useState, type ReactNode } from 'react';
import Hero from './Hero';
import Menu from './Menu';
import CustomCursor from './CustomCursor';
import { useScrollEffects } from '@/hooks/useScrollEffects';

/** Client wrapper: owns the fullscreen menu state and runs the scroll effects. */
export default function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useScrollEffects();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <CustomCursor />
      <Menu open={open} onClose={() => setOpen(false)} />
      <div className="wrap">
        <div className="sheet">
          <Hero onMenu={() => setOpen(true)} expanded={open} />
          {children}
        </div>
      </div>
    </>
  );
}

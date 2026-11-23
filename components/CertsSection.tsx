'use client';
import { useEffect, useRef, useState } from 'react';
import { certs, type CertItem } from '@/lib/data';
import { CertIcon } from './Icons';

export function CertsList() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastIndex, setLastIndex] = useState<number>(0);
  const [modalCert, setModalCert] = useState<CertItem | null>(null);

  const pvRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const posRef = useRef({ curX: 0, curY: 0, px: 0, py: 0, initialized: false });

  useEffect(() => {
    activeRef.current = hoveredIndex !== null;
  }, [hoveredIndex]);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      const s = posRef.current;
      s.curX = e.clientX;
      s.curY = e.clientY;
      if (!s.initialized) {
        s.px = e.clientX;
        s.py = e.clientY;
        s.initialized = true;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      const pv = pvRef.current;
      const s = posRef.current;
      if (!pv || !s.initialized) return;

      const ease = reduce ? 1 : 0.14;
      s.px += (s.curX - s.px) * ease;
      s.py += (s.curY - s.py) * ease;

      const cardW = pv.offsetWidth || 340;
      const cardH = pv.offsetHeight || 280;
      const pad = 16;

      // Place to the right of cursor by default; flip left if near right viewport edge
      let x = s.px + 28;
      if (x + cardW + pad > window.innerWidth) {
        x = Math.max(pad, s.px - cardW - 28);
      }

      // Vertically center near cursor, clamped within viewport
      let y = s.py - cardH * 0.52;
      y = Math.max(pad, Math.min(window.innerHeight - cardH - pad, y));

      const vx = s.curX - s.px;
      const rot = reduce ? 0 : Math.max(-11, Math.min(11, vx * 0.1));

      pv.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Close lightbox modal on Escape & lock background scroll while open
  useEffect(() => {
    if (!modalCert) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalCert(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [modalCert]);

  const displayed = certs[hoveredIndex ?? lastIndex];

  return (
    <>
      <div
        className="grid2"
        style={{ marginTop: 36 }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {certs.map((c, idx) => (
          <div
            className="cert rv"
            key={c.title}
            role="button"
            tabIndex={0}
            aria-label={`Preview ${c.title} certificate`}
            onMouseEnter={(e) => {
              const s = posRef.current;
              s.curX = e.clientX;
              s.curY = e.clientY;
              if (!s.initialized) {
                s.px = e.clientX;
                s.py = e.clientY;
                s.initialized = true;
              }
              setLastIndex(idx);
              setHoveredIndex(idx);
            }}
            onMouseLeave={() => setHoveredIndex((curr) => (curr === idx ? null : curr))}
            onClick={() => setModalCert(c)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setModalCert(c);
              }
            }}
          >
            <i><CertIcon name={c.icon} /></i>
            <div>
              <h3>{c.title}</h3>
              <small>{c.meta}</small>
            </div>
            <a
              href={c.file}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="cert-dl-btn"
              title={`Download ${c.title} Certificate`}
              onClick={(e) => e.stopPropagation()}
            >
              ↓
            </a>
          </div>
        ))}
      </div>

      {/* Floating cursor-following certificate preview card (desktop hover) */}
      <div
        ref={pvRef}
        className={`cert-pv${hoveredIndex !== null && !modalCert ? ' on' : ''}`}
        aria-hidden="true"
      >
        <div className="cert-pv-frame">
          {certs.map((c, idx) => (
            <img
              key={c.title}
              src={c.preview}
              alt=""
              className={idx === (hoveredIndex ?? lastIndex) ? 'active' : ''}
              decoding="async"
            />
          ))}
        </div>
        <div className="cert-pv-cap">
          <strong>{displayed.title}</strong>
          <span>{displayed.meta}</span>
        </div>
      </div>

      {/* Click / mobile tap full certificate preview modal */}
      {modalCert && (
        <div
          className="cert-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${modalCert.title} certificate preview`}
          onClick={() => setModalCert(null)}
        >
          <div className="cert-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-head">
              <div>
                <strong>{modalCert.title}</strong>
                <small>{modalCert.meta}</small>
              </div>
              <div className="cert-modal-actions">
                <a
                  href={modalCert.file}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-dl-btn"
                >
                  Download PDF ↓
                </a>
                <button
                  type="button"
                  className="cert-modal-close"
                  aria-label="Close certificate preview"
                  onClick={() => setModalCert(null)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="cert-modal-body">
              <img src={modalCert.preview} alt={`${modalCert.title} certificate`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

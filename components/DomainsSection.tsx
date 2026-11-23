'use client';
import { useEffect, useRef, useState } from 'react';
import { domains } from '@/lib/data';
import { Title } from './Title';

/**
 * Classy editorial Domain Expertise section.
 * Desktop: sticky vertical scroll drives a silky left-to-right horizontal card glide
 * with inner image parallax, progress indicator, and live counter.
 * Mobile / reduced-motion: native horizontal scroll-snap carousel with synced counter & controls.
 */
export function DomainsSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktopSticky, setIsDesktopSticky] = useState(true);

  const metricsRef = useRef({ travel: 0, sticky: true });

  useEffect(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!stage || !viewport || !track) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let currentX = 0;
    let targetX = 0;
    let rafId = 0;
    let lastIdx = 0;

    const getStickyMode = () => window.innerWidth > 768 && !reduceMotion.matches;

    const measure = () => {
      const sticky = getStickyMode();
      metricsRef.current.sticky = sticky;
      setIsDesktopSticky(sticky);

      if (sticky) {
        const travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
        metricsRef.current.travel = travel;
        // 1:1 natural scroll feel (slight extra height for comfortable pacing)
        stage.style.height = `${Math.round(travel * 1.15 + window.innerHeight)}px`;
        viewport.scrollLeft = 0;
      } else {
        metricsRef.current.travel = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
        stage.style.height = '';
        track.style.transform = '';
        // Reset image parallax transforms on mobile
        track.querySelectorAll<HTMLImageElement>('.domain-img img').forEach((img) => {
          img.style.transform = '';
        });
      }
      computeTarget();
    };

    const updateParallaxAndUI = (x: number, travel: number) => {
      const progress = travel > 0 ? Math.max(0, Math.min(1, x / travel)) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${Math.max(0.06, progress)})`;
      }

      const nextIdx = Math.min(domains.length - 1, Math.round(progress * (domains.length - 1)));
      if (nextIdx !== lastIdx) {
        lastIdx = nextIdx;
        setActiveIndex(nextIdx);
      }

      if (metricsRef.current.sticky) {
        const vw = viewport.clientWidth || 1;
        const cards = track.querySelectorAll<HTMLElement>('.domain-card');
        cards.forEach((card) => {
          const img = card.querySelector<HTMLImageElement>('.domain-img img');
          if (!img) return;
          const rect = card.getBoundingClientRect();
          const center = rect.left + rect.width * 0.5;
          const norm = Math.max(-1, Math.min(1, (center - vw * 0.5) / (vw * 0.75)));
          img.style.transform = `scale(1.12) translate3d(${(-norm * 18).toFixed(1)}px, 0, 0)`;
        });
      }
    };

    const computeTarget = () => {
      if (!metricsRef.current.sticky) return;
      const rect = stage.getBoundingClientRect();
      const scrollable = Math.max(1, stage.offsetHeight - window.innerHeight);
      const raw = Math.max(0, Math.min(1, -rect.top / scrollable));
      targetX = raw * metricsRef.current.travel;
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      rafId = 0;
      if (!metricsRef.current.sticky) return;

      const diff = targetX - currentX;
      if (Math.abs(diff) < 0.25) {
        currentX = targetX;
      } else {
        currentX += diff * 0.14;
        rafId = requestAnimationFrame(tick);
      }

      track.style.transform = `translate3d(${(-currentX).toFixed(2)}px, 0, 0)`;
      updateParallaxAndUI(currentX, metricsRef.current.travel);
    };

    const onViewportScroll = () => {
      if (metricsRef.current.sticky) return;
      const travel = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
      updateParallaxAndUI(viewport.scrollLeft, travel);
    };

    const ro = new ResizeObserver(() => measure());
    ro.observe(viewport);
    ro.observe(track);

    window.addEventListener('scroll', computeTarget, { passive: true });
    window.addEventListener('resize', measure);
    viewport.addEventListener('scroll', onViewportScroll, { passive: true });
    reduceMotion.addEventListener('change', measure);

    measure();
    // Initial render snap
    currentX = targetX;
    if (metricsRef.current.sticky) {
      track.style.transform = `translate3d(${(-currentX).toFixed(2)}px, 0, 0)`;
      updateParallaxAndUI(currentX, metricsRef.current.travel);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('scroll', computeTarget);
      window.removeEventListener('resize', measure);
      viewport.removeEventListener('scroll', onViewportScroll);
      reduceMotion.removeEventListener('change', measure);
    };
  }, []);

  const stepCard = (dir: -1 | 1) => {
    const targetIdx = Math.max(0, Math.min(domains.length - 1, activeIndex + dir));
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    if (!stage || !viewport) return;

    if (metricsRef.current.sticky) {
      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      const scrollable = Math.max(1, stage.offsetHeight - window.innerHeight);
      const frac = targetIdx / (domains.length - 1);
      window.scrollTo({ top: stageTop + frac * scrollable, behavior: 'smooth' });
    } else {
      const card = viewport.querySelectorAll<HTMLElement>('.domain-card')[targetIdx];
      card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  return (
    <section className="domains-section" id="domains" aria-label="Domain expertise">
      <div className="domains-stage" ref={stageRef}>
        <div className="domains-sticky">
          <div className="domains-head">
            <div className="domains-head-left">
              <span className="chip">Domain expertise</span>
              <Title lead="Industries" muted="I’ve built for" />
            </div>

            <div className="domains-controls">
              <div className="domains-counter" aria-live="polite">
                <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
                <span className="domains-sep">/</span>
                <span>{String(domains.length).padStart(2, '0')}</span>
              </div>
              <div className="domains-arrows">
                <button
                  type="button"
                  className="domains-btn"
                  aria-label="Previous domain"
                  disabled={activeIndex === 0}
                  onClick={() => stepCard(-1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="domains-btn"
                  aria-label="Next domain"
                  disabled={activeIndex === domains.length - 1}
                  onClick={() => stepCard(1)}
                >
                  →
                </button>
              </div>
              <span className="domains-hint">
                {isDesktopSticky ? 'Scroll to glide →' : 'Swipe to explore →'}
              </span>
            </div>
          </div>

          <div className="domains-viewport" ref={viewportRef}>
            <div className="domains-track" ref={trackRef}>
              {domains.map((d, idx) => (
                <article
                  key={d.num}
                  className={`domain-card${idx === activeIndex ? ' is-active' : ''}`}
                >
                  <div className="domain-img">
                    <img src={d.image} alt={d.title} loading="lazy" decoding="async" />
                    <span className="domain-num">{d.num}</span>
                    <span className="domain-tag">{d.tag}</span>
                  </div>
                  <div className="domain-body">
                    <h3>{d.title}</h3>
                    {/* <p>{d.description}</p> */}
                    <ul className="domain-pills">
                      {d.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="domains-progress" aria-hidden="true">
            <span ref={barRef} />
          </div>
        </div>
      </div>
    </section>
  );
}

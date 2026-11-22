'use client';
import { useEffect } from 'react';

const cl = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Scroll-driven card assembly, hero parallax, blur-to-sharp headings, and count-up numbers.
 * Blocks start off to the side, tilted, smaller, and faded, and converge into the layout
 * in step with scroll, reversing when scrolling back up.
 */
export function useScrollEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    root.classList.add('js');

    const hero = document.getElementById('home');
    const pick = (s: string) => hero?.querySelector<HTMLElement>(s) ?? null;
    const ghost = pick('.ghost');
    const photo = pick('.photo');
    const poly = pick('.polaroid');
    const big = pick('.bigname');
    const talk = pick('.talk');

    const heads = Array.from(document.querySelectorAll<HTMLElement>('.title')).map((h) => ({
      h,
      w: Array.from(h.querySelectorAll<HTMLElement>('.w')),
    }));

    // Pre-map card elements with distinct scatter and tilt trajectories
    const cardElements: { el: HTMLElement; cfg: { dx: number; dy: number; rot: number } }[] = [];

    // 1. Stat cards & Summary portrait card in Impact
    const impactCards = Array.from(document.querySelectorAll<HTMLElement>('.impact > .rv'));
    const impactCfgs = [
      { dx: -80, dy: 60, rot: -8 }, // Experience
      { dx: -20, dy: 80, rot: 5 },  // Companies
      { dx: 90, dy: 50, rot: 7 },   // Summary portrait
      { dx: -70, dy: 75, rot: 6 },  // Certifications
      { dx: 80, dy: 65, rot: -6 },  // Domains
    ];
    impactCards.forEach((el, i) => {
      cardElements.push({ el, cfg: impactCfgs[i % impactCfgs.length] });
    });

    // 2. Experience rows in Work
    const jobs = Array.from(document.querySelectorAll<HTMLElement>('.job.rv'));
    const jobCfgs = [
      { dx: -75, dy: 50, rot: -4 },
      { dx: 75, dy: 50, rot: 4 },
    ];
    jobs.forEach((el, i) => {
      cardElements.push({ el, cfg: jobCfgs[i % jobCfgs.length] });
    });

    // 3. Skill cards in Toolkit
    const skills = Array.from(document.querySelectorAll<HTMLElement>('.sk.rv'));
    const skillCfgs = [
      { dx: -70, dy: 50, rot: -6 },
      { dx: -10, dy: 70, rot: 3 },
      { dx: 70, dy: 50, rot: 6 },
      { dx: -60, dy: 60, rot: 4 },
      { dx: 20, dy: 75, rot: -4 },
      { dx: 65, dy: 55, rot: -5 },
      { dx: -50, dy: 65, rot: -3 },
      { dx: 50, dy: 65, rot: 4 },
    ];
    skills.forEach((el, i) => {
      cardElements.push({ el, cfg: skillCfgs[i % skillCfgs.length] });
    });

    // 4. Certificate rows
    const certs = Array.from(document.querySelectorAll<HTMLElement>('.cert.rv'));
    const certCfgs = [
      { dx: -75, dy: 45, rot: -3 },
      { dx: 75, dy: 45, rot: 3 },
      { dx: -70, dy: 50, rot: 2.5 },
      { dx: 70, dy: 50, rot: -2.5 },
      { dx: -65, dy: 50, rot: -3 },
    ];
    certs.forEach((el, i) => {
      cardElements.push({ el, cfg: certCfgs[i % certCfgs.length] });
    });

    // 5. Contact section details & form
    const infoItems = Array.from(document.querySelectorAll<HTMLElement>('.info > .rv'));
    const infoCfgs = [
      { dx: -50, dy: 30, rot: -2 },
      { dx: -65, dy: 35, rot: 2 },
      { dx: -50, dy: 40, rot: -2 },
      { dx: -60, dy: 45, rot: 2 },
    ];
    infoItems.forEach((el, i) => {
      cardElements.push({ el, cfg: infoCfgs[i % infoCfgs.length] });
    });

    const formbox = document.querySelector<HTMLElement>('.formbox.rv');
    if (formbox) {
      cardElements.push({ el: formbox, cfg: { dx: 85, dy: 55, rot: 5 } });
    }

    let tick = false;
    const update = () => {
      tick = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const hh = hero?.offsetHeight ?? vh;

      // Hero parallax
      if (hero && y < hh + 100) {
        const p = cl(y / hh);
        if (ghost) ghost.style.transform = `translateY(${y * 0.4}px)`;
        if (photo) photo.style.transform = `translate(-50%, ${y * 0.14}px) scale(${1 + p * 0.14})`;
        if (poly) poly.style.transform = `translateY(${-y * 0.2}px) rotate(${p * 10}deg)`;
        if (big) big.style.transform = `translateX(${-y * 0.22}px)`;
        if (talk) talk.style.transform = `translateY(${y * 0.25}px)`;
      }

      // Title headings blur-to-sharp
      heads.forEach(({ h, w }) => {
        const r = h.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh) return;
        const prog = cl((vh * 0.9 - r.top) / (vh * 0.45));
        const n = w.length;
        w.forEach((el, i) => {
          const wp = cl((prog * (n + 2) - i) / 2);
          el.style.opacity = String(0.12 + 0.88 * wp);
          el.style.filter = `blur(${((1 - wp) * 9).toFixed(1)}px)`;
        });
      });

      // Scroll-driven card assemble / pull apart
      const isPhone = window.innerWidth <= 768;
      const phoneScale = isPhone ? 0.35 : 1.0;

      cardElements.forEach(({ el, cfg }) => {
        const r = el.getBoundingClientRect();
        // If element is offscreen
        if (r.top > vh + 120 || r.bottom < -100) return;

        // Progress: enters at vh * 0.98, fully locked in at vh * 0.62
        const startPoint = vh * 0.98;
        const windowSize = vh * 0.36;
        const p = cl((startPoint - r.top) / windowSize);

        // Smooth cubic ease-out
        const ease = 1 - Math.pow(1 - p, 2.5);
        const factor = 1 - ease;

        if (factor <= 0.001) {
          el.style.transform = 'none';
          el.style.opacity = '1';
        } else {
          const x = (cfg.dx * factor * phoneScale).toFixed(1);
          const y = (cfg.dy * factor).toFixed(1);
          const rot = (cfg.rot * factor * phoneScale).toFixed(1);
          const scale = (0.90 + 0.10 * ease).toFixed(3);
          const opacity = (0.10 + 0.90 * ease).toFixed(2);

          el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`;
          el.style.opacity = opacity;
        }
      });
    };

    const onScroll = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Count-up numbers observer
    const co = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          co.unobserve(e.target);
          const m = (e.target.textContent ?? '').match(/^(\d+)(.*)$/);
          if (!m) return;
          const end = Number(m[1]);
          let start: number | null = null;
          const step = (ts: number) => {
            start = start ?? ts;
            const k = cl((ts - start) / 1000);
            e.target.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + m[2];
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }),
      { threshold: 0.6 },
    );
    document.querySelectorAll('[data-count]').forEach((b) => co.observe(b));

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      co.disconnect();
      root.classList.remove('js');
      // Reset card transforms
      cardElements.forEach(({ el }) => {
        el.style.transform = '';
        el.style.opacity = '';
      });
    };
  }, []);
}

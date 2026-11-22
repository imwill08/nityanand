'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { profile } from '@/lib/data';

function getThree(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return;
    if ((window as any).THREE) {
      resolve((window as any).THREE);
      return;
    }
    const existing = document.querySelector('script[src*="three"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any).THREE));
      if ((window as any).THREE) {
        resolve((window as any).THREE);
        return;
      }
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => resolve((window as any).THREE);
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

export default function CloudsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanupFn: (() => void) | undefined;
    let isCancelled = false;

    getThree()
      .then((THREE) => {
        if (isCancelled || !THREE || !canvasRef.current) return;
        cleanupFn = initScene(THREE);
      })
      .catch((err) => {
        console.error('Failed to load Three.js:', err);
      });

    const initScene = (THREE: any) => {
      const chs = Array.from(document.querySelectorAll<HTMLElement>('.ch'));
      const N = chs.length;
      const rail = railRef.current;
      const hint = hintRef.current;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Palette per chapter: [top, horizon, cloud]
      const P = [
        ['#1b2a5c', '#d9775f', '#ffd9c4'],
        ['#2c5a9a', '#e8a77d', '#fff1de'],
        ['#080a1c', '#4a2f7a', '#9d8cd8'],
        ['#3a2c70', '#e0668a', '#ffc9d6'],
        ['#0e3a5e', '#e6b36a', '#fff0cc'],
      ].map((r) => r.map((h) => new THREE.Color(h)));

      if (rail) {
        rail.innerHTML = '';
      }

      const dots = chs.map((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to chapter ' + (i + 1));
        if (i === 0) b.classList.add('on');
        b.onclick = () => {
          const maxScroll = document.body.scrollHeight - window.innerHeight;
          const targetY = (i / (N - 1)) * maxScroll;
          window.scrollTo({
            top: targetY,
            behavior: reduce ? 'auto' : 'smooth',
          });
        };
        if (rail) rail.appendChild(b);
        return b;
      });

      const cv = canvasRef.current;
      if (!cv) return;

      let R: any, S: any, C: any, orb: any, glow: any;
      const mat: any[] = [];
      const END = -380;
      let tgt = 0;
      let cur = 0;
      let mx = 0;
      let my = 0;
      let rafId: number;

      try {
        R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
        R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        S = new THREE.Scene();
        S.fog = new THREE.Fog(0xffffff, 25, 150);
        C = new THREE.PerspectiveCamera(60, 1, 0.1, 600);

        // Cloud texture
        const t = document.createElement('canvas');
        t.width = t.height = 128;
        const g = t.getContext('2d')!;
        const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        gr.addColorStop(0, 'rgba(255,255,255,.95)');
        gr.addColorStop(0.45, 'rgba(255,255,255,.4)');
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, 128, 128);
        const tex = new THREE.CanvasTexture(t);

        for (let m = 0; m < 3; m++) {
          mat.push(
            new THREE.SpriteMaterial({
              map: tex,
              transparent: true,
              depthWrite: false,
              opacity: 0.35 + m * 0.15,
            })
          );
        }

        for (let i = 0; i < 190; i++) {
          const s = new THREE.Sprite(mat[i % 3]);
          const sc = 20 + Math.random() * 36;
          let x = (Math.random() - 0.5) * 150;
          if (Math.abs(x) < 8) x += x < 0 ? -10 : 10;
          s.scale.set(sc * 1.6, sc * 0.7, 1);
          s.position.set(
            x,
            -6 - Math.random() * 16 + (Math.random() < 0.2 ? 18 : 0),
            40 - Math.random() * 470
          );
          S.add(s);
        }

        // Glowing orb for chapter 3
        const og = new THREE.Group();
        og.position.set(0, 2, END * 0.5 - 26);
        orb = new THREE.Mesh(
          new THREE.SphereGeometry(3, 32, 32),
          new THREE.MeshBasicMaterial({ color: 0xfff2c8, fog: false })
        );
        const gt = document.createElement('canvas');
        gt.width = gt.height = 128;
        const gg = gt.getContext('2d')!;
        const g2 = gg.createRadialGradient(64, 64, 6, 64, 64, 64);
        g2.addColorStop(0, 'rgba(255,220,150,.9)');
        g2.addColorStop(1, 'rgba(255,160,90,0)');
        gg.fillStyle = g2;
        gg.fillRect(0, 0, 128, 128);
        glow = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(gt),
            transparent: true,
            depthWrite: false,
            fog: false,
            blending: THREE.AdditiveBlending,
          })
        );
        glow.scale.set(34, 34, 1);
        og.add(orb, glow);
        S.add(og);
        orb = og;

        // Towers for chapter 5
        for (let k = 0; k < 9; k++) {
          const h = 26 + Math.random() * 50;
          const w = 2 + Math.random() * 3;
          const b = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, w),
            new THREE.MeshBasicMaterial({ color: 0xffe6b0, transparent: true, opacity: 0.85 })
          );
          b.position.set(
            (k - 4) * 5.5 + (Math.random() - 0.5) * 3,
            -14 + h / 2 - 8,
            END - 34 - Math.random() * 20
          );
          S.add(b);
        }

        const onPointerMove = (e: PointerEvent) => {
          mx = e.clientX / window.innerWidth - 0.5;
          my = e.clientY / window.innerHeight - 0.5;
        };
        window.addEventListener('pointermove', onPointerMove);

        const size = () => {
          if (!R) return;
          R.setSize(window.innerWidth, window.innerHeight, false);
          C.aspect = window.innerWidth / window.innerHeight;
          C.updateProjectionMatrix();
        };
        window.addEventListener('resize', size);
        size();

        const onScroll = () => {
          const m = document.body.scrollHeight - window.innerHeight;
          tgt = m > 0 ? Math.min(1, Math.max(0, window.scrollY / m)) : 0;
          if (hint && window.scrollY > 20) hint.style.opacity = '0';
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const a = new THREE.Color();
        const b2 = new THREE.Color();
        const c = new THREE.Color();

        const frame = (now: number) => {
          cur += (tgt - cur) * (reduce ? 1 : 0.08);

          // Interpolate sky colors across chapters (0 to N - 1)
          const progress = cur * (N - 1);
          const i0 = Math.min(N - 2, Math.max(0, Math.floor(progress)));
          const i1 = i0 + 1;
          const k = progress - i0;
          const e = k * k * (3 - 2 * k);

          a.copy(P[i0][0]).lerp(P[i1][0], e);
          b2.copy(P[i0][1]).lerp(P[i1][1], e);
          c.copy(P[i0][2]).lerp(P[i1][2], e);

          document.body.style.background =
            'linear-gradient(180deg, #' + a.getHexString() + ' 0%, #' + b2.getHexString() + ' 100%)';

          chs.forEach((el, i) => {
            const chapterPos = i / (N - 1); // 0, 0.25, 0.5, 0.75, 1.0
            const dist = Math.abs(cur - chapterPos) * (N - 1);
            const o = Math.max(0, Math.min(1, 1.3 - dist * 1.6));
            el.style.opacity = String(o.toFixed(2));
            el.style.transform = `translateY(calc(-50% + ${(cur - chapterPos) * -100}px))`;
            el.classList.toggle('on', o > 0.5);
            if (dots[i]) dots[i].classList.toggle('on', dist < 0.5);
          });

          if (R) {
            S.fog.color.copy(b2).lerp(a, 0.35);
            mat.forEach((m) => m.color.copy(c));
            const tt = now * 0.001;
            C.position.set(mx * 5, 3 + Math.sin(cur * Math.PI * 2) * 3 - my * 2, 20 + cur * (END - 20));
            C.rotation.set(-my * 0.08, -mx * 0.1, 0);
            if (orb) {
              const near = 1 - Math.min(1, Math.abs(cur - 0.5) * 3.2);
              glow.material.opacity = 0.35 + near * 0.65;
              glow.scale.setScalar(30 + Math.sin(tt * 1.6) * 3 + near * 14);
              orb.rotation.y = tt * 0.2;
            }
            R.render(S, C);
          }
          rafId = requestAnimationFrame(frame);
        };

        rafId = requestAnimationFrame(frame);

        return () => {
          cancelAnimationFrame(rafId);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('resize', size);
          window.removeEventListener('scroll', onScroll);
          if (R) R.dispose();
        };
      } catch (err) {
        console.error('Three.js cloud error:', err);
      }
    };

    return () => {
      isCancelled = true;
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <>
      <div className="clouds-nav">
        <Link href="/">← Main Portfolio</Link>
        <Link href="/creative">Creative 3D Desk ↗</Link>
      </div>

      <canvas id="scene" ref={canvasRef} aria-hidden="true" />
      <div id="track" />

      <section className="ch" aria-label="Chapter 1">
        <h1>Nityanand Yadav</h1>
        <p>I build fast, careful interfaces for the web. React developer with 3+ years of shipping products people use every day.</p>
      </section>

      <section className="ch" aria-label="Chapter 2">
        <h2>It started with small steps.</h2>
        <p>An internship at IFORTIS Worldwide in 2023, then a developer role at Blitz Learning Technologies, where I learned how real products grow.</p>
      </section>

      <section className="ch" aria-label="Chapter 3">
        <h2>Then I stayed for the details.</h2>
        <p>Since September 2025 I’m a React developer at TechGropse, turning rough ideas into screens that feel finished.</p>
      </section>

      <section className="ch" aria-label="Chapter 4">
        <h2>The tools I reach for.</h2>
        <p>A typed, component-driven stack, from the browser to the API.</p>
        <ul>
          <li>React</li>
          <li>Next.js</li>
          <li>TypeScript</li>
          <li>Node.js</li>
          <li>Express</li>
          <li>Redux Toolkit</li>
          <li>TanStack Query</li>
          <li>Tailwind CSS</li>
        </ul>
      </section>

      <section className="ch" aria-label="Chapter 5">
        <h2>Let’s build something that lasts.</h2>
        <p>B.E. in Computer Science, Chandigarh University. Open to good projects and good teams.</p>
        <div>
          <a className="ch-btn" href={`mailto:${profile.email}`}>
            Say hello ↗
          </a>
          <Link className="ch-btn sec" href="/">
            ← Back to Main Portfolio
          </Link>
        </div>
      </section>

      <nav id="rail" ref={railRef} aria-label="Chapters" />
      <div id="hint" ref={hintRef}>
        Scroll to fly ↓
      </div>
    </>
  );
}

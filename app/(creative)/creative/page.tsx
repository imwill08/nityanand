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

export default function CreativePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isCancelled = false;
    let cleanupThree: (() => void) | undefined;
    let cleanupUI: (() => void) | undefined;

    // -------------------------------------------------------------
    // 1. THREE.JS 3D DEVELOPER STUDIO WORKSTATION
    // -------------------------------------------------------------
    getThree()
      .then((THREE) => {
        if (isCancelled || !THREE || !canvasRef.current) return;
        cleanupThree = initThree(THREE, canvasRef.current);
      })
      .catch((err) => {
        console.error('Failed to load Three.js:', err);
      });

    function initThree(THREE: any, cv: HTMLCanvasElement) {
      const T = THREE;
      const V = T.Vector3;
      const PI = Math.PI;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let rafId: number;
      const R = new T.WebGLRenderer({ canvas: cv, antialias: true });
      R.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      R.setClearColor(0x06070c);
      R.shadowMap.enabled = true;
      R.shadowMap.type = T.PCFSoftShadowMap;
      R.toneMapping = T.ACESFilmicToneMapping;
      R.toneMappingExposure = 1.15;

      const S = new T.Scene();
      S.fog = new T.Fog(0x06070c, 11, 26);
      const C = new T.PerspectiveCamera(42, 1, 0.1, 60);

      let seed = 11;
      function rnd() {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      }

      function M(c: number, o?: any) {
        const p: any = { color: c, roughness: 0.6, metalness: 0.03 };
        if (o) for (const k in o) p[k] = o[k];
        return new T.MeshStandardMaterial(p);
      }

      function add(g: any, geo: any, mat: any, x?: number, y?: number, z?: number) {
        const m = new T.Mesh(geo, mat);
        m.position.set(x || 0, y || 0, z || 0);
        g.add(m);
        return m;
      }

      function CT(w: number, h: number) {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        return { c, x: c.getContext('2d')!, t: new T.CanvasTexture(c) };
      }

      function limb(m: any, a: any, b: any) {
        const d = b.clone().sub(a);
        const l = d.length();
        m.position.copy(a).add(b).multiplyScalar(0.5);
        m.scale.y = l;
        m.quaternion.setFromUnitVectors(new V(0, 1, 0), d.normalize());
      }

      function rr(x: any, X: number, Y: number, w: number, h: number, r: number) {
        if (typeof x.roundRect === 'function') {
          x.beginPath();
          x.roundRect(X, Y, w, h, r);
          x.closePath();
        } else {
          x.beginPath();
          x.moveTo(X + r, Y);
          x.arcTo(X + w, Y, X + w, Y + h, r);
          x.arcTo(X + w, Y + h, X, Y + h, r);
          x.arcTo(X, Y + h, X, Y, r);
          x.arcTo(X, Y, X + w, Y, r);
          x.closePath();
        }
      }

      // Lights: monitors light the room, cool rim lights edge the developer
      S.add(new T.HemisphereLight(0x4a5aff, 0x120a06, 0.32));
      const sl = new T.SpotLight(0xffb36b, 1.3, 18, 0.85, 0.6, 1.2);
      sl.castShadow = true;
      sl.shadow.mapSize.set(1024, 1024);
      sl.position.set(-2.5, 1.55, -0.2);
      sl.target.position.set(-0.9, 0, 0.9);
      S.add(sl, sl.target);

      const sc = new T.PointLight(0x6fa8ff, 1.8, 10, 2);
      sc.position.set(0, 1.7, 0.6);
      S.add(sc);

      const rim = new T.PointLight(0xa855ff, 1.3, 12, 2);
      rim.position.set(-3, 3.2, -2);
      S.add(rim);

      const r1 = new T.PointLight(0x22d3ee, 0.9, 10, 2);
      r1.position.set(3.4, 2.6, 3.2);
      S.add(r1);

      const r2 = new T.PointLight(0xff5c8a, 0.7, 10, 2);
      r2.position.set(-3.4, 2.4, 3.4);
      S.add(r2);

      // Room
      add(S, new T.PlaneGeometry(44, 18), M(0x12141f, { roughness: 1 }), 0, 4, -2.6);
      const floor = add(S, new T.PlaneGeometry(44, 30), M(0x0c0d14, { roughness: 1 }), 0, -3, 0);
      floor.rotation.x = -PI / 2;

      const wd = CT(512, 256);
      const wx = wd.x;
      wx.fillStyle = '#6b4326';
      wx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 90; i++) {
        const yy = rnd() * 256;
        wx.strokeStyle = i % 2 ? 'rgba(40,22,10,' + (0.1 + rnd() * 0.2) + ')' : 'rgba(150,95,55,' + (0.1 + rnd() * 0.2) + ')';
        wx.lineWidth = 1 + rnd() * 2;
        wx.beginPath();
        wx.moveTo(0, yy);
        wx.bezierCurveTo(150, yy + rnd() * 10 - 5, 350, yy + rnd() * 10 - 5, 512, yy + rnd() * 8 - 4);
        wx.stroke();
      }
      wd.t.wrapS = wd.t.wrapT = T.RepeatWrapping;
      wd.t.repeat.set(2, 1);

      add(S, new T.BoxGeometry(10, 0.2, 3.6), M(0xffffff, { map: wd.t, roughness: 0.55 }), 0, -0.1, -0.05);
      [-4.8, 4.8].forEach((x) => {
        add(S, new T.BoxGeometry(0.25, 2.9, 3.4), M(0x1a1c26), x, -1.55, -0.05);
      });
      const led = add(S, new T.BoxGeometry(9, 0.05, 0.05), new T.MeshBasicMaterial({ color: 0x7c5cff }), 0, 3.0, -2.5);

      // Monitors with live code and a soft bloom
      const gl = CT(128, 128);
      const gx = gl.x;
      const gg = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gg.addColorStop(0, 'rgba(255,255,255,.85)');
      gg.addColorStop(1, 'rgba(255,255,255,0)');
      gx.fillStyle = gg;
      gx.fillRect(0, 0, 128, 128);

      const m1 = CT(640, 360);
      const m2 = CT(400, 300);
      let buf = '';
      const cols = ['#c6ff3d', '#8d9bff', '#f1f0e6', '#22d3ee', '#ff5c8a'];

      function mon(w: number, h: number, tx: any, x: number, z: number, ry: number, tint: number) {
        const g = new T.Group();
        g.position.set(x, 0.56 + h / 2, z);
        g.rotation.y = ry;
        S.add(g);
        add(g, new T.BoxGeometry(w + 0.14, h + 0.14, 0.1), M(0x08080b, { roughness: 0.4, metalness: 0.5 }));
        add(g, new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tx, toneMapped: false }), 0, 0, 0.056);
        add(
          g,
          new T.PlaneGeometry(w * 1.7, h * 1.9),
          new T.MeshBasicMaterial({ map: gl.t, color: tint, transparent: true, opacity: 0.4, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }),
          0,
          0,
          0.09
        );
        const mt = M(0x15161c, { metalness: 0.7, roughness: 0.35 });
        add(g, new T.BoxGeometry(0.16, 0.5, 0.08), mt, 0, -h / 2 - 0.25, -0.06);
        add(g, new T.BoxGeometry(1.1, 0.04, 0.55), mt, 0, -h / 2 - 0.52, 0);
      }
      mon(3.4, 1.9, m1.t, 0, -1, 0, 0x6fa8ff);
      mon(2.1, 1.5, m2.t, -3.1, -0.7, 0.5, 0xa855ff);

      const code = [
        "import React from 'react';",
        "import { motion } from 'framer-motion';",
        '',
        'export default function Portfolio() {',
        "  const [theme, setTheme] = useState('dark');",
        '  useEffect(() => { ship(); }, []);',
        '  return (',
        "    <Hero name='Nityanand' />",
        '  );',
        '}',
        '// TechGropse - React Developer',
        "const stack = ['React','Next','TS'];",
        "fetch('/api/projects').then(render);",
        "export const speed = 'fast';",
      ];
      let t = 0;

      function bar(x: any, w: number) {
        x.fillStyle = '#12151f';
        x.fillRect(0, 0, w, 28);
        ['#ff5c8a', '#ffbd2e', '#c6ff3d'].forEach((c, i) => {
          x.fillStyle = c;
          x.beginPath();
          x.arc(16 + i * 18, 14, 5, 0, 7);
          x.fill();
        });
      }

      function drawMain() {
        const x = m1.x;
        x.fillStyle = '#0b0d14';
        x.fillRect(0, 0, 640, 360);
        x.font = '15px monospace';
        const lh = 22;
        const tot = code.length * lh;
        const off = (t * 28) % tot;
        for (let i = 0; i < code.length; i++) {
          let y = 46 + i * lh - off;
          if (y < 30) y += tot;
          if (y > 316) continue;
          x.fillStyle = cols[i % cols.length];
          x.fillText(code[i], 18, y);
        }
        bar(x, 640);
        x.fillStyle = '#12151f';
        x.fillRect(0, 322, 640, 38);
        x.fillStyle = '#c6ff3d';
        x.font = '600 16px monospace';
        x.fillText('> ' + buf + (Math.floor(t * 3) % 2 ? '\u258c' : ''), 16, 346);
        m1.t.needsUpdate = true;
      }

      function drawSide() {
        const x = m2.x;
        x.fillStyle = '#0e1018';
        x.fillRect(0, 0, 400, 300);
        for (let i = 0; i < 7; i++) {
          const h = 40 + Math.abs(Math.sin(t * 1.3 + i * 0.9)) * 130;
          x.fillStyle = i % 2 ? '#7c5cff' : '#22d3ee';
          x.fillRect(24 + i * 52, 280 - h, 34, h);
        }
        bar(x, 400);
        x.fillStyle = '#8d8f84';
        x.font = '13px monospace';
        x.fillText('lighthouse: 100 / 100', 24, 56);
        x.fillText('build: passing', 24, 74);
        m2.t.needsUpdate = true;
      }

      // Backlit keyboard
      const kb = new T.Group();
      kb.position.set(0, 0, 0.95);
      S.add(kb);
      add(kb, new T.BoxGeometry(3.3, 0.1, 1.35), M(0x101116, { roughness: 0.5, metalness: 0.4 }), 0, 0.05, 0);

      const rows = ['`1234567890-=', 'qwertyuiop[]\\', "asdfghjkl;'", 'zxcvbnm,./'];
      const off = [0, 0.35, 0.6, 0.95];
      const keys: Record<string, any> = {};
      const km: any[] = [];

      function key(ch: string, w: number, x: number, z: number) {
        const m = add(kb, new T.BoxGeometry(w, 0.1, 0.19), M(0x1a1c26, { roughness: 0.5, emissive: 0x6a5cff, emissiveIntensity: 0.35 }), x, 0.15, z);
        keys[ch] = { m, p: 0, x };
        km.push(keys[ch]);
      }

      rows.forEach((rw, r) => {
        rw.split('').forEach((ch, i) => {
          key(ch, 0.19, (off[r] + i) * 0.235 - 1.55, (r - 1.5) * 0.235);
        });
      });
      key(' ', 1.6, 0.25, 0.59);

      // The developer, seen from behind
      const hc = M(0x23283a, { roughness: 0.9 });
      const hd = M(0x181c2a, { roughness: 0.9 });
      const sk = M(0xeeb08a);
      const hr = M(0x2a1a12, { roughness: 0.85 });
      const gm = M(0x2a1a12);
      const pn = M(0x1b1f2e, { roughness: 0.9 });
      const dk = M(0x15171f, { roughness: 0.6 });

      const dev = new T.Group();
      dev.position.set(0, 1.8, 2.7);
      S.add(dev);

      const torso = add(dev, new T.CylinderGeometry(1, 1.2, 1.75, 32), hc, 0, -0.85, 0);
      torso.scale.z = 0.74;
      add(dev, new T.SphereGeometry(0.5, 20, 14), hd, 0, 0.02, 0.42).scale.set(1.35, 0.95, 0.7);

      const bp = CT(256, 128);
      const bx = bp.x;
      bx.fillStyle = '#c6ff3d';
      bx.font = '700 56px monospace';
      bx.textAlign = 'center';
      bx.fillText('</> ND', 128, 80);
      add(dev, new T.PlaneGeometry(0.95, 0.48), new T.MeshBasicMaterial({ map: bp.t, transparent: true }), 0, -0.5, 0.8);
      add(dev, new T.CylinderGeometry(0.25, 0.27, 0.45, 16), sk, 0, 0.12, 0);
      [-1, 1].forEach((s) => {
        add(dev, new T.SphereGeometry(0.3, 16, 12), hc, s * 1.05, -0.3, 0);
      });

      const head = new T.Group();
      head.position.y = 0.3;
      head.rotation.y = PI;
      dev.add(head);

      const hm = add(head, new T.SphereGeometry(0.8, 32, 24), sk, 0, 0.7, 0);
      hm.scale.set(0.95, 1.07, 0.98);
      [-1, 1].forEach((s) => {
        add(head, new T.SphereGeometry(0.14, 12, 10), sk, s * 0.78, 0.66, 0).scale.z = 0.5;
      });
      add(head, new T.SphereGeometry(0.86, 40, 24, 0, PI * 2, 0, PI * 0.44), hr, 0, 0.74, -0.06).rotation.x = -0.3;
      add(head, new T.SphereGeometry(0.84, 32, 20), hr, 0, 0.62, -0.2).scale.set(0.98, 0.9, 0.82);

      const pf = add(head, new T.SphereGeometry(1, 28, 20), hr, 0, 1.56, 0.12);
      pf.scale.set(0.66, 0.36, 0.58);
      pf.rotation.x = -0.25;

      const pf2 = add(head, new T.SphereGeometry(1, 24, 16), hr, 0.2, 1.5, 0.34);
      pf2.scale.set(0.42, 0.24, 0.34);
      pf2.rotation.set(-0.3, 0, -0.35);

      [-0.27, 0.27].forEach((x) => {
        add(head, new T.SphereGeometry(0.1, 16, 12), M(0xffffff, { roughness: 0.3 }), x, 0.76, 0.67);
        add(head, new T.SphereGeometry(0.06, 12, 10), M(0x14150f), x, 0.76, 0.755);
        add(head, new T.TorusGeometry(0.2, 0.02, 8, 32), gm, x, 0.76, 0.79);
      });

      [-1, 1].forEach((s) => {
        const b = add(head, new T.BoxGeometry(0.22, 0.055, 0.05), hr, s * 0.27, 1.02, 0.73);
        b.rotation.z = s * -0.16;
        const tp = add(head, new T.BoxGeometry(0.025, 0.025, 0.8), gm, s * 0.58, 0.78, 0.4);
        tp.rotation.y = s * 0.28;
        const c = add(head, new T.SphereGeometry(0.1, 12, 10), new T.MeshBasicMaterial({ color: 0xf06a5a, transparent: true, opacity: 0.4 }), s * 0.46, 0.55, 0.63);
        c.scale.set(1.2, 0.7, 0.35);
        c.rotation.y = s * 0.5;
      });
      add(head, new T.SphereGeometry(0.07, 12, 10), sk, 0, 0.62, 0.79).scale.y = 1.2;
      add(head, new T.TorusGeometry(0.17, 0.03, 8, 20, PI), M(0x7a2f22), 0, 0.5, 0.76).rotation.z = PI;

      const hs = M(0x1c1f2b, { roughness: 0.4, metalness: 0.3 });
      add(head, new T.TorusGeometry(0.93, 0.06, 10, 40, PI), hs, 0, 0.7, 0);
      [-1, 1].forEach((s) => {
        add(head, new T.CylinderGeometry(0.3, 0.3, 0.2, 24), hs, s * 0.9, 0.7, 0).rotation.z = PI / 2;
        add(head, new T.TorusGeometry(0.2, 0.03, 8, 24), new T.MeshBasicMaterial({ color: 0x22d3ee, toneMapped: false }), s * 1.01, 0.7, 0).rotation.y = PI / 2;
      });

      // Arms, hands, legs, chair
      const sh = [new V(-1.05, 1.5, 2.7), new V(1.05, 1.5, 2.7)];
      const El = [new V(-1.5, 0.5, 2.55), new V(1.5, 0.5, 2.55)];
      const hands = [-1, 1].map((s, i) => {
        const g = new T.Group();
        const sks = M(0xe2a984, { roughness: 0.7 });
        S.add(g);
        add(g, new T.SphereGeometry(0.3, 16, 12), sks).scale.set(1, 0.36, 0.8);
        for (let k = 0; k < 4; k++) {
          add(g, new T.CylinderGeometry(0.036, 0.032, 0.32, 8), sks, (k - 1.5) * 0.11, -0.03, -0.3).rotation.x = PI / 2 + 0.25;
        }
        add(g, new T.CylinderGeometry(0.04, 0.036, 0.26, 8), sks, -s * 0.3, -0.02, -0.12).rotation.set(PI / 2, 0, s * 0.9);
        g.position.set(s * 0.75, 0.34, 1.0);
        g.userData = {
          s,
          tx: s * 0.75,
          dip: 0,
          u: add(S, new T.CylinderGeometry(0.19, 0.17, 1, 14), hc),
          f: add(S, new T.CylinderGeometry(0.17, 0.15, 1, 14), hc),
          j: add(S, new T.SphereGeometry(0.19, 14, 10), hc),
          c: add(S, new T.SphereGeometry(0.18, 14, 10), hd),
          E: El[i],
          S: sh[i],
        };
        return g;
      });

      [-1, 1].forEach((s) => {
        add(S, new T.BoxGeometry(0.75, 0.5, 1.2), pn, s * 0.5, 0.3, 2.5);
        limb(add(S, new T.CylinderGeometry(0.27, 0.22, 1, 14), pn), new V(s * 0.5, 0.3, 1.95), new V(s * 0.5, -2.85, 2.1));
        add(S, new T.BoxGeometry(0.5, 0.2, 0.9), dk, s * 0.5, -2.9, 2.35);
      });

      add(S, new T.BoxGeometry(2.3, 1.2, 0.22), dk, 0, 0.7, 3.75);
      add(S, new T.BoxGeometry(1.9, 0.05, 0.02), new T.MeshBasicMaterial({ color: 0xc6ff3d }), 0, 1.0, 3.87);
      add(S, new T.BoxGeometry(2.3, 0.2, 2.0), dk, 0, -0.1, 2.9);
      add(S, new T.CylinderGeometry(0.12, 0.12, 2.9, 12), dk, 0, -1.55, 2.9);
      add(S, new T.CylinderGeometry(1, 1, 0.08, 24), dk, 0, -2.96, 2.9);

      const str = 'const portfolio = () => ship(ui); // react next ts ';
      let ai = 0;
      let lastKey = 0;

      function press(ch: string) {
        const k = keys[ch];
        if (!k) return;
        k.p = 1;
        const h = hands[k.x < 0.1 ? 0 : 1];
        const u = h.userData;
        u.tx = u.s * 0.55 + k.x * 0.5;
        u.dip = 1;
        buf += ch;
        if (buf.length > 34) buf = ch;
      }

      const onKeyDown = (e: KeyboardEvent) => {
        lastKey = performance.now();
        if (e.key === 'Enter') buf = '';
        else if (e.key === 'Backspace') buf = buf.slice(0, -1);
        else if (e.key.length === 1 || e.key === ' ') press(e.key.toLowerCase());
      };
      window.addEventListener('keydown', onKeyDown);

      // Desk props
      const ms = add(S, new T.SphereGeometry(0.2, 20, 14), M(0x15161c, { roughness: 0.4 }), 2.0, 0.07, 0.95);
      ms.scale.set(0.7, 0.38, 1.1);

      const mug = new T.Group();
      mug.position.set(3.0, 0, 1.15);
      S.add(mug);
      add(mug, new T.CylinderGeometry(0.22, 0.19, 0.4, 24), M(0xf1eee4, { roughness: 0.3 }), 0, 0.2, 0);
      add(mug, new T.CylinderGeometry(0.19, 0.19, 0.01, 24), M(0x2a160c), 0, 0.39, 0);
      add(mug, new T.TorusGeometry(0.12, 0.035, 8, 16), M(0xf1eee4, { roughness: 0.3 }), 0.26, 0.2, 0);
      const steam = [0, 1, 2].map((i) =>
        add(mug, new T.SphereGeometry(0.05, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 }), (i - 1) * 0.06, 0.5, 0)
      );

      const pl = new T.Group();
      pl.position.set(4, 0, -0.3);
      S.add(pl);
      add(pl, new T.CylinderGeometry(0.34, 0.26, 0.5, 20), M(0xc4673c, { roughness: 0.8 }), 0, 0.25, 0);
      add(pl, new T.CylinderGeometry(0.3, 0.3, 0.02, 20), M(0x2a1a10), 0, 0.5, 0);
      const lv: any[] = [];
      for (let q = 0; q < 9; q++) {
        const lg = new T.Group();
        lg.rotation.y = q * 0.7;
        lg.position.y = 0.5;
        pl.add(lg);
        const lf = add(lg, new T.SphereGeometry(1, 10, 8), M(0x3f9a52, { roughness: 0.6 }), 0.12, 0.45, 0);
        lf.scale.set(0.06, 0.45 + rnd() * 0.25, 0.2);
        lf.rotation.z = -0.5 - rnd() * 0.5;
        lv.push(lg);
      }

      const lp = new T.Group();
      lp.position.set(-3.9, 0, -0.6);
      S.add(lp);
      const lm = M(0x2a2c36, { metalness: 0.8, roughness: 0.3 });
      const P0 = new V(0, 0.08, 0);
      const P1 = new V(0.5, 1.3, 0.1);
      const P2 = new V(1.4, 1.55, 0.4);
      add(lp, new T.CylinderGeometry(0.4, 0.45, 0.08, 24), lm, 0, 0.04, 0);
      limb(add(lp, new T.CylinderGeometry(0.035, 0.035, 1, 8), lm), P0, P1);
      limb(add(lp, new T.CylinderGeometry(0.035, 0.035, 1, 8), lm), P1, P2);
      const dir = new V(1.6, -1.55, 1.1).normalize();
      const cone = add(lp, new T.ConeGeometry(0.3, 0.5, 20, 1, true), new T.MeshStandardMaterial({ color: 0x2a2c36, metalness: 0.8, roughness: 0.3, side: T.DoubleSide }), P2.x, P2.y, P2.z);
      cone.quaternion.setFromUnitVectors(new V(0, 1, 0), dir.clone().negate());

      [[0x7c5cff, 0.08, 0.9, 0.6], [0x22d3ee, 0.24, 0.8, 0.55], [0xff5c8a, 0.4, 0.7, 0.5]].forEach((b, i) => {
        add(S, new T.BoxGeometry(b[2] + 0.1, 0.16, b[3]), M(b[0], { roughness: 0.7 }), 2.6, b[1], -1.3).rotation.y = i * 0.12 - 0.1;
      });
      add(S, new T.BoxGeometry(0.9, 0.05, 0.7), M(0xd8d6cc), -2.6, 0.025, 1.3).rotation.y = 0.25;

      // Floating dust in screen light
      const N = 160;
      const dp = new Float32Array(N * 3);
      for (let d = 0; d < N; d++) {
        dp[d * 3] = (rnd() - 0.5) * 9;
        dp[d * 3 + 1] = rnd() * 4.5;
        dp[d * 3 + 2] = -1 + rnd() * 5;
      }
      const dg = new T.BufferGeometry();
      dg.setAttribute('position', new T.BufferAttribute(dp, 3));
      S.add(new T.Points(dg, new T.PointsMaterial({ color: 0x9ecbff, size: 0.04, transparent: true, opacity: 0.55, depthWrite: false })));

      // Speech bubble shown when he turns around
      const msgs = ['Oh, hi! \u{1F44B}', "Shh, I'm shipping...", 'Need a frontend dev?', 'Hire me \u{1F680}'];
      let mi = 0;
      const bb = CT(512, 170);

      function bubble(s: string) {
        const x = bb.x;
        x.clearRect(0, 0, 512, 170);
        x.fillStyle = '#ffffff';
        x.strokeStyle = '#14150f';
        x.lineWidth = 5;
        rr(x, 6, 6, 500, 110, 34);
        x.fill();
        x.stroke();
        x.beginPath();
        x.moveTo(190, 112);
        x.lineTo(215, 160);
        x.lineTo(240, 112);
        x.fill();
        x.fillStyle = '#14150f';
        x.font = '700 31px monospace';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText(s, 256, 62);
        bb.t.needsUpdate = true;
      }
      bubble(msgs[0]);

      const sp = new T.Sprite(new T.SpriteMaterial({ map: bb.t, transparent: true, opacity: 0, depthTest: false }));
      sp.scale.set(2.8, 0.93, 1);
      sp.position.set(0, 4.5, 2.7);
      S.add(sp);

      S.traverse((o: any) => {
        if (o.isMesh) {
          const b = o.material.type === 'MeshBasicMaterial';
          o.castShadow = !b;
          o.receiveShadow = !b;
        }
      });

      // Cinematic camera path: over his shoulder, monitor, side profile, props, wide
      const K = [
        [[2.8, 2.8, 6.6], [-0.8, 1.6, 0]],
        [[2.0, 2.5, 4.6], [-0.4, 1.7, -1]],
        [[4.2, 1.8, 3.0], [0, 0.8, 1.4]],
        [[3.4, 1.7, 4.6], [2.0, 0.7, 0.3]],
        [[0, 3.4, 9.5], [0, 1.6, 0]],
      ].map((k) => ({
        p: new V(k[0][0], k[0][1], k[0][2]),
        l: new V(k[1][0], k[1][1], k[1][2]),
      }));

      let ks = [0, 1, 2, 3, 4];
      const ids = ['top', 'work', 'log', 'stack', 'contact'];

      function meas() {
        ks = ids.map((id) => {
          const e = document.getElementById(id);
          return e ? Math.max(0, e.offsetTop + e.offsetHeight / 2 - window.innerHeight / 2) : 0;
        });
      }

      function fit() {
        R.setSize(window.innerWidth, window.innerHeight, false);
        C.aspect = window.innerWidth / window.innerHeight;
        C.fov = C.aspect < 1 ? 64 : 42;
        C.updateProjectionMatrix();
        meas();
      }
      window.addEventListener('resize', fit);
      window.addEventListener('load', () => setTimeout(meas, 300));
      fit();
      setTimeout(meas, 1500);

      let mx = 0;
      let my = 0;
      let turn = 0;
      const cp = K[0].p.clone();
      const cl = K[0].l.clone();
      const tp = new V();
      const tl = new V();
      let fr = 0;

      const onPointerMove = (e: PointerEvent) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('pointermove', onPointerMove);

      const onClick = () => {
        turn = 2.4;
        mi = (mi + 1) % msgs.length;
        bubble(msgs[mi]);
      };
      window.addEventListener('click', onClick);

      const loop = () => {
        rafId = requestAnimationFrame(loop);
        t += reduce ? 0.003 : 0.016;
        fr++;

        const y = window.scrollY;
        let i = 0;
        for (let n = 0; n < ks.length - 1; n++) {
          if (y >= ks[n]) i = n;
        }

        const a = K[i];
        const b = K[Math.min(i + 1, 4)];
        let f = ks[i + 1] > ks[i] ? Math.min(1, Math.max(0, (y - ks[i]) / (ks[i + 1] - ks[i]))) : 0;
        f = f * f * (3 - 2 * f);

        tp.lerpVectors(a.p, b.p, f);
        tl.lerpVectors(a.l, b.l, f);
        tp.x += mx * 0.5;
        tp.y -= my * 0.25;
        tl.x += mx * 0.2;

        cp.lerp(tp, 0.06);
        cl.lerp(tl, 0.06);
        C.position.copy(cp);
        C.lookAt(cl);

        // Head follows cursor; a click makes him turn around to face you
        turn = Math.max(0, turn - 0.016);
        const tgt = turn > 0 ? 0.2 : PI - mx * 1.1;
        const pt = turn > 0 ? my * 0.2 : -my * 0.22;
        head.rotation.y += (tgt - head.rotation.y) * 0.07;
        head.rotation.x += (pt - head.rotation.x) * 0.1;
        dev.rotation.y += ((turn > 0 ? 0 : -mx * 0.12) - dev.rotation.y) * 0.06;
        torso.scale.y = 1 + Math.sin(t * 2) * 0.012;
        sp.material.opacity += ((turn > 0 ? 1 : 0) - sp.material.opacity) * 0.15;

        if (performance.now() - lastKey > 2500 && fr % 7 === 0) {
          press(str[ai++ % str.length]);
        }

        const hue = (t * 0.04) % 1;
        led.material.color.setHSL(hue, 1, 0.55);
        rim.color.setHSL((hue + 0.1) % 1, 1, 0.55);
        sc.intensity = 1.7 + Math.sin(t * 5) * 0.08 + Math.sin(t * 1.3) * 0.1;

        km.forEach((k) => {
          k.p *= 0.86;
          k.m.position.y = 0.15 - 0.045 * k.p;
          k.m.material.emissive.setHSL(k.p > 0.05 ? 0.24 : hue, 1, 0.5);
          k.m.material.emissiveIntensity = 0.35 + k.p * 2.2;
        });

        hands.forEach((h) => {
          const u = h.userData;
          u.dip *= 0.85;
          u.tx += (u.s * 0.75 - u.tx) * 0.02;
          h.position.x += (u.tx - h.position.x) * 0.2;
          h.position.y = 0.34 - u.dip * 0.05 + Math.sin(t * 3 + u.s) * 0.004;
          limb(u.u, u.S, u.E);
          limb(u.f, u.E, h.position);
          u.j.position.copy(u.E);
          u.c.position.copy(h.position).add(u.E.clone().sub(h.position).normalize().multiplyScalar(0.18));
        });

        ms.position.x = 2 + mx * 0.12;
        ms.position.z = 0.95 + my * 0.1;

        if (fr % 3 === 0) drawMain();
        if (fr % 6 === 0) drawSide();

        steam.forEach((s, idx) => {
          const q = (t * 0.4 + idx / 3) % 1;
          s.position.y = 0.5 + q * 0.6;
          s.material.opacity = 0.4 * (1 - q);
        });

        lv.forEach((g, idx) => {
          g.rotation.z = Math.sin(t * 1.2 + idx) * 0.03;
        });

        for (let d = 0; d < N; d++) {
          dp[d * 3 + 1] += 0.0015;
          dp[d * 3] += Math.sin(t + d) * 0.0008;
          if (dp[d * 3 + 1] > 4.5) dp[d * 3 + 1] = 0;
        }
        dg.attributes.position.needsUpdate = true;

        R.render(S, C);
      };

      rafId = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('resize', fit);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('click', onClick);
        R.dispose();
      };
    }

    // -------------------------------------------------------------
    // 2. UI INTERACTIONS, CURSOR, LOADER, SCROLL REVEAL & PARALLAX
    // -------------------------------------------------------------
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Split headings into masked words
    document.querySelectorAll('[data-split]').forEach((el) => {
      const o = parseFloat((el as HTMLElement).dataset.o || '0');
      let i = 0;
      el.innerHTML = (el.textContent || '')
        .split(' ')
        .map((w) => `<span class="w"><i style="--d:${0.15 + (o + i++) * 0.07}s">${w}</i></span>`)
        .join(' ');
    });

    // Loader
    const cnt = document.getElementById('cnt');
    const bar = document.getElementById('bar');
    const log = document.getElementById('log');
    const L = ['> init workspace', '> compile styles', '> hydrate components', '> ready.'];
    const t0 = performance.now();
    const dur = reduce ? 200 : 2300;

    let loaderRaf: number;
    function tick(n: number) {
      const p = Math.min(1, (n - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      if (cnt) cnt.textContent = String(Math.round(e * 100));
      if (bar) bar.style.transform = 'scaleX(' + e + ')';
      if (log) log.textContent = L.slice(0, Math.ceil(e * 4)).join('\n');
      if (p < 1) {
        loaderRaf = requestAnimationFrame(tick);
      } else {
        document.body.classList.add('ready');
        setTimeout(() => {
          const l = document.getElementById('loader');
          if (l) l.remove();
        }, 1500);
      }
    }
    loaderRaf = requestAnimationFrame(tick);

    // Scroll reveal
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.rv, h2').forEach((el) => io.observe(el));

    // Cursor + magnetic + preview
    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 2;
    let cx = curX;
    let cy = curY;
    let px = curX;
    let py = curY;

    const cr = document.getElementById('cr');
    const cd = document.getElementById('cd');
    const pv = document.getElementById('pv');

    const onMouseMove = (e: MouseEvent) => {
      curX = e.clientX;
      curY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    document.querySelectorAll('[data-h]').forEach((el) => {
      el.addEventListener('mouseenter', () => cr?.classList.add('h'));
      el.addEventListener('mouseleave', () => {
        cr?.classList.remove('h');
        (el as HTMLElement).style.transform = '';
      });
    });

    document.querySelectorAll('.mag').forEach((el) => {
      el.addEventListener('mousemove', (e: any) => {
        const b = el.getBoundingClientRect();
        (el as HTMLElement).style.transform =
          'translate(' + (e.clientX - b.left - b.width / 2) * 0.3 + 'px,' + (e.clientY - b.top - b.height / 2) * 0.4 + 'px)';
      });
    });

    document.querySelectorAll('.row').forEach((r: any) => {
      r.addEventListener('mouseenter', () => {
        if (!pv) return;
        pv.style.background = r.dataset.g;
        pv.textContent = r.dataset.t;
        pv.classList.add('on');
      });
      r.addEventListener('mouseleave', () => {
        pv?.classList.remove('on');
      });
    });

    // Copy micro-interaction
    const mailBtn = document.getElementById('mail');
    const handleMailClick = () => {
      const s = document.getElementById('sub');
      try {
        navigator.clipboard.writeText(profile.email || 'royanand729@gmail.com');
        if (s) s.textContent = '✓ copied to clipboard';
      } catch (err) {
        if (s) s.textContent = 'press Ctrl+C after selecting';
      }
      setTimeout(() => {
        if (s) s.textContent = 'click to copy · replace with your email';
      }, 2200);
    };
    mailBtn?.addEventListener('click', handleMailClick);

    // Parallax + loop
    let sy = 0;
    const onScroll = () => {
      sy = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let cursorRaf: number;
    const ps = Array.from(document.querySelectorAll<HTMLElement>('[data-p]'));
    const prog = document.getElementById('prog');

    const cursorLoop = () => {
      cursorRaf = requestAnimationFrame(cursorLoop);
      cx += (curX - cx) * 0.2;
      cy += (curY - cy) * 0.2;
      px += (curX - px) * 0.1;
      py += (curY - py) * 0.1;

      if (cd) cd.style.transform = 'translate(' + (curX - 4) + 'px,' + (curY - 4) + 'px)';
      if (cr) cr.style.transform = 'translate(' + (cx - cr.offsetWidth / 2) + 'px,' + (cy - cr.offsetHeight / 2) + 'px)';

      const vx = curX - px;
      if (pv) {
        pv.style.transform =
          'translate(' + (px + 24) + 'px,' + (py - 90) + 'px) rotate(' + Math.max(-14, Math.min(14, vx * 0.12)) + 'deg)';
      }

      const h = Math.min(1, sy / window.innerHeight);
      document.documentElement.style.setProperty('--gap', 90 + h * 130 + 'px');

      ps.forEach((el) => {
        const pVal = parseFloat(el.dataset.p || '0');
        el.style.transform = el.hasAttribute('data-x') ? 'translateX(' + sy * pVal * 3 + 'px)' : 'translateY(' + sy * pVal + 'px)';
      });

      if (prog) {
        prog.style.transform = 'scaleX(' + sy / Math.max(1, document.body.scrollHeight - window.innerHeight) + ')';
      }
    };
    cursorLoop();

    cleanupUI = () => {
      cancelAnimationFrame(loaderRaf);
      cancelAnimationFrame(cursorRaf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      mailBtn?.removeEventListener('click', handleMailClick);
      io.disconnect();
    };

    return () => {
      isCancelled = true;
      if (cleanupThree) cleanupThree();
      if (cleanupUI) cleanupUI();
    };
  }, []);

  return (
    <>
      <canvas id="dev" ref={canvasRef} />
      <div id="vig" />

      <div id="loader">
        <div className="pn top" />
        <div className="pn bot" />
        <div className="in mono">
          <div id="cnt">0</div>
          <div className="barw">
            <div id="bar" />
          </div>
          <div id="log" />
        </div>
      </div>

      <div id="cd" />
      <div id="cr" />
      <div id="prog" />
      <div id="pv" />

      <nav className="mono">
        <Link className="back-btn" href="/">
          &lt;ND /&gt;
        </Link>
        <div>
          <a href="#work">work</a>
          <a href="#log">log</a>
          <a href="#stack">stack</a>
          <a href="#contact">contact</a>
          <Link href="/clouds" style={{ color: 'var(--ac)', marginLeft: '24px' }}>
            above the clouds ↗
          </Link>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="big mono" data-p="-.12" data-x="true">
          FRONTEND
        </div>
        <div>
          <span className="lbl mono rv">// frontend developer · react · next.js</span>
          <h1>
            <span data-split="true">I build interfaces</span>
            <br />
            <span className="a" data-split="true" data-o="6">
              that feel alive.
            </span>
          </h1>
          <p className="rv" style={{ '--d': '.8s' } as React.CSSProperties}>
            I’m Nityanand, a developer who cares about the three layers of every great UI: solid structure, expressive style and playful behaviour.
          </p>
          <div className="rv" style={{ '--d': '1s' } as React.CSSProperties}>
            <a className="btn p mag" data-h="true" href="#work">
              <span>See the work</span>
            </a>
            <a className="btn g mag" data-h="true" href="#contact">
              <span>Say hello</span>
            </a>
          </div>
        </div>
        <div className="hint mono" style={{ bottom: '22px' }}>
          move your mouse, he looks where you look · click to make him turn around · scroll to move the camera
        </div>
      </section>

      <div className="mq" aria-hidden="true">
        <div>
          <span>React</span>
          <span>Next.js</span>
          <span>TypeScript</span>
          <span>Tailwind</span>
          <span>Redux Toolkit</span>
          <span>TanStack Query</span>
          <span>Node.js</span>
          <span>React</span>
          <span>Next.js</span>
          <span>TypeScript</span>
          <span>Tailwind</span>
          <span>Redux Toolkit</span>
          <span>TanStack Query</span>
          <span>Node.js</span>
        </div>
      </div>

      <section id="work">
        <span className="lbl mono rv">// 01 components</span>
        <h2 data-split="true">
          Selected <em>work</em>
        </h2>
        <div className="rv">
          <a className="row" data-h="true" data-g="linear-gradient(135deg,#7c5cff,#22d3ee)" data-t="Streaming UI" href="#contact">
            <small className="mono">01</small>
            <h3>Streaming UI</h3>
            <small className="mono">Angular · CSS · 2026</small>
          </a>
          <a className="row" data-h="true" data-g="linear-gradient(135deg,#ff5c8a,#ffb86b)" data-t="Admin Dashboard" href="#contact">
            <small className="mono">02</small>
            <h3>Admin Dashboard</h3>
            <small className="mono">React · Redux Toolkit</small>
          </a>
          <a className="row" data-h="true" data-g="linear-gradient(135deg,#0ea5a4,#84cc16)" data-t="Next.js Storefront" href="#contact">
            <small className="mono">03</small>
            <h3>Next.js Storefront</h3>
            <small className="mono">Next.js · Tailwind</small>
          </a>
          <a className="row" data-h="true" data-g="linear-gradient(135deg,#f97316,#ef4444)" data-t="Creative Portfolio" href="#contact">
            <small className="mono">04</small>
            <h3>Creative Portfolio</h3>
            <small className="mono">HTML · CSS · JS</small>
          </a>
        </div>
        <p className="sub mono rv">Sample projects, replace with your real ones. Hover a row.</p>
      </section>

      <section id="log">
        <span className="lbl mono rv">// 02 git log</span>
        <h2 data-split="true">
          My <em>commit</em> history
        </h2>
        <div className="log">
          <div className="cm mono rv">
            <code>a3f9c21</code>
            <span>feat: React Developer @ TechGropse Pvt. Ltd.</span>
            <span>Sep 2025 → now</span>
          </div>
          <div className="cm mono rv" style={{ '--d': '.1s' } as React.CSSProperties}>
            <code>7bd41e8</code>
            <span>feat: Software Developer @ Blitz Learning Technologies</span>
            <span>Jun 2024 → Sep 2025</span>
          </div>
          <div className="cm mono rv" style={{ '--d': '.2s' } as React.CSSProperties}>
            <code>c19e0a4</code>
            <span>init: Web Dev Intern @ IFORTIS WORLDWIDE</span>
            <span>Aug 2023 → Feb 2024</span>
          </div>
          <div className="cm mono rv" style={{ '--d': '.3s' } as React.CSSProperties}>
            <code>02aa7f3</code>
            <span>docs: B.E. Computer Science, Chandigarh University</span>
            <span>2021 → 2025</span>
          </div>
        </div>
      </section>

      <section id="stack">
        <span className="lbl mono rv">// 03 dependencies</span>
        <h2 data-split="true">
          Tools I <em>reach for</em>
        </h2>
        <div className="chips rv">
          <span className="chip">React.js</span>
          <span className="chip">Next.js</span>
          <span className="chip">TypeScript</span>
          <span className="chip">Node.js</span>
          <span className="chip">Express.js</span>
          <span className="chip">Redux Toolkit</span>
          <span className="chip">TanStack Query</span>
          <span className="chip">Tailwind CSS</span>
          <span className="chip">AngularJS</span>
          <span className="chip">React Native</span>
          <span className="chip">Python</span>
          <span className="chip">MySQL</span>
        </div>
      </section>

      <section className="ct" id="contact">
        <span className="lbl mono rv">// 04 deploy</span>
        <h2 data-split="true" style={{ marginBottom: '24px' }}>
          Have an idea? <em>Ship it</em> with me.
        </h2>
        <button className="mail mag rv" data-h="true" id="mail">
          {profile.email || 'royanand729@gmail.com'}
        </button>
        <div className="sub mono" id="sub">
          click to copy · replace with your email
        </div>
      </section>
    </>
  );
}

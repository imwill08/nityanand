'use client';
import Image from 'next/image';
import { AppMockup } from './Icons';
import { jobs, skills } from '@/lib/data';

export default function Hero({ onMenu, expanded }: { onMenu: () => void; expanded: boolean }) {
  return (
    <header className="hero" id="home">
      <div className="ghost" aria-hidden="true">NITYANAND</div>

      <nav id="nav" aria-label="Main">
        <a className="logo" href="#home">Portfolio®</a>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work <sup>({jobs.length})</sup></a></li>
          <li><a href="#skills">Skills <sup>({skills.length})</sup></a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a
          href="/Nityanand_frontend_dev.pdf"
          download="Nityanand_frontend_dev.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-cv-btn"
        >
          Download CV ↓
        </a>
        <button className="burger" aria-label="Open menu" aria-expanded={expanded} onClick={onMenu}>
          <i /><i />
        </button>
      </nav>

      <p className="tag">I build responsive, scalable web apps with React and Next.js that are clean, fast and reliable.</p>

      <div className="photo">
        <Image src="/nityanand.webp" alt="Nityanand smiling" width={680} height={667} priority unoptimized />
      </div>

      <a className="polaroid" href="#work" aria-label="See my work">
        <div className="pic"><AppMockup /></div>
        <b>TechGropse</b> /Web Apps
      </a>

      <div className="bigname"><small>©2026</small><h1>Nityanand</h1></div>

      <a className="talk" href="#contact">
        <div className="av" role="img" aria-label="Nityanand" />
        <div><span>Let’s talk</span><strong>Nityanand</strong><span>React Developer</span></div>
        <div className="go" aria-hidden="true">↗</div>
      </a>
    </header>
  );
}

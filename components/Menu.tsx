'use client';
import { profile } from '@/lib/data';

const items = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Work', '#work'],
  ['Skills', '#skills'],
  ['Certificates', '#certs'],
  ['Contact', '#contact'],
  ['Creative 3D Desk ↗', '/creative'],
  ['Above the Clouds ↗', '/clouds'],
];

export default function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div id="menu" className={open ? 'on' : ''} role="dialog" aria-label="Menu" aria-modal="true" aria-hidden={!open}>
      <button className="x" aria-label="Close menu" onClick={onClose}>
        ✕
      </button>
      <ul>
        {items.map(([label, href]) => (
          <li key={href}>
            <a href={href} onClick={onClose}>
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="menu-cv-box">
        <a
          href={profile.resume}
          download="Nityanand_frontend_dev.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="menu-cv-btn"
          onClick={onClose}
        >
          Download CV / Resume (PDF) ↓
        </a>
      </div>
      <dl>
        <dt>Email</dt>
        <dd>{profile.email}</dd>
        <dt>Phone</dt>
        <dd>{profile.phone}</dd>
        <dt>Role</dt>
        <dd>React Developer · Frontend Developer</dd>
      </dl>
    </div>
  );
}

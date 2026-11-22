import type { CertIconName } from '@/lib/data';

export function CertIcon({ name }: { name: CertIconName }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      {name === 'angular' && (
        <>
          <path d="M24 5 7 11l2.6 22L24 43l14.4-10L41 11z" />
          <path d="M24 15 17 31m7-16 7 16m-11-5h8" />
        </>
      )}
      {name === 'ts' && (
        <>
          <rect x="7" y="7" width="34" height="34" rx="7" />
          <text x="24" y="30" textAnchor="middle" fontSize="15" fontWeight="800" fontFamily="Archivo, Arial, sans-serif" fill="currentColor" stroke="none">
            TS
          </text>
        </>
      )}
      {name === 'code' && <path d="M17 14 7 24l10 10M31 14l10 10-10 10M27 10l-6 28" />}
      {name === 'braces' && (
        <path d="M18 9c-5 0-5 3-5 7s0 6-4 8c4 2 4 4 4 8s0 7 5 7M30 9c5 0 5 3 5 7s0 6 4 8c-4 2-4 4-4 8s0 7-5 7" />
      )}
      {name === 'atom' && (
        <>
          <ellipse cx="24" cy="24" rx="17" ry="7" />
          <ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(60 24 24)" />
          <ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(120 24 24)" />
          <circle cx="24" cy="24" r="2.5" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

/** Small web-app illustration used inside the hero polaroid. */
export function AppMockup() {
  return (
    <svg viewBox="0 0 140 140" width="100%" height="100%" aria-hidden="true">
      <rect width="140" height="140" fill="#1f25b8" />
      <circle cx="118" cy="20" r="34" fill="#3a45f0" opacity=".55" />
      <rect x="14" y="20" width="112" height="102" rx="7" fill="#f3f0e6" />
      <circle cx="24" cy="30" r="2.4" fill="#1f25b8" />
      <circle cx="31" cy="30" r="2.4" fill="#1f25b8" opacity=".6" />
      <circle cx="38" cy="30" r="2.4" fill="#1f25b8" opacity=".3" />
      <rect x="20" y="42" width="22" height="74" rx="4" fill="#e4dfcd" />
      <rect x="24" y="48" width="14" height="3" rx="1.5" fill="#14176e" />
      <rect x="24" y="56" width="10" height="3" rx="1.5" fill="#14176e" opacity=".45" />
      <rect x="24" y="64" width="12" height="3" rx="1.5" fill="#14176e" opacity=".45" />
      <rect x="50" y="42" width="46" height="7" rx="3.5" fill="#14176e" />
      <rect x="102" y="41" width="18" height="9" rx="4.5" fill="#e6f52c" />
      <rect x="50" y="54" width="70" height="3" rx="1.5" fill="#14176e" opacity=".3" />
      <rect x="50" y="64" width="34" height="22" rx="4" fill="#fff" />
      <rect x="90" y="64" width="30" height="22" rx="4" fill="#14176e" />
      <path d="M50 114l12-12 12 6 14-16 14 6 18-16" fill="none" stroke="#1f25b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="120" cy="82" r="3.6" fill="#e6f52c" stroke="#1f25b8" strokeWidth="1.6" />
    </svg>
  );
}

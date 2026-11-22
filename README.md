# Nityanand – Portfolio (Next.js)

Next.js 14 (App Router) + TypeScript. No UI libraries, plain CSS in `app/globals.css`.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Edit your content
- `lib/data.ts` – name, contact details, social links (replace the `#` placeholders), jobs, skills, certificates
- `components/Sections.tsx` – section layout and copy
- `public/nityanand.webp` – hero photo (transparent background works best)
- `app/globals.css` – colours are CSS variables at the top (`--orange` is the cobalt blue, `--lime` is the accent)

## Structure
- `components/Shell.tsx` – client wrapper (fullscreen menu + scroll effects)
- `hooks/useScrollEffects.ts` – hero parallax, blur-to-sharp headings, reveals, count-up numbers
- `components/Hero.tsx`, `Menu.tsx`, `ContactForm.tsx` – client components; the rest are server components

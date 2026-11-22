export const profile = {
  name: 'Nityanand',
  email: 'royanand729@gmail.com',
  phone: '+91 98375 06732',
  resume: '/Nityanand_frontend_dev.pdf',
  links: [
    { label: 'Download Resume (PDF) ↓', href: '/Nityanand_frontend_dev.pdf', download: true },
    { label: 'Creative 3D Portfolio ↗', href: '/creative' },
    { label: 'Above the Clouds (3D Flight) ↗', href: '/clouds' },
    { label: 'LinkedIn', href: '#' },
    { label: 'GitHub', href: '#' },
  ],
};

export const stack = ['React.js', 'Next.js', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS'];

export const jobs = [
  {
    when: 'Sep 2025 – Present',
    company: 'TechGropse Pvt. Ltd.',
    role: 'React Developer',
    text: 'Develop and maintain responsive frontend applications across multiple business domains. Turn business and design requirements into reusable React components, manage application state, build dynamic forms and workflows, and integrate REST APIs and third-party services. Work with designers, backend developers and QA, and contribute to code reviews, debugging and performance improvements.',
  },
  {
    when: 'Jun 2024 – Sep 2025',
    company: 'Blitz Learning Technologies',
    role: 'Software Developer',
    text: 'Built frontend interfaces for company websites, HRMS platforms and internal business apps with Next.js and JavaScript. Converted functional requirements into responsive screens and reusable UI components, and integrated backend APIs for employee records, attendance, leave management and admin workflows.',
  },
];

export const skills = [
  { title: 'Frontend', items: ['React.js', 'Next.js', 'React Native', 'Angular Fundamentals', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Material UI'] },
  { title: 'React & UI', items: ['Hooks', 'Reusable components', 'React Router', 'App Router', 'SSR', 'CSR', 'Cross-browser'] },
  { title: 'State management', items: ['Redux Toolkit', 'React-Redux', 'Context API', 'Zustand', 'Jotai', 'TanStack Query'] },
  { title: 'API integration', items: ['REST', 'Axios', 'Fetch', 'Interceptors', 'JWT auth', 'Protected routes', 'File upload', 'WebSockets'] },
  { title: 'UI performance', items: ['Memoization', 'Lazy loading', 'Code splitting', 'Debouncing', 'Throttling', 'Scroll animations'] },
  { title: 'Tools & platforms', items: ['Git', 'GitHub', 'Postman', 'Docker', 'Firebase', 'Google Maps API', 'Gemini API', 'Razorpay', 'Stripe'] },
  { title: 'Databases', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase'] },
  { title: 'AI-assisted development', items: ['GitHub Copilot', 'Cursor', 'Claude', 'Kiro AI', 'Google Antigravity', 'Prompt engineering'] },
];

export type CertIconName = 'angular' | 'ts' | 'code' | 'braces' | 'atom';

export interface CertItem {
  icon: CertIconName;
  title: string;
  meta: string;
  file: string;
}

export const certs: CertItem[] = [
  {
    icon: 'angular',
    title: 'Angular',
    meta: 'Infosys Springboard · Oct 2022',
    file: '/1-0e7c1eb8-2f2a-4507-b861-d0df92c5ade7.pdf',
  },
  {
    icon: 'ts',
    title: 'TypeScript Essentials',
    meta: 'Infosys Springboard · Oct 2022',
    file: '/1-77043ce1-c793-4f7c-92aa-d9c658618b71.pdf',
  },
  {
    icon: 'code',
    title: 'HTML, CSS and JavaScript for Web Developers',
    meta: 'Johns Hopkins University (Coursera) · Apr 2022',
    file: '/html css js coursera certificate nityanand.pdf',
  },
  {
    icon: 'braces',
    title: 'Python Functions, Files and Dictionaries',
    meta: 'University of Michigan (Coursera) · Apr 2022',
    file: '/Coursera python.pdf',
  },
  {
    icon: 'atom',
    title: 'React Native Fundamentals',
    meta: 'Alison (CPD Certified)',
    file: '/Alison_Advanced_Certificate-5664-61583185.pdf',
  },
];

export const profile = {
  name: 'Nityanand',
  email: 'royanand729@gmail.com',
  phone: '+91 98375 06732',
  resume: '/Nityanand_frontend_dev.pdf',
  links: [
    { label: 'Download ↓', href: '/Nityanand_frontend_dev.pdf', download: true },
    // { label: 'Creative 3D Portfolio ↗', href: '/creative' },
    // { label: 'Above the Clouds (3D Flight) ↗', href: '/clouds' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nityanand-ba65bb1b7/' },
    { label: 'GitHub', href: 'https://github.com/imwill08' },
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
  preview: string;
}

export const certs: CertItem[] = [
  {
    icon: 'angular',
    title: 'Angular',
    meta: 'Infosys Springboard · Oct 2022',
    file: '/1-0e7c1eb8-2f2a-4507-b861-d0df92c5ade7.pdf',
    preview: '/certs/angular.png',
  },
  {
    icon: 'ts',
    title: 'TypeScript Essentials',
    meta: 'Infosys Springboard · Oct 2022',
    file: '/1-77043ce1-c793-4f7c-92aa-d9c658618b71.pdf',
    preview: '/certs/typescript.png',
  },
  {
    icon: 'code',
    title: 'HTML, CSS and JavaScript for Web Developers',
    meta: 'Johns Hopkins University (Coursera) · Apr 2022',
    file: '/html css js coursera certificate nityanand.pdf',
    preview: '/certs/html-css-js.png',
  },
  {
    icon: 'braces',
    title: 'Python Functions, Files and Dictionaries',
    meta: 'University of Michigan (Coursera) · Apr 2022',
    file: '/Coursera python.pdf',
    preview: '/certs/python.png',
  },
  {
    icon: 'atom',
    title: 'React Native Fundamentals',
    meta: 'Alison (CPD Certified)',
    file: '/Alison_Advanced_Certificate-5664-61583185.pdf',
    preview: '/certs/react-native.png',
  },
];

export interface DomainItem {
  num: string;
  tag: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
}

export const domains: DomainItem[] = [
  {
    num: '01',
    tag: 'Culinary & Operations',
    title: 'FoodTech & Restaurant Management',
    description:
      'End-to-end dining portals, real-time kitchen and order queues, digital menus, and multi-outlet restaurant analytics built for speed.',
    highlights: ['Live Order Queues', 'Menu & POS UI', 'Outlet Dashboards'],
    image: '/domains/foodtech.jpg',
  },
  {
    num: '02',
    tag: 'Experiences & Stays',
    title: 'TravelTech & Hospitality',
    description:
      'Refined discovery and itinerary platforms, property availability engines, and responsive guest booking journeys across regions.',
    highlights: ['Stay Discovery', 'Itinerary Flows', 'Guest Portals'],
    image: '/domains/traveltech.jpg',
  },
  {
    num: '03',
    tag: 'Payments & Ledger',
    title: 'FinTech & Digital Wallet Management',
    description:
      'High-trust wallet interfaces, transaction ledgers, Razorpay and Stripe checkout flows, and secure JWT-authenticated dashboards.',
    highlights: ['Wallet Ledgers', 'Payment Gateways', 'Secure Auth'],
    image: '/domains/fintech.jpg',
  },
  {
    num: '04',
    tag: 'Spaces & Listings',
    title: 'Real Estate & PropTech',
    description:
      'Interactive property marketplaces, map-driven search filters, virtual listing galleries, and lead-capture workflows for buyers and brokers.',
    highlights: ['Map Search', 'Listing Galleries', 'Broker CRM'],
    image: '/domains/proptech.jpg',
  },
  {
    num: '05',
    tag: 'Fulfillment & Hardware',
    title: 'Logistics & Smart Locker Management',
    description:
      'Live shipment tracking boards, smart-locker bay allocation consoles, dispatch states, and automated pickup verification UIs.',
    highlights: ['Locker Telemetry', 'Dispatch Tracking', 'Bay Controls'],
    image: '/domains/logistics.jpg',
  },
  {
    num: '06',
    tag: 'Fleet & Transit',
    title: 'Automotive & Mobility Solutions',
    description:
      'Modern vehicle catalogs, fleet telemetry dashboards, route & map integrations, and seamless service booking interfaces.',
    highlights: ['Fleet Dashboards', 'Maps & Routing', 'Service Portals'],
    image: '/domains/automotive.jpg',
  },
  {
    num: '07',
    tag: 'Wellness & Care',
    title: 'HealthTech & Fitness Management',
    description:
      'Member wellness portals, workout and progress trackers, trainer scheduling, and accessible patient-first web interfaces.',
    highlights: ['Progress Tracking', 'Member Portals', 'Care Workflows'],
    image: '/domains/healthtech.jpg',
  },
  {
    num: '08',
    tag: 'Scheduling & Concierge',
    title: 'Booking & Appointment Management',
    description:
      'Real-time slot engines, calendar availability matrices, automated reminders, and frictionless multi-step reservation flows.',
    highlights: ['Slot Calendars', 'Instant Booking', 'Rescheduling UI'],
    image: '/domains/booking.jpg',
  },
  {
    num: '09',
    tag: 'People & Culture',
    title: 'HRTech & Workforce Management',
    description:
      'Comprehensive HRMS suites covering employee records, attendance logs, leave approvals, payroll views, and role-based admin panels.',
    highlights: ['HRMS Suites', 'Attendance & Leave', 'Admin Roles'],
    image: '/domains/hrtech.jpg',
  },
  {
    num: '10',
    tag: 'Scale & Systems',
    title: 'Enterprise SaaS & Business Management',
    description:
      'Modular multi-tenant dashboards, complex form workflows, REST API integrations, and scalable design systems engineered to last.',
    highlights: ['Multi-Tenant UI', 'Workflow Engines', 'Design Systems'],
    image: '/domains/enterprise.jpg',
  },
];

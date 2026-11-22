import Shell from '@/components/Shell';
import { Strip, About, Work, Skills, Certs, Contact, Footer } from '@/components/Sections';

export default function Home() {
  return (
    <Shell>
      <Strip />
      <About />
      <Work />
      <Skills />
      <Certs />
      <Contact />
      <Footer />
    </Shell>
  );
}

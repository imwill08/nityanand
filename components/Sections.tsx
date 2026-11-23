import { Title } from './Title';
import { ContactForm } from './ContactForm';
import { CertsList } from './CertsSection';
import { DomainsSection } from './DomainsSection';
import { certs, jobs, profile, skills, stack } from '@/lib/data';

export function Strip() {
  return (
    <div className="strip" aria-label="Core stack">
      <p>Built with a modern stack</p>
      <ul>{stack.map((s) => <li key={s}>{s}</li>)}</ul>
    </div>
  );
}

export function About() {
  return (
    <section className="s" id="about">
      <span className="chip">Better web experiences</span>
      <Title lead="My impact through" muted="clean frontend code" />
      <div className="impact">
        <div className="stat rv"><small>Experience</small><b data-count>3+</b><p>Years building responsive, scalable web applications.</p></div>
        <div className="stat rv"><small>Companies</small><b data-count>2</b><p>TechGropse and Blitz Learning Technologies, plus an earlier internship.</p></div>
        <div className="summary rv">
          <div className="sface" role="img" aria-label="Portrait of Nityanand" />
          <h3>Frontend Developer</h3>
          <p>Reusable components, state management, UI performance and REST API integration, with a focus on maintainable code and reliable user experiences.</p>
        </div>
        <div className="stat rv"><small>Certifications</small><b data-count>{certs.length}</b><p>Angular, TypeScript, React Native, Python and web fundamentals.</p></div>
        <div className="stat domc rv">
          <small>Domains</small>
          <b className="dom">Frontend Development &amp; Web Engineering</b>
          <p>Building scalable, responsive web applications using React.js, Next.js, JavaScript, and TypeScript, with expertise in UI development, state management, and backend API integration.</p>
        </div>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <section className="s" id="work" style={{ paddingTop: 8 }}>
      <span className="chip">Career journey</span>
      <Title lead="Where I’ve" muted="shipped" />
      <div style={{ marginTop: 36 }}>
        {jobs.map((j) => (
          <article className="job rv" key={j.company}>
            <div className="when">{j.when}</div>
            <div>
              <h3>{j.company}</h3>
              <em>{j.role}</em>
              <p>{j.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="edu">
        <b>B.E. in Computer Science Engineering</b><br />
        Chandigarh University, Punjab (2020 – 2024)
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="s" id="skills" style={{ paddingTop: 8 }}>
      <span className="chip">Toolkit</span>
      <Title lead="What I" muted="work with" />
      <div className="grid">
        {skills.map((g) => (
          <div className="sk rv" key={g.title}>
            <h3>{g.title}</h3>
            <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Certs() {
  return (
    <section className="s dark" id="certs">
      {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
        <span className="chip" style={{ background: '#222', color: '#999', margin: 0 }}>Certifications</span>
        <a
          href={profile.resume}
          download="Nityanand_frontend_dev.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="cv-badge-btn"
        >
          Download CV (PDF) ↓
        </a>
      </div> */}
      <Title lead="Always" muted="learning" />
      <CertsList />
    </section>
  );
}

export function Domains() {
  return <DomainsSection />;
}

export function Contact() {
  return (
    <section className="s contact" id="contact">
      <span className="chip">Ready to start?</span>
      <h2>Contact me</h2>
      <div className="cwrap">
        <div>
          <h3 style={{ fontSize: 'clamp(28px,4vw,48px)', textTransform: 'uppercase', marginBottom: 22 }}>Get in<br />touch</h3>
          <div className="info">
            <div className="rv"><span>Email</span><b>{profile.email}</b></div>
            <div className="rv"><span>Phone</span><b>{profile.phone}</b></div>
            <div className="rv"><span>Role</span><b>React Developer · Frontend Developer</b></div>
            <div className="rv"><span>Based in</span><b>India</b></div>
          </div>
          <div className="links">
            {profile.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.download
                  ? { download: 'Nityanand_frontend_dev.pdf', target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="formbox rv"><ContactForm /></div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <span>©2026 Nityanand</span>
      <span>React · Next.js · TypeScript</span>
    </footer>
  );
}

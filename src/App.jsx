import React, { useState } from "react";
import { campaignSections } from "./data/sectionPoints";

const testimonialLinks = [
  { label: "Coach Endorsement", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { label: "Club Committee Review", url: "https://www.youtube.com/watch?v=sTJ7AzBIJoI" },
  { label: "Team Member Statement", url: "https://www.youtube.com/watch?v=astISOttCQ0" }
];

const footerLinks = [
  { label: "Privacy Policy", url: "https://www.youtube.com/watch?v=iV2ViNJFZC8" },
  { label: "About The Campaign", url: "https://www.youtube.com/watch?v=iV2ViNJFZC8" },
  { label: "Terms of Use", url: "https://www.youtube.com/watch?v=iV2ViNJFZC8" },
  { label: "Contact Us", url: "https://www.youtube.com/watch?v=iV2ViNJFZC8" },
  { label: "Offer a Bribe", url: "mailto:milan.erdos@durham.ac.uk" }
];

const navLinks = [
  { id: "bio", label: "Bio" },
  ...campaignSections.map((section) => ({ id: section.id, label: section.title })),
  { id: "testimonials", label: "Testimonials" }
];

function withJpegFallback(src) {
  if (src.endsWith(".jpg")) {
    return [src, src.replace(/\.jpg$/i, ".jpeg")];
  }

  if (src.endsWith(".jpeg")) {
    return [src, src.replace(/\.jpeg$/i, ".jpg")];
  }

  return [src];
}

function ResilientImage({ className, src, alt }) {
  const candidates = withJpegFallback(src);

  const handleError = (event) => {
    const currentIndex = Number(event.currentTarget.dataset.idx || 0);
    const nextIndex = currentIndex + 1;

    if (nextIndex < candidates.length) {
      event.currentTarget.dataset.idx = String(nextIndex);
      event.currentTarget.src = candidates[nextIndex];
    }
  };

  return <img className={className} src={candidates[0]} alt={alt} onError={handleError} data-idx="0" />;
}

function SeparatorImage({ src, alt }) {
  return (
    <div className="separator-wrap" aria-hidden="true">
      <ResilientImage className="separator-image" src={src} alt={alt} />
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button
        className="nav-toggle"
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <span className="nav-toggle-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="nav-toggle-label">Menu</span>
      </button>

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`} aria-label="Section navigation">
        <div className="sidebar-header">
          <p className="sidebar-kicker">Campaign Navigation</p>
          <h2>Jump To Section</h2>
          <button
            className="sidebar-close"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsSidebarOpen(false)}
          >
            Close
          </button>
        </div>
        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={() => setIsSidebarOpen(false)}>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <button
        type="button"
        className={`sidebar-backdrop ${isSidebarOpen ? "open" : ""}`}
        aria-label="Close navigation"
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className="page-shell" id="top">
        <header className="hero section-card">
          <p className="hero-badge">Durham University Canoe Club Captaincy</p>
          <p className="eyebrow">2026 Candidate</p>
          <h1>Milan for Captain</h1>
          <p className="tagline">A serious candidate for serious times.</p>
          <p className="hero-supporting">
            Focused leadership, clear direction, and a practical plan to strengthen DUCCC on and off the water.
          </p>
          <div className="hero-actions">
            <a className="hero-action" href="#policies">Read Policies</a>
            <a className="hero-action secondary" href="#experience">View Experience</a>
          </div>
        </header>

        <section className="bio section-card" id="bio">
          <div className="bio-image-wrap">
            <ResilientImage
              className="bio-image"
              src="/images/pfp.jpg"
              alt="Milan campaign portrait"
            />
          </div>
          <div className="bio-copy">
            <h2>About Me</h2>
            <p>
              Hi! I am a Castle Physics and Astronomy student running for Durham University Canoe Club Captain (DUCCC).
            </p>
            <p>
              Why am I running for DUCCC? To be honest, because it seems like the coolest graduate job. For a while I have thought about whether to seek employment as a Venezuelan government official or as the CEO of Fifa.
            </p>
            <p>
              First Proposer: Enego Comley <br/>
              Second Proposer: Charlotte Chow <br/>
              Third Proposer: Bio Smitasiri <br/>
              Fourth Proposer: Noah Coombe
            </p>
          </div>
        </section>

        {campaignSections.map((section) => (
          <div key={section.id}>
            <SeparatorImage src={section.image} alt={`${section.title} visual`} />
            <section className="section-card content-section" id={section.id}>
              <h2>{section.title}</h2>
              <ul>
                {section.points.map((point, index) => (
                  <li key={`${section.id}-${index}`}>{point}</li>
                ))}
              </ul>
            </section>
          </div>
        ))}

        <section className="section-card testimonials" id="testimonials">
          <h2>Testimonials</h2>
          <div className="testimonial-buttons">
            {testimonialLinks.map((item) => (
              <a key={item.label} className="testimonial-button" href={item.url} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-copy">Milan For Captain Campaign</p>
          <nav className="footer-links" aria-label="Footer links">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.url}>{link.label}</a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}

export default App;

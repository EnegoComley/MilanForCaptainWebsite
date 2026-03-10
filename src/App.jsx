import React, { useEffect, useMemo, useState } from "react";
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

const socialLinks = [
  { label: "Instagram", url: "https://www.instagram.com/" },
  { label: "YouTube", url: "https://www.youtube.com/" }
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

function splitPoint(point, sectionId) {
  if (typeof point === "object" && point !== null) {
    const body = point.text ?? point.body ?? "";
    return {
      heading: sectionId === "policies" ? point.title ?? "" : "",
      body
    };
  }

  return {
    heading: "",
    body: String(point)
  };
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
    <div className="separator-wrap reveal" aria-hidden="true">
      <ResilientImage className="separator-image" src={src} alt={alt} />
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  const navLinks = useMemo(
    () => [
      { id: "top", label: "Home" },
      { id: "bio", label: "Bio" },
      ...campaignSections.map((section) => ({ id: section.id, label: section.title })),
      { id: "testimonials", label: "Testimonials" }
    ],
    []
  );

  useEffect(() => {
    const ids = navLinks.map((item) => item.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element) => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0.05
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navLinks]);

  useEffect(() => {
    const revealNodes = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));

    return () => revealObserver.disconnect();
  }, []);

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
            <a
              key={link.id}
              className={activeSection === link.id ? "active" : ""}
              href={`#${link.id}`}
              onClick={() => setIsSidebarOpen(false)}
            >
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

      <a className="sticky-vote" href="#testimonials">Vote Milan</a>

      <div className="page-shell" id="top">
        <header className="hero section-card reveal">
          <div className="hero-layout">
            <div className="hero-copy">
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
            </div>
            <div className="hero-media">
              <ResilientImage className="hero-portrait" src="/images/pfp.jpg" alt="Milan campaign portrait" />
              <div className="hero-stats">
                <article>
                  <p className="hero-stat-value">4</p>
                  <p className="hero-stat-label">Proposers</p>
                </article>
                <article>
                  <p className="hero-stat-value">3+</p>
                  <p className="hero-stat-label">Years Paddling</p>
                </article>
                <article>
                  <p className="hero-stat-value">1</p>
                  <p className="hero-stat-label">Clear Choice</p>
                </article>
              </div>
            </div>
          </div>
        </header>

        <section className="bio section-card reveal" id="bio">
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

        {campaignSections.map((section, sectionIndex) => (
          <div key={section.id}>
            <SeparatorImage src={section.image} alt={`${section.title} visual`} />
            <section
              className={`section-card content-section reveal ${sectionIndex % 2 === 1 ? "content-section-alt" : ""}`}
              id={section.id}
            >
              <h2>{section.title}</h2>
              <div className="points-grid">
                {section.points.map((point, index) => {
                  const parsed = splitPoint(point, section.id);
                  return (
                    <article key={`${section.id}-${index}`} className="point-card">
                      <p className="point-index">{String(index + 1).padStart(2, "0")}</p>
                      {parsed.heading ? <h3>{parsed.heading}</h3> : null}
                      <p>{parsed.body}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        ))}

        <section className="section-card testimonials reveal" id="testimonials">
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
          <div className="footer-brand">
            <p className="footer-copy">Milan For Captain Campaign</p>
            <p className="footer-subcopy">Durham University Canoe Club • 2026 Campaign</p>
          </div>
          <div className="footer-right">
            <nav className="footer-social" aria-label="Social links">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.url}>{link.label}</a>
              ))}
            </nav>
            <nav className="footer-links" aria-label="Footer links">
              {footerLinks.map((link) => (
                <a key={link.label} href={link.url}>{link.label}</a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;

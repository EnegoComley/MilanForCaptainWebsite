import React, { useEffect, useMemo, useState } from "react";
import { campaignSections } from "./data/sectionPoints";

const testimonialLinks = [
  {
    label: "Coach Endorsement",
    subtitle: "From senior coaching staff",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    label: "Club Committee Review",
    subtitle: "From current committee members",
    url: "https://www.youtube.com/watch?v=sTJ7AzBIJoI"
  },
  {
    label: "Team Member Statement",
    subtitle: "From competitive paddlers",
    url: "https://www.youtube.com/watch?v=astISOttCQ0"
  }
];

const footerLinks = [
  { label: "Privacy Policy", url: "https://www.youtube.com/watch?v=iV2ViNJFZC8" },
  { label: "About The Campaign", url: "https://www.youtube.com/watch?v=iV2ViNJFZC8" },
  { label: "Offer a Bribe", url: "mailto:milan.erdos@durham.ac.uk" },
  { label: "Terms of Use", url: "https://www.youtube.com/watch?v=iV2ViNJFZC8" },
  { label: "Contact Us", url: "https://www.youtube.com/watch?v=iV2ViNJFZC8" }
];

const socialLinks = [
  { label: "Instagram", url: "https://www.instagram.com/" },
  { label: "YouTube", url: "https://www.youtube.com/" }
];

const quickJumpItems = [
  { id: "policies", label: "Policies" },
  { id: "experience", label: "Experience" },
  { id: "why-vote", label: "Why Vote" },
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

function splitPoint(point, sectionId) {
  if (typeof point === "object" && point !== null) {
    const body = point.text ?? point.body ?? "";
    return {
      heading: sectionId === "policies" ? point.title ?? "" : "",
      body,
      icon: sectionId === "policies" ? point.icon ?? null : null
    };
  }

  return {
    heading: "",
    body: String(point),
    icon: null
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

function SectionJumpChips() {
  return (
    <div className="section-jumps" aria-label="Quick links">
      {quickJumpItems.map((item) => (
        <a key={item.id} href={`#${item.id}`}>{item.label}</a>
      ))}
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBigScreemMode, setIsBigScreemMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const navLinks = useMemo(
    () => [
      { id: "top", label: "Home" },
      { id: "bio", label: "About Me" },
      ...campaignSections.map((section) => ({ id: section.id, label: section.title })),
      { id: "testimonials", label: "Testimonials" }
    ],
    []
  );

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = saved ? saved === "dark" : prefersDark;
    setIsDarkMode(shouldUseDark);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable <= 0 ? 0 : Math.min(100, (window.scrollY / scrollable) * 100);
      setScrollProgress(progress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    if (isBigScreemMode) {
      return undefined;
    }

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
  }, [isBigScreemMode]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsBigScreemMode(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);


  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth <= 900) {
        setIsBigScreemMode(false);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("milan.erdos@durham.ac.uk");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {!isBigScreemMode ? (
        <div className="top-controls">
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

          <button
            className="theme-toggle"
            type="button"
            aria-label="Toggle dark mode"
            onClick={() => setIsDarkMode((prev) => !prev)}
          >
            {isDarkMode ? "Light" : "Dark"}
          </button>

          <div className="scroll-progress" aria-label="Page progress">
            <div className="scroll-progress-track">
              <div className="scroll-progress-fill" style={{ width: `${scrollProgress}%` }} />
            </div>
            <span>{Math.round(scrollProgress)}%</span>
          </div>
        </div>
      ) : null}

      {!isBigScreemMode ? (
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
          <button
            type="button"
            className="big-screem-toggle"
            onClick={() => {
              setIsBigScreemMode(true);
              setIsSidebarOpen(false);
            }}
          >
            Big screem mode
          </button>
        </aside>
      ) : null}

      {!isBigScreemMode ? (
        <button
          type="button"
          className={`sidebar-backdrop ${isSidebarOpen ? "open" : ""}`}
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      {!isBigScreemMode ? <a className="sticky-vote" href="https://www.instagram.com/p/DVI5sLYCC7Q/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==">Vote Milan</a> : null}

      {!isBigScreemMode ? (
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
                <SectionJumpChips />
                <div className="section-header-row">
                  <h2>{section.title}</h2>
                </div>
                <div className="points-grid">
                  {section.points.map((point, index) => {
                    const parsed = splitPoint(point, section.id);
                                        return (
                      <article key={`${section.id}-${index}`} className="point-card">
                        <div className="point-top-row">
                          <p className="point-index">{String(index + 1).padStart(2, "0")}</p>
                          {parsed.icon ? <span className="policy-icon" aria-hidden="true">{parsed.icon}</span> : null}
                        </div>
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
            <SectionJumpChips />
            <h2>Testimonials</h2>
            <div className="testimonial-buttons">
              {testimonialLinks.map((item) => (
                <a key={item.label} className="testimonial-button" href={item.url} target="_blank" rel="noreferrer">
                  <span className="testimonial-label">{item.label}</span>
                  <span className="testimonial-subtitle">{item.subtitle}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {isBigScreemMode ? (
        <section className="big-screem-view" id="big-screem">
          <header className="big-screem-header">
            <p className="big-screem-kicker">Presentation View</p>
            <h1>Milan for Captain</h1>
            <p className="big-screem-tagline">A serious candidate for serious times.</p>
            <p className="big-screem-exit-note">Press Esc to exit Big screem mode</p>
          </header>
          <div className="big-screem-grid">
            <article className="big-screem-panel about-panel">
              <h2>About Me</h2>
              <div className="big-screem-panel-body">
                <ResilientImage
                  className="big-screem-bio-image"
                  src="/images/pfp.jpg"
                  alt="Milan campaign portrait"
                />
                <p>
                  Hi! I am a Castle Physics and Astronomy student running for Durham University Canoe Club Captain (DUCCC).
                </p>
                <p>
                  Why am I running for DUCCC? To be honest, because it seems like the coolest graduate job. For a while I have thought about whether to seek employment as a Venezuelan government official or as the CEO of Fifa.
                </p>
                <p>
                  First Proposer: Enego Comley. Second Proposer: Charlotte Chow. Third Proposer: Bio Smitasiri. Fourth Proposer: Noah Coombe.
                </p>
              </div>
            </article>

            {campaignSections.map((section) => (
              <article key={`big-${section.id}`} className="big-screem-panel">
                <h2>{section.title}</h2>
                <div className="big-screem-panel-body">
                  <ul>
                  {section.points.map((point, index) => {
                    const parsed = splitPoint(point, section.id);
                    return (
                      <li key={`big-${section.id}-${index}`}>
                        {parsed.heading ? <strong>{parsed.heading}: </strong> : null}
                        {parsed.body}
                      </li>
                    );
                  })}                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!isBigScreemMode ? (
        <footer className="site-footer" id="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <p className="footer-copy">Milan For Captain Campaign</p>
              <p className="footer-subcopy">Durham University Canoe Club • 2026 Campaign</p>
              <p className="footer-subcopy">© 2026 Milan For Captain. All rights reserved.</p>
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
                <a href="#top">Back To Top</a>
              </nav>
            </div>
          </div>
        </footer>
      ) : null}
    </>
  );
}

export default App;









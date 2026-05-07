import { useState, useEffect } from "react";
import { projects, categories, type Category } from "../data/projects.ts";
import { useGitHubRepos, relativeTime } from "../hooks/useGitHubRepos";
import styles from "./Projects.module.css";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [visibleCount, setVisibleCount] = useState(9);
  const { repoMap, loading, error } = useGitHubRepos("Divyansh3105");

  // Merge all live GitHub fields into static project data
  const enriched = projects.map((p) => {
    const live = repoMap[p.name.toLowerCase()];
    return {
      ...p,
      stars: live?.stars ?? p.stars,
      forks: live?.forks ?? 0,
      language: live?.language ?? null,
      updatedAt: live?.updatedAt ?? null,
    };
  });

  const filtered = enriched.filter(
    (p) => activeCategory === "all" || p.category === activeCategory,
  );

  useEffect(() => {
    // Apply vanilla-tilt lazily via IntersectionObserver instead of all at once
    let observer: IntersectionObserver;

    const applyTiltToElement = async (el: HTMLElement) => {
      const { default: VanillaTilt } = await import('vanilla-tilt');
      VanillaTilt.init([el], {
        max: 10,
        speed: 400,
        glare: true,
        'max-glare': 0.1,
        perspective: 1000,
      });
    };

    const initObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              applyTiltToElement(entry.target as HTMLElement);
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '100px' }
      );
      document.querySelectorAll<HTMLElement>('.tilt-card').forEach((card) => {
        observer.observe(card);
      });
    };

    // Small delay to let DOM settle after filter change
    const timeout = setTimeout(initObserver, 50);

    return () => {
      clearTimeout(timeout);
      if (observer) observer.disconnect();
    };
  }, [activeCategory, visibleCount]);

  const categoryLabel: Record<Category, string> = {
    all: "✨ All",
    fullstack: "🚀 Full Stack",
    frontend: "🎨 Frontend",
    tools: "🛠️ Tools",
    creative: "🎭 Creative",
    language: "⚡ Language",
  };

  const visibleProjects = filtered.slice(0, visibleCount);

  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className="container">
        <div className={`section-header gsap-fade-up`}>
          <div className="section-label">Projects</div>
          <h2 className="section-title">
            Things I've <span className="gradient-text">Built</span>
          </h2>
          <p className={styles.subtitle}>
            From full-stack platforms to custom programming languages —{" "}
            {enriched.length}+ projects on GitHub
          </p>

          {/* Live GitHub API status indicator */}
          <div className={styles.apiStatus}>
            {loading && (
              <span className={styles.apiPill}>
                <span className={styles.apiSpinner} />
                Fetching live GitHub data...
              </span>
            )}
            {!loading && !error && Object.keys(repoMap).length > 0 && (
              <span className={`${styles.apiPill} ${styles.apiLive}`}>
                <span className={styles.apiDot} />
                Live GitHub data active
              </span>
            )}
            {!loading && error && (
              <span className={`${styles.apiPill} ${styles.apiError}`}
                title={error}
              >
                ⚠ {error.startsWith('Rate limited') ? error : 'GitHub API unavailable — showing cached data'}
              </span>
            )}
          </div>
        </div>

        {/* ── Spotlight: Flagship Projects ── */}
        <div className={`${styles.spotlight} gsap-fade-up`}>
          {enriched
            .filter((p) => p.featured)
            .slice(0, 2)
            .map((project) => (
              <div
                key={project.id}
                className={`glass-card ${styles.spotlightCard}`}
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.spotlightBanner}
                  style={{
                    background: `linear-gradient(135deg, ${getGradientColors(project.id)})`,
                  }}
                  tabIndex={-1}
                  aria-label={`${project.name} on GitHub`}
                >
                  <span className={styles.spotlightEmoji}>{project.emoji}</span>
                  <span className={styles.spotlightBadge}>⭐ Flagship</span>
                </a>
                <div className={styles.spotlightBody}>
                  <div className={styles.spotlightMeta}>
                    <h3 className={styles.spotlightTitle}>{project.name}</h3>
                    {project.stars != null && project.stars > 0 && (
                      <span className={styles.stars}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {project.stars}
                      </span>
                    )}
                  </div>
                  <p className={styles.spotlightDesc}>{project.description}</p>
                  <div className={styles.tags} style={{ marginTop: "auto" }}>
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.spotlightFooter}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    Source Code
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.actionBtn} ${styles.demoBtn}`}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Filter Tabs */}
        <div className={`${styles.filters} gsap-fade-up`}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ""}`}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(9);
              }}
            >
              {categoryLabel[cat]}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className={styles.grid}>
          {visibleProjects.map((project, i) => (
            <div
              key={project.id}
              className={`glass-card tilt-card ${styles.card} ${project.featured ? styles.featured : ""} ${styles.cardEnter}`}
              style={{ "--card-delay": `${(i % 6) * 0.07}s` } as React.CSSProperties}
            >
              {/* Gradient preview — clicks to GitHub */}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardTop}
                tabIndex={-1}
                aria-label={`${project.name} on GitHub`}
              >
                <div
                  className={styles.gradient}
                  style={{
                    background: `linear-gradient(135deg, ${getGradientColors(project.id)})`,
                  }}
                />
                <span className={styles.emoji}>{project.emoji}</span>
                {project.featured && (
                  <span className={styles.featuredBadge}>⭐ Featured</span>
                )}
              </a>

              {/* Card content */}
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <h3 className={styles.cardTitle}>{project.name}</h3>
                  {project.stars != null && project.stars > 0 && (
                    <span className={styles.stars}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {project.stars}
                    </span>
                  )}
                  {project.forks > 0 && (
                    <span className={styles.forks}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="6" y1="3" x2="6" y2="15" />
                        <circle cx="18" cy="6" r="3" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="6" cy="6" r="3" />
                        <path d="M18 9a9 9 0 01-9 9" />
                      </svg>
                      {project.forks}
                    </span>
                  )}
                </div>
                <p className={styles.cardDesc}>{project.description}</p>
                <div className={styles.tags}>
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live GitHub metadata strip */}
              {(project.language || project.updatedAt) && (
                <div className={styles.liveStrip}>
                  {project.language && (
                    <span className={styles.langDot}>
                      <span
                        className={styles.langCircle}
                        data-lang={project.language}
                      />
                      {project.language}
                    </span>
                  )}
                  {project.updatedAt && (
                    <span
                      className={styles.updatedAt}
                      title={new Date(project.updatedAt).toLocaleDateString()}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {relativeTime(project.updatedAt)}
                    </span>
                  )}
                </div>
              )}

              {/* Card footer — action buttons */}
              <div className={styles.cardFooter}>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  Code
                </a>

                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionBtn} ${styles.demoBtn}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Live Demo
                  </a>
                ) : (
                  <span className={`${styles.actionBtn} ${styles.noDemo}`}>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Private / WIP
                  </span>
                )}
              </div>

              {/* Hover glow */}
              <div className={styles.hoverGlow} />
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < filtered.length && (
          <div className={styles.loadMore}>
            <button
              className="btn btn-outline"
              onClick={() => setVisibleCount((v) => v + 6)}
            >
              Load More Projects ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function getGradientColors(id: number): string {
  const palettes = [
    "hsl(185,100%,35%), hsl(200,90%,30%)",
    "hsl(265,85%,35%), hsl(290,70%,25%)",
    "hsl(155,70%,30%), hsl(170,80%,25%)",
    "hsl(0,80%,35%), hsl(25,90%,30%)",
    "hsl(200,80%,30%), hsl(220,90%,25%)",
    "hsl(130,60%,30%), hsl(155,70%,25%)",
    "hsl(30,80%,30%), hsl(45,90%,25%)",
    "hsl(210,80%,30%), hsl(230,90%,25%)",
    "hsl(40,90%,30%), hsl(25,85%,25%)",
    "hsl(340,80%,30%), hsl(320,75%,25%)",
    "hsl(245,75%,35%), hsl(265,80%,28%)",
    "hsl(175,70%,30%), hsl(185,80%,25%)",
    "hsl(160,65%,28%), hsl(180,70%,22%)",
    "hsl(320,75%,30%), hsl(340,80%,25%)",
    "hsl(45,90%,28%), hsl(55,85%,22%)",
  ];
  return palettes[(id - 1) % palettes.length];
}

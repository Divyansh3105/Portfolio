import { useState } from "react";
import styles from "./About.module.css";

/** Renders a github-readme-stats image with a loading skeleton + error fallback */
function GitHubStatImg({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  return (
    <div
      className={`${styles.githubImgWrap} ${status === "loading" ? styles.shimmer : ""}`}
    >
      <img
        src={src}
        alt={alt}
        className={styles.githubStatImg}
        style={{ display: status === "error" ? "none" : "block" }}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
      {status === "error" && (
        <a
          href="https://github.com/Divyansh3105"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubFallback}
        >
          View on GitHub ↗
        </a>
      )}
    </div>
  );
}

const profile = {
  name: '"Divyansh Garg"',
  role: '"Full Stack Developer"',
  college: '"B.Tech CSE, 3rd Year (2023–2027)"',
  location: '"India 🇮🇳"',
  passion: '["React", "Node.js", "Compilers", "3D Web"]',
  status: '"🟢 Open to Internships"',
  github: '"github.com/Divyansh3105"',
  linkedin: '"in/divyanshgarg3105"',
};

export default function About() {
  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container">
        <div className="section-header gsap-fade-up">
          <div className="section-label">About Me</div>
          <h2 className="section-title">
            The <span className="gradient-text">Developer</span> Behind the Code
          </h2>
        </div>

        <div className={styles.grid}>
          {/* Code block */}
          <div className={`glass-card ${styles.codeCard} gsap-fade-up`}>
            <div className={styles.codeHeader}>
              <div className={styles.dots}>
                <span style={{ background: "#ff5f57" }} />
                <span style={{ background: "#ffbd2e" }} />
                <span style={{ background: "#28ca41" }} />
              </div>
              <span className={styles.filename}>developer.ts</span>
            </div>
            <pre className={styles.code}>
              <code>
                <span className={styles.keyword}>const </span>
                <span className={styles.variable}>developer </span>
                <span className={styles.op}>= </span>
                <span>{"{"}</span>
                {"\n"}
                {Object.entries(profile).map(([key, value]) => (
                  <span key={key}>
                    {"  "}
                    <span className={styles.prop}>{key}</span>
                    <span className={styles.op}>: </span>
                    <span
                      className={
                        value.startsWith('"')
                          ? styles.string
                          : value.startsWith("[")
                            ? styles.array
                            : styles.string
                      }
                    >
                      {value}
                    </span>
                    {","}
                    {"\n"}
                  </span>
                ))}
                {"}"}
                <span className={styles.op}>;</span>
              </code>
            </pre>
          </div>

          {/* Info cards */}
          <div className={styles.infoCol}>
            <div className={`glass-card ${styles.infoCard} gsap-fade-up`}>
              <div className={styles.avatar}>DG</div>
              <div>
                <h3 className={styles.infoName}>Divyansh Garg</h3>
                <p className={styles.infoRole}>
                  Full Stack Developer & Language Designer
                </p>
              </div>
            </div>

            <div className={`glass-card ${styles.bioCard} gsap-fade-up`}>
              <p>
                I'm a{" "}
                <strong className={styles.highlight}>B.Tech CSE student</strong>{" "}
                in my 3rd year, passionate about building production-ready
                applications and exploring the depths of computer science — from
                real-time systems to custom programming languages.
              </p>
              <p>
                My flagship project{" "}
                <strong className={styles.highlight}>TalkSpace</strong> is a
                full-stack real-time communication platform. I also built{" "}
                <strong className={styles.highlight}>GravLang</strong>, my own
                programming language with a lexer, parser, and interpreter —
                just for the love of CS.
              </p>
            </div>

            <div className={styles.quickFacts}>
              {[
                {
                  icon: "🎓",
                  label: "College",
                  value: "B.Tech CSE | Class of 2027",
                },
                { icon: "📍", label: "Location", value: "India" },
                { icon: "💼", label: "Status", value: "Open to Internships" },
                { icon: "🔗", label: "LinkedIn", value: "in/divyanshgarg3105" },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className={`glass-card ${styles.factChip}`}
                >
                  <span className={styles.factIcon}>{fact.icon}</span>
                  <div>
                    <span className={styles.factLabel}>{fact.label}</span>
                    <span className={styles.factValue}>{fact.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub Activity Strip */}
        <div className={`${styles.githubStrip} gsap-fade-up`}>
          <div className={styles.githubStripLabel}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: "var(--accent-cyan)" }}
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub Activity
          </div>
          <div className={styles.githubCards}>
            <GitHubStatImg
              src="https://github-readme-stats-sigma-five.vercel.app/api?username=Divyansh3105&show_icons=true&theme=transparent&hide_border=true&title_color=00f5ff&icon_color=9b59fc&text_color=a0b4c8&bg_color=141b26"
              alt="Divyansh's GitHub stats"
            />
            <GitHubStatImg
              src="https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=Divyansh3105&layout=compact&theme=transparent&hide_border=true&title_color=00f5ff&text_color=a0b4c8&bg_color=141b26&langs_count=6"
              alt="Divyansh's top languages"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

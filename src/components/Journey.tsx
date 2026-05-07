import styles from "./Journey.module.css";

const milestones = [
  {
    year: "2023",
    icon: "🎓",
    title: "Began B.Tech CSE",
    subtitle: "Class of 2027",
    desc: "Started my computer science journey — algorithms, data structures, and the spark of programming.",
    color: "cyan",
    highlight: false,
  },
  {
    year: "2026",
    icon: "⚡",
    title: "Built GravLang",
    subtitle: "Compiler Design",
    desc: "Designed and built a custom programming language from scratch — lexer, parser, and tree-walk interpreter, all in Python.",
    color: "violet",
    highlight: true,
  },
  {
    year: "2026",
    icon: "🌐",
    title: "Became Full Stack",
    subtitle: "React + Node + MongoDB",
    desc: "Mastered the MERN stack. Built APIs, authentication flows, and deployed production applications.",
    color: "gold",
    highlight: false,
  },
  {
    year: "2026",
    icon: "💬",
    title: "Launched TalkSpace",
    subtitle: "Full-Stack PWA",
    desc: "Built TalkSpace — a real-time communication platform with chat, video calls, JWT auth, and PWA support. 44+ repos on GitHub.",
    color: "cyan",
    highlight: true,
  },
  {
    year: "2027",
    icon: "🚀",
    title: "Final Year & Beyond",
    subtitle: "Open to Opportunities",
    desc: "Actively seeking internships and collaborative projects. Next focus: system design, Docker, and contributing to open source.",
    color: "violet",
    highlight: false,
  },
];

export default function Journey() {
  return (
    <section id="journey" className={`section ${styles.journey}`}>
      <div className="container">
        <div className="section-header gsap-fade-up">
          <div className="section-label">Journey</div>
          <h2 className="section-title">
            My <span className="gradient-text">Developer Story</span>
          </h2>
          <p className={styles.subtitle}>
            The path from curious student to full-stack builder
          </p>
        </div>

        <div className={styles.timeline}>
          {milestones.map((m, i) => (
            <div
              key={`${m.year}-${m.title}`}
              className={`${styles.item} ${i % 2 === 0 ? styles.left : styles.right} gsap-fade-up`}
            >
              {/* Connector dot */}
              <div className={`${styles.dot} ${styles[`dot-${m.color}`]}`}>
                {m.icon}
              </div>

              {/* Card */}
              <div
                className={`glass-card ${styles.card} ${m.highlight ? styles.highlighted : ""}`}
              >
                <div className={styles.cardYear}>{m.year}</div>
                <h3
                  className={`${styles.cardTitle} ${styles[`text-${m.color}`]}`}
                >
                  {m.title}
                </h3>
                <div className={styles.cardSub}>{m.subtitle}</div>
                <p className={styles.cardDesc}>{m.desc}</p>
              </div>
            </div>
          ))}

          {/* The line */}
          <div className={styles.line} />
        </div>
      </div>
    </section>
  );
}

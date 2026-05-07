import styles from './Skills.module.css';

const skillGroups = [
  {
    title: 'Frontend',
    icon: '🎨',
    color: 'cyan',
    skills: ['React.js', 'HTML5', 'CSS3', 'Vanilla JS', 'Vite', 'TypeScript', 'Responsive Design'],
  },
  {
    title: 'Backend',
    icon: '⚙️',
    color: 'violet',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Socket.io', 'WebSockets'],
  },
  {
    title: 'Databases',
    icon: '🗄️',
    color: 'gold',
    skills: ['MongoDB', 'Mongoose', 'PostgreSQL', 'LocalStorage'],
  },
  {
    title: 'Languages',
    icon: '💻',
    color: 'pink',
    skills: ['JavaScript', 'TypeScript', 'Python', 'CSS'],
  },
  {
    title: 'CS Concepts',
    icon: '🧠',
    color: 'cyan',
    skills: ['Compiler Design', 'Lexer & Parser', 'Data Structures', 'Algorithms', 'PWA'],
  },
  {
    title: 'Tools & Ecosystem',
    icon: '🛠️',
    color: 'violet',
    skills: ['Git & GitHub', 'Chart.js', 'npm/pnpm', 'Three.js', 'GSAP', 'VS Code'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className={`section ${styles.skills}`}>
      <div className="container">
        <div className="section-header gsap-fade-up">
          <div className="section-label">Skills</div>
          <h2 className="section-title">My <span className="gradient-text">Tech Arsenal</span></h2>
          <p className={styles.subtitle}>
            Technologies and tools I wield to build extraordinary digital experiences
          </p>
        </div>

        <div className={styles.grid}>
          {skillGroups.map((group, i) => (
            <div
              key={group.title}
              className={`glass-card ${styles.groupCard} gsap-fade-up`}
              style={{ '--delay': `${i * 0.08}s` } as React.CSSProperties}
            >
              <div className={styles.groupHeader}>
                <span className={styles.groupIcon}>{group.icon}</span>
                <h3 className={`${styles.groupTitle} ${styles[`color-${group.color}`]}`}>
                  {group.title}
                </h3>
              </div>
              <div className={styles.skillsList}>
                {group.skills.map(skill => (
                  <div key={skill} className={styles.skillPill}>
                    <span className={`${styles.skillDot} ${styles[`dot-${group.color}`]}`} />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Learning next */}
        <div className={`glass-card ${styles.learningCard} gsap-fade-up`}>
          <div className={styles.learningHeader}>
            <span>🚀</span>
            <span>Currently Exploring</span>
          </div>
          <div className={styles.learningTags}>
            {['Next.js', 'Docker', 'CI/CD', 'WebGL / Three.js', 'System Design', 'DSA (LeetCode)'].map(tag => (
              <span key={tag} className={`${styles.learningTag}`}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

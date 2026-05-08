import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Terminal.module.css";

interface Line {
  type: "input" | "output" | "system";
  text: string;
}

const COMMANDS: Record<string, string[]> = {
  help: [
    "  Available commands:",
    "  whoami      → About Divyansh",
    "  skills      → Tech stack",
    "  projects    → Flagship projects",
    "  contact     → Get in touch",
    "  socials     → Social links",
    "  resume      → View resume (PDF)",
    "  github      → Open GitHub profile",
    "  clear       → Clear terminal",
    "  exit        → Close terminal",
  ],
  whoami: [
    "  Divyansh Garg",
    "  ─────────────────────────────",
    "  Role    : Full Stack Developer",
    "  Study   : B.Tech CSE, 3rd Year (2023–2027)",
    "  College : Class of 2027",
    "  Status  : 🟢 Open to internships",
    "  Based   : India 🇮🇳",
    "  Commits : 351+ in 2025",
  ],
  skills: [
    "  Frontend  → React, TypeScript, Vite, Three.js",
    "  Backend   → Node.js, Express, REST APIs",
    "  Database  → MongoDB, PostgreSQL, Mongoose",
    "  Auth      → JWT, OAuth2, Socket.io",
    "  CS        → Compiler Design, DSA, OS",
    "  Tools     → Git, Docker (learning), Linux",
  ],
  projects: [
    "  ⭐ TalkSpace   → Real-time chat + video PWA",
    "     Stack: React · Node · MongoDB · WebRTC",
    "     github.com/Divyansh3105/TalkSpace",
    "",
    "  ⭐ GravLang    → Custom programming language",
    "     Stack: Python · Lexer · Parser · Interpreter",
    "     github.com/Divyansh3105/GravLang",
    "",
    "  🔎 Github-Finder → GitHub profile explorer",
    "     Stack: React · Vite · Chart.js · GitHub API",
  ],
  contact: [
    "  📧 Email    : divyanshgarg3105@gmail.com",
    "  🔗 LinkedIn : linkedin.com/in/divyanshgarg3105",
    "  🐙 GitHub   : github.com/Divyansh3105",
    "",
    "  Response time: usually within 24 hours 🚀",
  ],
  socials: [
    "  🐙 GitHub   : github.com/Divyansh3105",
    "  🔗 LinkedIn : linkedin.com/in/divyanshgarg3105",
    "  📧 Email    : divyanshgarg3105@gmail.com",
  ],
  resume: ["  Opening resume..."],
  github: ["  Opening GitHub profile..."],
};

export default function Terminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    {
      type: "system",
      text: "╭─ DG Terminal v1.0.0 ─────────────────────────╮",
    },
    {
      type: "system",
      text: "│  Welcome! Type 'help' to see commands.       │",
    },
    {
      type: "system",
      text: "│  Press ESC or type 'exit' to close.          │",
    },
    {
      type: "system",
      text: "╰──────────────────────────────────────────────╯",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll and focus
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const run = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase();
      const newLines: Line[] = [{ type: "input", text: `> ${cmd}` }];

      if (!trimmed) {
        setLines((l) => [...l, ...newLines]);
        return;
      }

      if (trimmed === "clear") {
        setLines([]);
        return;
      }

      if (trimmed === "exit") {
        onClose();
        return;
      }

      if (trimmed === "github") {
        window.open("https://github.com/Divyansh3105", "_blank");
        newLines.push({ type: "output", text: "  ↗ Opened in new tab" });
      } else if (trimmed === "resume") {
        window.open("/resume.pdf", "_blank");
        newLines.push({ type: "output", text: "  ↗ Opened in new tab" });
      } else if (COMMANDS[trimmed]) {
        COMMANDS[trimmed].forEach((t) =>
          newLines.push({ type: "output", text: t }),
        );
      } else {
        newLines.push({
          type: "output",
          text: `  command not found: ${trimmed}. Type 'help'.`,
        });
      }

      setLines((l) => [...l, ...newLines]);
      setHistory((h) => [cmd, ...h].slice(0, 20));
      setHistIdx(-1);
    },
    [onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.terminal}
        role="dialog"
        aria-label="Developer terminal"
      >
        {/* Title bar */}
        <div className={styles.titleBar}>
          <div className={styles.dots}>
            <button
              className={`${styles.dot} ${styles.red}`}
              onClick={onClose}
              aria-label="Close terminal"
            />
            <span className={`${styles.dot} ${styles.yellow}`} />
            <span className={`${styles.dot} ${styles.green}`} />
          </div>
          <span className={styles.title}>dg@portfolio ~ terminal</span>
          <span className={styles.hint}>ESC to close</span>
        </div>

        {/* Output */}
        <div
          className={styles.output}
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div key={i} className={`${styles.line} ${styles[line.type]}`}>
              {line.text}
            </div>
          ))}

          {/* Input row */}
          <div className={styles.inputRow}>
            <span className={styles.prompt}>
              <span className={styles.promptUser}>divyansh</span>
              <span className={styles.promptAt}>@</span>
              <span className={styles.promptHost}>portfolio</span>
              <span className={styles.promptSep}> $ </span>
            </span>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

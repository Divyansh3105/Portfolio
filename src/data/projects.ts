export interface Project {
  id: number;
  name: string;
  description: string;
  tags: string[];
  category: "fullstack" | "frontend" | "tools" | "creative" | "language";
  github: string;
  demo?: string;
  stars?: number;
  featured?: boolean;
  emoji: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "TalkSpace",
    description:
      "Full-stack real-time communication platform with messaging, video calls, PWA support, and social connections.",
    tags: ["React", "Node.js", "MongoDB", "JWT", "Socket.io", "PWA"],
    category: "fullstack",
    github: "https://github.com/Divyansh3105/TalkSpace",
    demo: "https://talkspace.up.railway.app/",
    stars: 1,
    featured: true,
    emoji: "💬",
  },
  {
    id: 2,
    name: "GravLang",
    description:
      "Custom programming language built in Python — features a clean syntax with lexer, parser, and interpreter.",
    tags: ["Python", "Compiler Design", "Lexer", "Parser", "Interpreter"],
    category: "language",
    github: "https://github.com/Divyansh3105/GravLang",
    stars: 1,
    featured: true,
    emoji: "⚡",
  },
  {
    id: 3,
    name: "Github-Finder",
    description:
      "GitHub profile explorer with analytics dashboard, charts, and developer insights powered by the GitHub API.",
    tags: ["React", "Vite", "Chart.js", "GitHub API"],
    category: "tools",
    github: "https://github.com/Divyansh3105/Github-Finder",
    demo: "https://gitdevprofile.vercel.app/",
    featured: true,
    emoji: "🔍",
  },
  {
    id: 4,
    name: "Assassin's Creed Fan Site",
    description:
      "Fan-made immersive website for the legendary Assassin's Creed franchise — cinematic UI, animations, responsive design.",
    tags: ["HTML", "CSS", "UI Design", "Responsive", "Animations"],
    category: "creative",
    github: "https://github.com/Divyansh3105/Assassins-Creed",
    demo: "https://assassins-creed-tribute.netlify.app/",
    stars: 1,
    featured: true,
    emoji: "🗡️",
  },
  {
    id: 5,
    name: "Slime Chronicles",
    description:
      'Interactive Tensura codex and timeline inspired by "That Time I Got Reincarnated as a Slime" with UI animations.',
    tags: ["Vanilla JS", "CSS Animations", "HTML", "Responsive"],
    category: "creative",
    github: "https://github.com/Divyansh3105/slimechronicles",
    demo: "https://slimechronicles.netlify.app/",
    stars: 1,
    featured: true,
    emoji: "🌊",
  },
  {
    id: 6,
    name: "Currency Converter",
    description:
      "Real-time currency converter with live exchange rates and a clean minimal interface.",
    tags: ["JavaScript", "API", "HTML", "CSS"],
    category: "tools",
    github: "https://github.com/Divyansh3105/Currency-Converter",
    emoji: "💱",
  },
  {
    id: 7,
    name: "Recipe Finder",
    description:
      "Search and discover recipes with ingredient filters and detailed cooking instructions.",
    tags: ["CSS", "JavaScript", "API"],
    category: "frontend",
    github: "https://github.com/Divyansh3105/Recipe-Finder",
    emoji: "🍳",
  },
  {
    id: 8,
    name: "TODO App",
    description:
      "Feature-rich task management app with local storage persistence and smooth UI interactions.",
    tags: ["JavaScript", "LocalStorage", "CSS"],
    category: "tools",
    github: "https://github.com/Divyansh3105/TODO-App",
    emoji: "✅",
  },
  {
    id: 9,
    name: "Expense Tracker",
    description:
      "Personal finance tracker to log expenses, view summaries, and manage your budget visually.",
    tags: ["CSS", "JavaScript", "LocalStorage"],
    category: "tools",
    github: "https://github.com/Divyansh3105/Expense-Tracker",
    emoji: "💰",
  },
  {
    id: 10,
    name: "Password Generator",
    description:
      "Secure random password generator with customizable length and character set options.",
    tags: ["CSS", "JavaScript", "Security"],
    category: "tools",
    github: "https://github.com/Divyansh3105/Password-Generator",
    emoji: "🔐",
  },
  {
    id: 11,
    name: "Form Validator",
    description:
      "Real-time client-side form validation with elegant error messaging and UX patterns.",
    tags: ["JavaScript", "HTML", "CSS"],
    category: "frontend",
    github: "https://github.com/Divyansh3105/Form-Validator",
    emoji: "📋",
  },
  {
    id: 12,
    name: "Quote Generator",
    description:
      "Inspirational random quote generator with a beautiful minimal card UI and share functionality.",
    tags: ["JavaScript", "API", "CSS"],
    category: "frontend",
    github: "https://github.com/Divyansh3105/Quote-Generator",
    emoji: "💭",
  },
  {
    id: 13,
    name: "Bookmark Saver",
    description:
      "Browser-based bookmark manager with local persistence and quick access to saved links.",
    tags: ["CSS", "JavaScript", "LocalStorage"],
    category: "tools",
    github: "https://github.com/Divyansh3105/Bookmark-Saver",
    emoji: "🔖",
  },
  {
    id: 14,
    name: "Confetti Animation",
    description:
      "Pure CSS confetti animation component — celebratory burst effect with configurable particles.",
    tags: ["CSS", "Animation", "HTML"],
    category: "creative",
    github: "https://github.com/Divyansh3105/Confetti",
    emoji: "🎉",
  },
  {
    id: 15,
    name: "Cookie Consent",
    description:
      "GDPR-compliant cookie consent banner with smooth slide-in animation and localStorage state.",
    tags: ["CSS", "JavaScript", "UX"],
    category: "frontend",
    github: "https://github.com/Divyansh3105/cookie-consent",
    emoji: "🍪",
  },
];

export const categories = [
  "all",
  "fullstack",
  "frontend",
  "tools",
  "creative",
  "language",
] as const;
export type Category = (typeof categories)[number];

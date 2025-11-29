// Modern Portfolio JavaScript

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Close mobile menu if open
        document.getElementById("nav-toggle").checked = false;
      }
    }
  });
});

// Reveal on scroll animation
const reveals = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  for (const el of reveals) {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add("active");
    }
  }
};

// Header background on scroll
const header = document.querySelector(".main-header");
const handleHeaderScroll = () => {
  if (window.scrollY > 50) {
    header.style.background = "rgba(10, 10, 15, 0.95)";
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
  } else {
    header.style.background = "rgba(10, 10, 15, 0.8)";
    header.style.boxShadow = "none";
  }
};

// Update scroll progress bar
const updateScrollProgress = () => {
  const progressBar = document.querySelector(".scroll-progress-bar");
  if (!progressBar) return;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Calculate scroll percentage
  const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

  // Update progress bar width
  progressBar.style.width = `${Math.min(scrollPercentage, 100)}%`;
};

// Back to top button
const backToTopButton = document.getElementById("backToTop");
const toggleBackToTop = () => {
  if (window.scrollY > 500) {
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
  }
};

backToTopButton?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Scroll events
window.addEventListener("scroll", () => {
  revealOnScroll();
  handleHeaderScroll();
  toggleBackToTop();
  updateScrollProgress();
});

// Page loader
const hideLoader = () => {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hidden");
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }, 500);
  }
};

// Parallax effect for gradient orbs
const addParallaxEffect = () => {
  const orbs = document.querySelectorAll(".gradient-orb");
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    orbs.forEach((orb, index) => {
      const speed = 0.3 + index * 0.1;
      orb.style.transform = `translate(${scrolled * speed}px, ${
        scrolled * speed * 0.5
      }px)`;
    });
  });
};

// Animate elements on intersection
const observeElements = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
};

// Add hover effect to project cards
const enhanceProjectCards = () => {
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.zIndex = "10";
    });
    card.addEventListener("mouseleave", function () {
      this.style.zIndex = "1";
    });
  });
};

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  observeElements();
  addParallaxEffect();
  enhanceProjectCards();
});

// Hide loader when page is fully loaded
window.addEventListener("load", () => {
  hideLoader();
});

// Add cursor trail effect (optional enhancement)
const createCursorTrail = () => {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    requestAnimationFrame(animateCursor);
  };

  animateCursor();
};

// Initialize cursor trail on desktop only
if (window.innerWidth > 768) {
  createCursorTrail();
}

// Create floating particles
const createFloatingParticles = () => {
  const particleContainer = document.createElement("div");
  particleContainer.className = "particle-container";
  particleContainer.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  `;
  document.body.appendChild(particleContainer);

  const createParticle = () => {
    const particle = document.createElement("div");
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 5;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.8), transparent);
      border-radius: 50%;
      bottom: -10px;
      left: ${startX}px;
      animation: floatUp ${duration}s linear ${delay}s infinite;
      opacity: 0;
    `;

    particleContainer.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, (duration + delay) * 1000);
  };

  // Create particles periodically
  setInterval(createParticle, 500);

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes floatUp {
      0% {
        transform: translateY(0) translateX(0) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      50% {
        transform: translateY(-50vh) translateX(${
          Math.random() * 100 - 50
        }px) scale(1);
        opacity: 0.4;
      }
      100% {
        transform: translateY(-100vh) translateX(${
          Math.random() * 200 - 100
        }px) scale(0.5);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
};

// Initialize particles on desktop
if (window.innerWidth > 768) {
  createFloatingParticles();
}

// Add interactive blob effect on mouse move
const createInteractiveBlob = () => {
  const blob = document.createElement("div");
  blob.className = "interactive-blob";
  blob.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent);
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
    z-index: 0;
    transition: transform 0.3s ease;
  `;
  document.body.appendChild(blob);

  document.addEventListener("mousemove", (e) => {
    blob.style.left = `${e.clientX - 150}px`;
    blob.style.top = `${e.clientY - 150}px`;
  });
};

// Initialize interactive blob on desktop
if (window.innerWidth > 768) {
  createInteractiveBlob();
}

// Project Modal Data
const projectsData = {
  cod: {
    title: "Call Of Duty Tribute Site",
    image: "Media/COD SS.png",
    description:
      "A comprehensive tribute website celebrating the iconic Call of Duty franchise. This project showcases modern web design principles with responsive layouts, smooth animations, and an immersive user experience that captures the essence of the game series.",
    tech: [
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Bootstrap",
      "JavaScript",
      "Responsive Design",
    ],
    features: [
      "Fully responsive design that works seamlessly across all devices",
      "Modern UI with smooth animations and transitions",
      "Interactive timeline showcasing COD game history",
      "Optimized performance with lazy loading images",
      "Cross-browser compatible and accessible",
    ],
    liveLink: "https://call-of-duty-tribute.netlify.app/",
    codeLink: "https://github.com/Divyansh3105",
  },
  ac: {
    title: "Assassin's Creed Tribute Site",
    image: "Media/AC SS.png",
    description:
      "An elegant tribute to the Assassin's Creed series, featuring a sleek design that embodies the stealth and sophistication of the franchise. The site demonstrates advanced CSS techniques and fluid transitions inspired by the game's iconic aesthetic.",
    tech: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "CSS Animations",
      "Flexbox",
      "Grid Layout",
    ],
    features: [
      "Stunning visual design with parallax scrolling effects",
      "Fluid CSS animations and transitions",
      "Interactive character showcase section",
      "Optimized for performance and SEO",
      "Mobile-first responsive approach",
    ],
    liveLink: "https://assassins-creed-tribute.netlify.app/",
    codeLink: "https://github.com/Divyansh3105",
  },
  smartsort: {
    title: "Smart Sort Selector",
    image: "Media/Smart Sorter SS.png",
    description:
      "An interactive Python application that visualizes various sorting algorithms in real-time. Built with Tkinter, this educational tool helps users understand how different sorting algorithms work through visual representation and step-by-step execution.",
    tech: ["Python", "Tkinter", "Algorithms", "Data Structures", "GUI Design"],
    features: [
      "Visual representation of 6+ sorting algorithms",
      "Real-time algorithm execution with adjustable speed",
      "Interactive controls for array size and values",
      "Color-coded visualization for better understanding",
      "Educational tool for learning algorithm complexity",
    ],
    liveLink: null,
    codeLink: "https://github.com/Divyansh3105/Smart-Sort-Selector",
  },
  portfolio: {
    title: "Portfolio Website",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
    description:
      "A modern, responsive portfolio website showcasing my projects and skills. Built with vanilla HTML, CSS, and JavaScript, featuring smooth animations, glassmorphism design, and an intuitive user interface.",
    tech: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Responsive Design",
      "Animations",
      "Glassmorphism",
    ],
    features: [
      "Modern glassmorphism UI with gradient accents",
      "Smooth scroll animations and transitions",
      "Fully responsive across all screen sizes",
      "Interactive project showcases with modals",
      "Optimized performance and accessibility",
    ],
    liveLink: "https://divyansh3105.github.io/",
    codeLink: "https://github.com/Divyansh3105/Divyansh3105.github.io",
  },
  python: {
    title: "Python Projects Collection",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    description:
      "A curated collection of Python scripts and mini-projects demonstrating various programming concepts, from basic automation to advanced data manipulation. Each project showcases different aspects of Python programming.",
    tech: ["Python", "Automation", "Data Analysis", "File Handling", "APIs"],
    features: [
      "Diverse range of Python applications",
      "Well-documented and commented code",
      "Practical real-world use cases",
      "Modular and reusable code structure",
      "Beginner to intermediate level projects",
    ],
    liveLink: null,
    codeLink: "https://github.com/Divyansh3105/Python",
  },
  webdev: {
    title: "Web Development Experiments",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    description:
      "A collection of experimental web development projects exploring modern frameworks, libraries, and design patterns. These projects serve as a playground for testing new technologies and implementing creative ideas.",
    tech: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "React",
      "Node.js",
      "Modern Frameworks",
    ],
    features: [
      "Exploration of cutting-edge web technologies",
      "Implementation of modern design patterns",
      "Responsive and accessible interfaces",
      "Performance optimization techniques",
      "Progressive web app features",
    ],
    liveLink: null,
    codeLink: "https://github.com/Divyansh3105",
  },
};

// Open Project Modal
function openProjectModal(projectId) {
  const project = projectsData[projectId];
  if (!project) return;

  const modal = document.getElementById("projectModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalTechStack = document.getElementById("modalTechStack");
  const modalFeatures = document.getElementById("modalFeatures");
  const modalLiveLink = document.getElementById("modalLiveLink");
  const modalCodeLink = document.getElementById("modalCodeLink");

  // Set content
  modalImage.src = project.image;
  modalImage.alt = project.title;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;

  // Set tech stack
  modalTechStack.innerHTML = project.tech
    .map((tech) => `<span class="modal-tech-tag">${tech}</span>`)
    .join("");

  // Set features
  modalFeatures.innerHTML = project.features
    .map((feature) => `<li>${feature}</li>`)
    .join("");

  // Set links
  if (project.liveLink) {
    modalLiveLink.href = project.liveLink;
    modalLiveLink.style.display = "inline-flex";
  } else {
    modalLiveLink.style.display = "none";
  }

  modalCodeLink.href = project.codeLink;

  // Show modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Project Modal
function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close modal on overlay click
document.getElementById("projectModal")?.addEventListener("click", (e) => {
  if (e.target.id === "projectModal") {
    closeProjectModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProjectModal();
  }
});

// Interactive Skills Section
const skillsData = {
  frontend: [
    {
      name: "HTML5",
      level: "Advanced",
      percentage: 95,
      icon: "https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg",
      description: "Semantic markup and modern HTML5 features",
    },
    {
      name: "CSS3",
      level: "Advanced",
      percentage: 90,
      icon: "https://www.vectorlogo.zone/logos/w3_css/w3_css-icon.svg",
      description: "Animations, Grid, Flexbox, and responsive design",
    },
    {
      name: "JavaScript",
      level: "Intermediate",
      percentage: 85,
      icon: "https://www.vectorlogo.zone/logos/javascript/javascript-icon.svg",
      description: "ES6+, DOM manipulation, and async programming",
    },
    {
      name: "Tailwind CSS",
      level: "Advanced",
      percentage: 88,
      icon: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg",
      description: "Utility-first CSS framework for rapid development",
    },
    {
      name: "Bootstrap",
      level: "Advanced",
      percentage: 85,
      icon: "https://www.vectorlogo.zone/logos/getbootstrap/getbootstrap-icon.svg",
      description: "Responsive component library and grid system",
    },
    {
      name: "React",
      level: "Beginner",
      percentage: 60,
      icon: "https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg",
      description: "Component-based UI development",
    },
  ],
  backend: [
    {
      name: "Python",
      level: "Intermediate",
      percentage: 80,
      icon: "https://www.vectorlogo.zone/logos/python/python-icon.svg",
      description: "Backend development and automation scripts",
    },
    {
      name: "Node.js",
      level: "Beginner",
      percentage: 55,
      icon: "https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg",
      description: "Server-side JavaScript runtime",
    },
    {
      name: "MySQL",
      level: "Intermediate",
      percentage: 75,
      icon: "https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg",
      description: "Relational database management",
    },
    {
      name: "MongoDB",
      level: "Beginner",
      percentage: 50,
      icon: "https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg",
      description: "NoSQL database for modern applications",
    },
  ],
  tools: [
    {
      name: "Git",
      level: "Advanced",
      percentage: 90,
      icon: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg",
      description: "Version control and collaboration",
    },
    {
      name: "VS Code",
      level: "Advanced",
      percentage: 95,
      icon: "https://www.vectorlogo.zone/logos/visualstudio_code/visualstudio_code-icon.svg",
      description: "Primary code editor with extensions",
    },
    {
      name: "Figma",
      level: "Intermediate",
      percentage: 70,
      icon: "https://www.vectorlogo.zone/logos/figma/figma-icon.svg",
      description: "UI/UX design and prototyping",
    },
    {
      name: "GitHub",
      level: "Advanced",
      percentage: 88,
      icon: "https://www.vectorlogo.zone/logos/github/github-icon.svg",
      description: "Code hosting and project management",
    },
  ],
  languages: [
    {
      name: "JavaScript",
      level: "Intermediate",
      percentage: 85,
      icon: "https://www.vectorlogo.zone/logos/javascript/javascript-icon.svg",
      description: "Primary language for web development",
    },
    {
      name: "Python",
      level: "Intermediate",
      percentage: 80,
      icon: "https://www.vectorlogo.zone/logos/python/python-icon.svg",
      description: "Scripting and backend development",
    },
    {
      name: "TypeScript",
      level: "Beginner",
      percentage: 55,
      icon: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg",
      description: "Typed superset of JavaScript",
    },
    {
      name: "SQL",
      level: "Intermediate",
      percentage: 75,
      icon: "https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg",
      description: "Database query language",
    },
  ],
};

// Render skills based on category
function renderSkills(category) {
  const container = document.getElementById("skillsContainer");
  const skills = skillsData[category];

  if (!container || !skills) return;

  container.innerHTML = skills
    .map(
      (skill) => `
    <div class="skill-card-interactive" data-percentage="${skill.percentage}">
      <div class="skill-header">
        <div class="skill-icon">
          <img src="${skill.icon}" alt="${skill.name}">
        </div>
        <div class="skill-info">
          <h3>${skill.name}</h3>
          <span class="skill-level">${skill.level}</span>
        </div>
      </div>
      <div class="skill-progress">
        <div class="progress-bar-container">
          <div class="progress-bar" data-progress="${skill.percentage}"></div>
        </div>
        <div class="skill-percentage">
          <span class="percentage-number" data-target="${skill.percentage}">0</span>
          <span class="percentage-label">Proficiency</span>
        </div>
      </div>
      <p class="skill-description">${skill.description}</p>
    </div>
  `
    )
    .join("");

  // Animate progress bars and counters after render
  setTimeout(() => {
    animateSkillBars();
    add3DTiltEffect();
  }, 100);
}

// Animate progress bars
function animateSkillBars() {
  const progressBars = document.querySelectorAll(".progress-bar");
  const percentageNumbers = document.querySelectorAll(".percentage-number");

  progressBars.forEach((bar, index) => {
    const progress = bar.getAttribute("data-progress");
    setTimeout(() => {
      bar.style.width = `${progress}%`;
    }, index * 100);
  });

  // Animate percentage counters
  percentageNumbers.forEach((number, index) => {
    const target = parseInt(number.getAttribute("data-target"));
    let current = 0;
    const increment = target / 60; // 60 frames for smooth animation
    const duration = 1500; // 1.5 seconds
    const stepTime = duration / 60;

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        number.textContent = target + "%";
        clearInterval(counter);
      } else {
        number.textContent = Math.floor(current) + "%";
      }
    }, stepTime);
  });
}

// Add 3D tilt effect on hover
function add3DTiltEffect() {
  const cards = document.querySelectorAll(".skill-card-interactive");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
    });
  });
}

// Handle tab switching
function initSkillsTabs() {
  const tabs = document.querySelectorAll(".skill-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");

      // Get category and render skills
      const category = tab.getAttribute("data-category");
      renderSkills(category);
    });
  });

  // Render default category (frontend)
  renderSkills("frontend");
}

// Initialize skills section when it comes into view
const skillsSection = document.getElementById("skills");
if (skillsSection) {
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initSkillsTabs();
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  skillsObserver.observe(skillsSection);
}

// Theme Switcher
const themeToggleBtn = document.getElementById("themeToggle");
const themePanel = document.getElementById("themePanel");
const themePanelOverlay = document.getElementById("themePanelOverlay");
const themePanelClose = document.getElementById("themePanelClose");
const themeOptions = document.querySelectorAll(".theme-option");

// Load saved theme from localStorage
const loadTheme = () => {
  const savedTheme = localStorage.getItem("portfolio-theme") || "cyber-blue";
  applyTheme(savedTheme);
};

// Apply theme
const applyTheme = (themeName) => {
  // Remove all theme classes
  document.documentElement.removeAttribute("data-theme");

  // Apply new theme (except for default cyber-blue)
  if (themeName !== "cyber-blue") {
    document.documentElement.setAttribute("data-theme", themeName);
  }

  // Update active state in theme options
  themeOptions.forEach((option) => {
    if (option.getAttribute("data-theme") === themeName) {
      option.classList.add("active");
    } else {
      option.classList.remove("active");
    }
  });

  // Save to localStorage
  localStorage.setItem("portfolio-theme", themeName);
};

// Open theme panel
const openThemePanel = () => {
  themePanel.classList.add("active");
  themePanelOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
};

// Close theme panel
const closeThemePanel = () => {
  themePanel.classList.remove("active");
  themePanelOverlay.classList.remove("active");
  document.body.style.overflow = "";
};

// Event listeners
themeToggleBtn?.addEventListener("click", openThemePanel);
themePanelClose?.addEventListener("click", closeThemePanel);
themePanelOverlay?.addEventListener("click", closeThemePanel);

// Theme option click handlers
themeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const themeName = option.getAttribute("data-theme");
    applyTheme(themeName);

    // Add a nice feedback animation
    option.style.transform = "scale(0.95)";
    setTimeout(() => {
      option.style.transform = "";
    }, 150);

    // Close panel after a short delay
    setTimeout(() => {
      closeThemePanel();
    }, 300);
  });
});

// Close theme panel on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && themePanel.classList.contains("active")) {
    closeThemePanel();
  }
});

// Load theme on page load
loadTheme();

// Add smooth transition when theme changes
document.documentElement.style.transition =
  "background-color 0.3s ease, color 0.3s ease";

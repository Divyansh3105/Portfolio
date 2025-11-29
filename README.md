# 🚀 Divyansh Garg - Portfolio Website

A modern, responsive portfolio website showcasing web development projects and skills with stunning animations, glassmorphism design, and full accessibility support.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🌐 Live Demo

**[View Live Portfolio →](https://divyansh3105.github.io/)**

Experience the portfolio in action with all its features:

- 🎨 4 stunning themes
- ⌨️ Full keyboard navigation
- 📱 Responsive design
- ✨ Smooth animations
- 📧 Working contact form

---

## 📑 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Technologies Used](#️-technologies-used)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Customization Guide](#-customization-guide)
- [Performance](#-performance)
- [Accessibility](#-accessibility-features)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### 🎨 Design & UI

- **Glassmorphism Design** - Modern frosted glass effects with backdrop blur
- **Gradient Accents** - Beautiful color gradients throughout the interface
- **Animated Backgrounds** - SVG mesh animations, gradient orbs, and blur blobs
- **Smooth Parallax** - Multi-layer parallax scrolling effects
- **4 Theme Options** - Cyber Blue, Purple Aurora, Frost White, Sunset Red
- **Responsive Layout** - Fully responsive across all devices

### 🎭 Animations & Effects

- **Scroll-Based Parallax** - Sections, backgrounds, and text move at different speeds
- **Hero Fade Effect** - Content fades as you scroll down
- **Intro Animations** - Staggered section reveals on page load
- **Smooth Transitions** - 0.4s theme transitions with fade overlay
- **Confetti Effect** - Celebration animation on form submission
- **Hover Effects** - Interactive cards with lift and glow effects

### 🎯 Interactive Elements

- **Project Modals** - Detailed project information with tech stack and features
- **Contact Form** - Real-time validation with success/error animations
- **Theme Switcher** - Live theme preview with smooth transitions
- **Skill Cards** - Interactive cards with progress bars and 3D tilt effect
- **Navigation** - Smooth scroll with progress indicator

### ⌨️ Accessibility

- **Keyboard Navigation** - Full keyboard support with visual indicators
- **Focus Management** - Proper focus trap in modals
- **Screen Reader Support** - ARIA labels and semantic HTML
- **Skip to Content** - Quick navigation for screen readers
- **Keyboard Shortcuts**:
  - `Tab` / `Shift+Tab` - Navigate elements
  - `Enter` / `Space` - Activate elements
  - `Escape` - Close modals
  - `←` / `→` - Navigate between projects in modal
  - `↑` / `↓` - Navigate theme options

### 📧 Contact Form

- **Real-Time Validation** - Email format, minimum character requirements
- **Character Counter** - Visual feedback for message length
- **Formspree Integration** - Reliable form submission
- **Success/Error States** - Animated feedback messages
- **Spam Prevention** - Honeypot field included

### 🎨 Theme System

- **4 Beautiful Themes**:
  - 🌌 **Cyber Blue** (Default) - Dark with blue/purple gradients
  - 💜 **Purple Aurora** - Vibrant purple and pink
  - ❄️ **Frost White** - Clean light theme
  - 🌅 **Sunset Red** - Warm orange and red tones
- **Smooth Transitions** - 0.4s fade between themes
- **LocalStorage** - Theme preference saved
- **Live Preview** - See colors before selecting

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, Animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **Formspree** - Form submission handling
- **Google Fonts** - Space Grotesk font family

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── Styles.css          # All styles and animations
├── main.js            # JavaScript functionality
├── Media/             # Images and assets
│   ├── favicon.ico
│   ├── AC SS.png
│   ├── COD SS.png
│   ├── Smart Sorter SS.png
│   └── ...
├── LICENSE            # MIT License
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic text editor (VS Code recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Divyansh3105/portfolio.git
   cd portfolio
   ```

2. **Open in browser**

   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Customize**
   - Update personal information in `index.html`
   - Modify colors in CSS variables (`:root` section)
   - Add your projects to `projectsData` in `main.js`
   - Replace images in `Media/` folder

## 🎨 Customization Guide

### Changing Colors

Edit CSS variables in `Styles.css`:

```css
:root {
  --bg-primary: #0a0a0f;
  --accent-primary: #667eea;
  --text-primary: #ffffff;
  /* ... more variables */
}
```

### Adding Projects

Update `projectsData` object in `main.js`:

```javascript
const projectsData = {
  yourProject: {
    title: "Your Project",
    image: "path/to/image.png",
    description: "Project description",
    tech: ["HTML", "CSS", "JS"],
    features: ["Feature 1", "Feature 2"],
    liveLink: "https://...",
    codeLink: "https://github.com/...",
  },
};
```

### Modifying Form

Update Formspree endpoint in `index.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST"></form>
```

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Mobile Optimized**: Parallax disabled on mobile for better performance
- **Lazy Loading**: Images load as needed
- **Optimized Animations**: Uses `requestAnimationFrame` for 60fps

## ♿ Accessibility Features

- **WCAG 2.1 Level AA Compliant**
- **Keyboard Navigation** - Full site navigable via keyboard
- **Screen Reader Support** - Proper ARIA labels and semantic HTML
- **Focus Indicators** - Clear visual focus states
- **Color Contrast** - Meets WCAG contrast requirements
- **Reduced Motion** - Respects `prefers-reduced-motion`

## 🌐 Browser Support

| Browser | Version |
| ------- | ------- |
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🎯 Key Features Breakdown

### Parallax System

- Hero content fade on scroll
- Section backgrounds move independently
- Text elements with fade-in effect
- Project cards with staggered movement
- Optimized with `requestAnimationFrame`

### Theme System

- 4 pre-built themes
- Smooth 0.4s transitions
- Fade overlay during switch
- LocalStorage persistence
- CSS custom properties

### Form Validation

- Real-time email validation
- Character counter (10-1000 chars)
- Visual error states
- Success confetti animation
- Spam prevention

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Divyansh Garg**

- GitHub: [@Divyansh3105](https://github.com/Divyansh3105)
- LinkedIn: [divyanshgarg3105](https://www.linkedin.com/in/divyanshgarg3105/)
- Email: divyanshgarg3105@gmail.com

## 🙏 Acknowledgments

- Font: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) by Google Fonts
- Form Handling: [Formspree](https://formspree.io/)
- Icons: SVG icons (inline)
- Inspiration: Modern web design trends and glassmorphism

## 🔮 Future Enhancements

- [ ] Blog section
- [ ] Dark mode toggle animation
- [ ] More theme options
- [ ] Project filtering by technology
- [ ] Testimonials section
- [ ] Analytics integration
- [ ] PWA support
- [ ] Multi-language support

## 📈 Changelog

### Version 1.0.0 (Current)

- ✅ Initial release
- ✅ 4 theme system
- ✅ Parallax scrolling
- ✅ Contact form with validation
- ✅ Full keyboard accessibility
- ✅ Project modals
- ✅ Responsive design

---

⭐ **Star this repo if you found it helpful!**

Made with ❤️ by Divyansh Garg

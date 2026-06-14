# Copilot Instructions for Evyatar-Hazan Portfolio

This is a **React + TypeScript SPA portfolio website** built with Vite, featuring smooth animations, internationalization (i18n), and dark mode support.

## Quick Start

### Commands
```bash
npm run dev      # Start Vite dev server (port 5173)
npm run build    # Compile TypeScript + build with Vite
npm run lint     # Run ESLint checker
npm run preview  # Preview production build
```

### Project Structure
```
src/
  pages/           → Page layouts (Home.tsx)
  components/      → Reusable components
    └─ sections/   → Page sections (About, Projects, Contact)
    └─ animations/ → Custom animation wrappers (Magnetic, CustomCursor, etc.)
  hooks/          → Custom React hooks (useTheme)
  locales/        → i18n translations (en.json, he.json)
  assets/         → Images/static files
  i18n.ts         → i18n configuration
  main.tsx        → Entry point
```

## Architecture & Patterns

### Component Organization
- **UI Components**: [Button.tsx](../src/components/Button.tsx), [Card.tsx](../src/components/Card.tsx) use Framer Motion with variants
- **Animation Wrappers**: 
  - **Magnetic**: Attracting effect on mouseover (configurable `intensity`)
  - **CustomCursor**: Custom pointer animation (disabled on mobile < 768px)
  - **ScrollProgress**: Progress bar based on scroll position
- **Sections**: Structured as separate components with scroll anchors (#home, #about, etc.)

### Key Technologies

| Tech | Version | Usage |
|------|---------|-------|
| **React** | 19.2.0 | Component framework |
| **TypeScript** | 5.9.3 | Strict mode with `noUnusedLocals` & `noUnusedParameters` |
| **Vite** | 7.3 | Build tool + dev server |
| **Tailwind CSS** | 4.2 | Utility styling with `@theme` directive (no config file) |
| **Framer Motion** | 12.34 | All animations (motion components, hooks) |
| **i18next** | 26.0 | Translations + auto language detection (EN/HE) |
| **Lucide React** | 0.575 | Icon library |

### Styling & Theme
- **Framework**: Tailwind CSS 4.2 with `@tailwindcss/vite` plugin
- **Theme config**: Located in [src/index.css](../src/index.css) via `@theme` block (custom `primary-{50-950}` palette)
- **Dark mode**: Class-based (`.dark` on `<html>`) managed by [useTheme.ts](../src/hooks/useTheme.ts) hook
- **Persistent**: Theme preference saved to `localStorage`

### Internationalization (i18n)
- **Languages**: English (en) and Hebrew (he)
- **Auto-detection**: Browser language detected on first load via `i18next-browser-languagedetector`
- **RTL support**: RTL layout applied via `dir={language === 'he' ? 'rtl' : 'ltr'}` on root
- **Hook usage**: `const { t, i18n } = useTranslation()` in components
- **Fallback**: Default to 'en' if detection fails

## Project Conventions

### Naming & Structure
- **Components**: PascalCase filenames (e.g., `Button.tsx`, `Navbar.tsx`)
- **Interfaces/Props**: Suffix with `Props` (e.g., `ButtonProps`, `CardProps`)
- **Exports**: Named exports preferred for components
- **Custom hooks**: Prefix with `use` (e.g., `useTheme`)

### Motion & Animation Patterns
- **All interactive elements** wrapped with Framer Motion (`motion.button`, `motion.div`, etc.)
- **Variants pattern**: Define animation states as objects:
  ```tsx
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  };
  <motion.button variants={variants} initial="initial" animate="animate" />
  ```
- **Common hooks**: `useScroll()`, `useMotionValue()`, `useTransform()`, `useSpring()`

### TypeScript
- Strict mode enabled
- Avoid unused variables/parameters
- Use `React.ReactNode` for children props
- Motion component types: `HTMLMotionProps<"button">`, `HTMLMotionProps<"div">`, etc.

## Critical Pitfalls ⚠️

### 1. **RTL Layout Cascading**
- RTL direction applied at root affects **all** child margins/padding
- **Fix**: Test margin/padding values carefully when adding new sections
- Right-to-left reversal applies to `ml-4` → becomes right margin in RTL

### 2. **Scroll Restoration**
- No URL routing means page refresh scrolls to top
- **Fix**: Use hash anchors (`#about`, `#projects`) for navigation, or implement scroll restoration if needed

### 3. **Mobile Menu Overflow Hidden**
- Navbar sets `document.body.style.overflow = 'hidden'` when mobile menu opens
- **Fix**: Ensure this is **always cleared** on menu close, or page becomes unscrollable

### 4. **Custom Cursor on Mobile**
- CustomCursor disabled on touch devices (hardcoded at < 768px breakpoint)
- **Fix**: Don't assume custom cursor is always active; test on mobile

### 5. **Tailwind v4 Differences**
- No `tailwind.config.js` file (using `@tailwindcss/vite` plugin instead)
- Theme customization done in `src/index.css` via `@theme` directive
- **Fix**: Don't create a config file—modify `@theme` block in index.css

### 6. **i18n Language Detection Timing**
- Language may be detected after initial render
- **Fix**: Provide sensible defaults, use `fallback='en'` in i18n config

## Development Workflow

### Before Making Changes
1. Check if component already exists in `src/components/`
2. Review similar components for animation/styling patterns
3. Test dark mode and RTL layout for new components
4. Ensure translations exist in both `locales/en.json` and `locales/he.json`

### When Adding New Features
- **New section**: Create in `src/components/sections/`, map to scroll anchor, add translations
- **New animation**: Consider wrapping in `src/components/animations/` for reusability
- **New UI component**: Use Button/Card pattern, wrap with Framer Motion for interactions
- **Theme colors**: Update `@theme` block in `src/index.css`, reference via `primary-*` utilities

### Testing Checklist
- [ ] Runs without errors: `npm run build`
- [ ] Passes linting: `npm run lint`
- [ ] Works in light mode and dark mode
- [ ] Works in English (LTR) and Hebrew (RTL)
- [ ] No unused variables/parameters (strict TypeScript)
- [ ] Mobile menu closes properly (no overflow hidden lingering)
- [ ] Custom cursor disabled on mobile (< 768px)

## File References

- **Root component**: [src/App.tsx](../src/App.tsx) — i18n setup + animation wrappers
- **Navigation**: [src/components/Navbar.tsx](../src/components/Navbar.tsx) — scroll hide, theme switcher, language switcher
- **Button template**: [src/components/Button.tsx](../src/components/Button.tsx) — motion variants + dynamic props
- **Card template**: [src/components/Card.tsx](../src/components/Card.tsx) — 3D tilt using useMotionValue + useTransform
- **Theme hook**: [src/hooks/useTheme.ts](../src/hooks/useTheme.ts) — localStorage + class-based dark mode
- **Styles**: [src/index.css](../src/index.css) — custom scrollbar, animations, @theme block
- **Translations**: [src/locales/](../src/locales/) — en.json, he.json

## Performance Notes

- All images should be optimized (PNG/JPEG, < 100KB recommended)
- Framer Motion animations use GPU acceleration (transforms/opacity preferred over layout changes)
- Avoid reanimating during scroll (use `useMotionValueEvent` with throttling if needed)
- Lazy load sections if list grows significantly (use React.lazy + Suspense)

---

**Last Updated**: April 2026  
**Maintained By**: Evyatar Hazan

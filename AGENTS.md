# Detrito Espacial Website

## Project Overview
Artistic portfolio website for a post-hardcore/shoegaze band. **Not a conventional landing page** — the goal is to enchant and abstract the band's aesthetic.

## Tech Stack
- ReactJS + Tailwind CSS
- GSAP + ScrollTrigger + ScrollSmoother
- 12-column grid system

## Design Constraints

### Grid System
- 12 columns, margin 27, gutter 33
- For equal distribution: position container on grid, use `flex justify-between` internally (suggest better if it doesn't make sense)

### Colors
- Background: `#171017`
- Accent: `#655513`
- Text: `#CCCCCC`

### Typography
- Headlines: font family **"kingjola"**

### Visual Effects
- Sections: 100vh each
- Background images: dark overlay `black/40` (use `bg-black/40` or similar)
- Text reveal: blur-to-focus animation
- Transitions: `clip-path` rectangular growing from center
- Custom scrollbar: thin and elegant

### Preloader
- SVG text writing animation with the band name

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
```

## Notes
- Minimalist — few texts, few details
- Texts positioned freely on grid for intentional "chaotic but pleasant" feel
- Site is not meant to sell — focus on aesthetic impact
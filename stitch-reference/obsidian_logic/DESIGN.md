---
name: Obsidian Logic
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for IntervueAI, a high-performance interview preparation platform for developers. The brand personality is authoritative, technical, and hyper-focused, mirroring the intensity of a high-stakes technical interview. 

The visual style blends **SaaS Minimalism** with **Refined Glassmorphism**. It utilizes a "Dark-First" philosophy to reduce eye strain during long coding sessions, employing depth through subtle luminosity rather than heavy shadows. The aesthetic is professional and "IDE-adjacent," ensuring developers feel in a native environment. Every interface element is designed to feel like a precision tool—efficient, responsive, and devoid of unnecessary decoration.

## Colors

The palette is anchored in deep, near-black neutrals to provide a stable foundation for technical content. 

- **Primary (#3B82F6):** An electric blue used for primary actions, progress indicators, and active states. It represents focus and clarity.
- **Secondary (#8B5CF6):** A deep violet used for AI-augmented features, specialized insights, and secondary branding elements.
- **Neutrals:** The background uses `#0A0A0B`, while elevated surfaces use `#121214`.
- **Accents:** Use low-opacity tints of the primary and secondary colors for "glow" effects and subtle glass backgrounds.
- **Semantic:** Success (Emerald-400), Warning (Amber-400), and Error (Rose-500) colors should be used sparingly against the dark background to ensure high signal-to-noise ratios.

## Typography

This design system uses a triple-font strategy to balance character with utility:
1. **Geist** is used for headlines to provide a sharp, technical, and modern geometric feel.
2. **Inter** is the workhorse for body copy, chosen for its exceptional legibility at small sizes and neutral tone.
3. **JetBrains Mono** is utilized for labels, badges, and code snippets to reinforce the developer-centric nature of the platform.

Maintain high contrast for headlines (White #FFFFFF) and slightly reduced contrast for body text (Zinc-400 #A1A1AA) to create a clear information hierarchy.

## Layout & Spacing

The layout follows a **Fluid Grid** model with strict adherence to an 8px spacing system. 

- **Desktop:** 12-column grid with a 1280px max-width container. Gutters are fixed at 24px to ensure breathing room between technical data points.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px margins.

Use "Stack" components for vertical rhythm, preferring generous white space (32px+) between major sections to prevent the dark UI from feeling cramped. Alignment should be mathematically precise, emphasizing the "technical" nature of the product.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Subtle Glassmorphism**:

1.  **Level 0 (Background):** `#0A0A0B` - The base canvas.
2.  **Level 1 (Card/Container):** `#121214` with a 1px solid border of `#27272A`.
3.  **Level 2 (Floating/Overlay):** Same as Level 1 but with a 15% opacity primary/secondary glow background-blur (20px) behind it.
4.  **Glass Effects:** Use `backdrop-filter: blur(12px)` with a `rgba(255, 255, 255, 0.03)` fill for navigation bars and dropdowns.

Shadows are avoided in favor of subtle inner borders and outer "light leaks" (low-opacity color glows) to simulate a high-end hardware interface.

## Shapes

The shape language is "Sophisticated-Soft." Elements use a base radius of **8px (0.5rem)**. 

- **Small elements (Checkboxes, Tags):** 4px.
- **Standard elements (Buttons, Inputs, Cards):** 8px.
- **Large containers (Modals, Feature blocks):** 16px.

This moderate roundedness prevents the UI from feeling too aggressive (sharp) or too consumer-grade/bubbly (pill-shaped). It strikes a balance that feels professional and contemporary.

## Components

- **Buttons:** 
    - *Primary:* Solid `#3B82F6` with white text. 
    - *Secondary:* Ghost style with 1px border `#27272A` and hover state lifting to `#18181B`. 
    - *Tertiary:* Text-only with Mono font for "Developer-first" actions.
- **Input Fields:** Darker than the surface background (`#050505`), 1px border, and a 2px Primary Blue focus ring with a 4px soft outer glow.
- **Chips/Badges:** Use JetBrains Mono. Success states use a subtle green tint with 10% opacity background and 100% opacity text.
- **Cards:** No shadows. Use a 1px border `#27272A`. On hover, the border color transitions to the primary or secondary accent color.
- **Code Editor/Blocks:** Use a custom theme matching the system colors, with `#121214` as the background and syntax highlighting following the Primary/Secondary/Accent palette.
- **AI Feedback Panels:** Distinguished by a subtle `linear-gradient` border (Primary to Secondary) to indicate "Smart" or "Generated" content.
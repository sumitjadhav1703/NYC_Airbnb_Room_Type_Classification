---
name: Velorah
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#a8cbe8'
  on-secondary: '#0c334b'
  secondary-container: '#2a4c65'
  on-secondary-container: '#9abcd9'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#cae6ff'
  secondary-fixed-dim: '#a8cbe8'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#274a62'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display-lg:
    fontFamily: Instrument Serif
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Instrument Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Instrument Serif
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Instrument Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style
The design system is built upon a cinematic, high-fashion aesthetic that emphasizes mystery, precision, and clarity. It targets premium audiences who value an editorial feel and an immersive digital experience. 

The visual style is a fusion of **Minimalism** and **Liquid-Glassmorphism**. It utilizes deep, atmospheric voids contrasted with razor-sharp typography and translucent structural layers. The interface should feel like a high-end projection on glass—ethereal yet structurally grounded. Every element is intentional, with significant negative space to allow the content to breathe and command attention.

## Colors
The palette is rooted in a deep, nocturnal Navy (`HSL(201, 100%, 13%)`) to provide an infinite sense of depth. White is used as the primary action and display color to create a piercing contrast against the dark void.

- **Primary**: Pure white for high-impact elements and calls to action.
- **Surface**: Translucent variations of the background color are used to create the "Liquid Glass" effect.
- **Muted**: A desaturated zinc-gray for secondary information to maintain visual hierarchy without clutter.
- **Border**: A subtle, dark charcoal used for ultra-thin structural definitions.

## Typography
The typography strategy relies on the tension between a sophisticated serif and a utilitarian sans-serif. 

**Instrument Serif** is used for all display and headline levels. It should be typeset with tight letter-spacing to enhance its editorial, high-contrast nature. 

**Inter** handles all functional and body text. It is chosen for its neutrality and extreme legibility at small sizes. Use `label-caps` for small tags, eyebrows, and button labels to inject a sense of technical precision into the layout.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain a controlled, cinematic composition, transitioning to a fluid model on mobile.

- **Grid**: 12-column grid with generous 24px gutters.
- **Rhythm**: All spacing (margins, padding) must be multiples of 4px. Use large vertical gaps (80px, 120px, 160px) between sections to emphasize the minimalist aesthetic.
- **Alignment**: Primary content should often be center-aligned or use asymmetric "editorial" offsets to break the monotony of standard SaaS layouts.

## Elevation & Depth
This design system rejects traditional shadows in favor of **Liquid Glass** layering.

- **Backdrop Blur**: Use a heavy 20px to 40px blur on all surface layers.
- **Transparency**: Surfaces should be approximately 10-20% opacity of the background color.
- **Thin Gradient Borders**: Instead of shadows, depth is defined by a 1px border. Use a linear gradient on the border (from top-left to bottom-right) starting at `white/20%` and fading to `white/5%`.
- **Z-Index Hierarchy**: Higher elevation levels are indicated by increasing the brightness of the glass surface slightly, rather than adding shadow.

## Shapes
The shape language is sharp and architectural. While the roundedness is set to `Soft (0.25rem)`, this is primarily to take the "edge" off digital screens. For large containers and images, use `0px` (Sharp) corners to maintain the brutalist-minimalist influence. Interactive components like buttons and inputs use the `rounded-sm` setting to provide a subtle hint of affordance.

## Components
- **Buttons**: Primary buttons are solid White with Black text. Secondary buttons are "Liquid Glass" with a 1px white border. All labels use the `label-caps` style.
- **Inputs**: Minimalist underlines or 1px glass containers. Focus state is indicated by a brightening of the border or a subtle vertical cursor blink in white.
- **Cards**: Background-less or Liquid Glass. Use ultra-thin borders. Avoid any inner padding for images; let them run edge-to-edge within the card frame.
- **Navigation**: A fixed top bar with a heavy backdrop blur. No background color, only a 1px bottom border.
- **Chips/Tags**: Small, sharp-cornered boxes with a semi-transparent white stroke and `label-caps` typography.
- **Transitions**: All interactions should be timed at 300ms-500ms with an `expo-out` easing to mimic a cinematic fade or slide.
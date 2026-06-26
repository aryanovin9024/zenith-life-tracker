---
name: Zen Nocturne
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#bdce89'
  on-secondary: '#283501'
  secondary-container: '#3e4c16'
  on-secondary-container: '#acbc7a'
  tertiary: '#c0d0e2'
  on-tertiary: '#223240'
  tertiary-container: '#a5b5c6'
  on-tertiary-container: '#374755'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#d9eaa3'
  secondary-fixed-dim: '#bdce89'
  on-secondary-fixed: '#161f00'
  on-secondary-fixed-variant: '#3e4c16'
  tertiary-fixed: '#d4e4f6'
  tertiary-fixed-dim: '#b8c8da'
  on-tertiary-fixed: '#0d1d2a'
  on-tertiary-fixed-variant: '#394857'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '300'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '300'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  signature-num:
    fontFamily: Newsreader
    fontSize: 64px
    fontWeight: '200'
    lineHeight: 64px
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
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 64px
  gutter: 16px
  section-gap: 48px
---

## Brand & Style
The design system is centered on the concept of a "Personal Instrument"—a high-end, quiet tool for self-reflection and life-tracking. It evokes the feeling of a premium physical journal or a precision-engineered watch. The aesthetic is rooted in **Modern Minimalism** with a **Tactile** edge, prioritizing mental clarity through intentional friction and generous negative space. 

The target audience consists of mindful professionals and individuals seeking a sanctuary from the "attention economy." The emotional response is one of calm, authority, and intimacy. The interface stays out of the way, emerging only when interaction is required, using high-contrast typography and subtle depth to guide the eye.

## Colors
This design system utilizes a deep "Ink Black" foundation to reduce eye strain and create a sense of infinite space. The palette is categorized by muted, earthy tones that signify different life pillars without breaking the monochromatic tranquility.

- **Primary (Overall):** Deep Gold (#D4AF37). Used for signature moments, primary actions, and milestones.
- **Fitness:** Sage Green (#8A9A5B). Muted and organic.
- **Work:** Slate Blue (#708090). Professional and stable.
- **Learning:** Ochre (#B87333). Warm and intellectual.
- **Relationships:** Terracotta (#C04000). Earthy and emotive.
- **Neutral/Background:** Ink Black (#121214).
- **Surface:** A slightly elevated dark grey (#1C1C1E) for card-based architecture.

## Typography
The typography strategy relies on a sophisticated tension between the literary elegance of **Newsreader** and the functional precision of **Inter**.

- **Headlines & Signature Numbers:** Use Newsreader. Large numbers (tracking metrics) should be rendered in light weights or italics to feel like hand-inked entries in a ledger.
- **UI & Content:** Use Inter. This provides a neutral, systematic counterpoint to the expressive serif, ensuring that data density remains legible and professional.
- **Scaling:** Mobile displays should prioritize vertical rhythm, dropping Display sizes by approximately 25% to maintain a comfortable reading line.

## Layout & Spacing
This design system employs a **Fixed Grid** on desktop (max-width 1200px) and a **Fluid Grid** on mobile. The spacing philosophy is "breathable luxury"—using more whitespace than is strictly necessary to prevent the user from feeling overwhelmed by their own data.

- **Grid:** 12-column layout for desktop; 4-column for mobile.
- **Margins:** Large outer margins (64px on desktop) focus the eye on the central "instrument" panel.
- **Rhythm:** All vertical spacing follows an 8px base unit. Section headers are separated from content by a minimum of 48px to create clear mental breaks between different life categories.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. Because the background is true black, elevation is achieved by lightening the surface color and adding very soft, large-radius shadows.

- **Level 0 (Background):** Ink Black (#121214).
- **Level 1 (Cards/Surfaces):** Surface (#1C1C1E). These elements use a 1px subtle border (#2C2C2E) to define edges without relying solely on shadows.
- **Shadows:** Use a "Midnight Blur"—a 32px blur radius with 40% opacity black, slightly offset on the Y-axis (8px) to suggest a gentle hover above the ink.
- **Interactions:** When an element is pressed, it should "sink" into the background (scale 0.98x) and lose its shadow, creating a tactile physical response.

## Shapes
The shape language is "Tailored Softness." All primary cards and containers utilize a **16px (rounded-lg)** corner radius to soften the high-contrast dark mode. 

Buttons and smaller interactive elements (inputs, chips) use an **8px (rounded-md)** radius to maintain a sense of precision. Icons should be drawn with a 1.5pt stroke weight and rounded terminals to match the font characteristics of Inter.

## Components
- **Buttons:** Primary buttons are Deep Gold with Ink Black text. Secondary buttons are outlined with 1px Slate Blue. Ghost buttons are reserved for "Cancel" or "Back" actions.
- **Cards:** Cards are the primary container. They must have a 16px corner radius and a subtle 1px border. No internal dividers; use whitespace to separate card content.
- **Signature Metrics:** Large numeric trackers (e.g., "7.5 hours") should be displayed in Newsreader Italic, using the category's muted color for the value and a neutral label for the unit.
- **Chips/Tags:** Used for categorization. These are pill-shaped with a low-opacity background tint of the category color and high-contrast text.
- **Inputs:** Simple bottom-border only ("Underline" style) for a minimalist, journal-like feel. The border thickens and turns Deep Gold on focus.
- **Lists:** High-density lists are avoided. Instead, use "Timeline items" with large vertical gaps and a thin vertical line connecting related entries.
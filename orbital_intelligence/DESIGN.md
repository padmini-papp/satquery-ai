---
name: Orbital Intelligence
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#bbc9cd'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#859397'
  outline-variant: '#3c494c'
  surface-tint: '#2fd9f4'
  primary: '#8aebff'
  on-primary: '#00363e'
  primary-container: '#22d3ee'
  on-primary-container: '#005763'
  inverse-primary: '#006877'
  secondary: '#7bd1fa'
  on-secondary: '#003547'
  secondary-container: '#00799e'
  on-secondary-container: '#e9f6ff'
  tertiary: '#68f5b8'
  on-tertiary: '#003824'
  tertiary-container: '#46d89d'
  on-tertiary-container: '#005a3d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a2eeff'
  primary-fixed-dim: '#2fd9f4'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#c0e8ff'
  secondary-fixed-dim: '#7bd1fa'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d66'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  grid-overlay-size: 64px
---

## Brand & Style

The design system is engineered for high-stakes aerospace analysis, evoking the precision of a mission control workstation. It targets data scientists, geospatial analysts, and defense intelligence officers who require a high-density, low-fatigue environment for long-duration monitoring and complex decision-making.

The aesthetic follows a **Technical Modernism** approach:
- **Cinematic Depth:** Utilizing a deep-space palette that minimizes light pollution, allowing satellite imagery and data overlays to remain the focal point.
- **Precision Engineering:** Incorporating thin, luminous borders and micro-interactions that mimic high-end optical instruments.
- **Functional Glassmorphism:** Employing semi-transparent layers to maintain spatial awareness of the underlying map or image data while interacting with analysis panels.
- **Instrumental Clarity:** Every element must feel like a calibrated tool, using subtle grid patterns and technical markings (e.g., coordinate crosshairs, corner brackets) to reinforce the sense of accuracy.

## Colors

The palette is rooted in deep-space darkness to enhance the vibrancy of multi-spectral satellite imagery.

- **Primary & Action:** Cyan (#22d3ee) is reserved for interactive states, primary focus, and active data streams. Ice-blue (#7dd3fc) serves as a supportive highlight for secondary interactive elements.
- **Surface Strategy:** Backgrounds utilize a near-black (#020617) to provide infinite depth. Interactive panels and containers use Surface Navy (#0f172a) to create a subtle separation from the base canvas.
- **Technical Indicators:** Success and high-confidence AI detections use Emerald (#10b981). Critical alerts and target locks utilize a sharp Red (#ef4444) for immediate visual hierarchy.
- **Typography:** Text Primary is a crisp off-white for maximum legibility against dark backgrounds, while Secondary text uses Slate for metadata and less critical information.

## Typography

This design system employs a tiered typography strategy to balance editorial clarity with technical data density.

- **Display & Headlines:** Uses **Geist** for its technical, sharp apertures and modern geometric construction, providing a "high-tech" look for major section headers.
- **Interface & Body:** Uses **Inter** for standard UI elements and long-form analysis text. Its neutrality ensures that complex information is easily digestible.
- **Technical Data:** Uses **JetBrains Mono** for coordinates, timestamps, confidence scores, and status readouts. The monospaced nature ensures that shifting values do not cause layout jitters during real-time updates.
- **Letter Spacing:** Headlines utilize tight tracking for a compact look, while monospaced labels use slightly expanded tracking for better legibility at small sizes.

## Layout & Spacing

The layout is designed as a **Fixed-Component Grid** system, optimized for dashboard-heavy environments.

- **Base Unit:** A 4px hard grid governs all spacing, ensuring perfect mathematical alignment between components.
- **Grid Overlay:** A subtle background grid (64px intervals) is used on the primary canvas to provide a sense of scale and orientation.
- **Dashboard Layout:** Desktop views utilize a "Command Center" layout: a fixed navigation rail (72px width), collapsible side-panels for analysis tools (320px - 400px), and a fluid central viewport for imagery.
- **Mobile Reflow:** Sidebars collapse into bottom-sheet overlays or full-screen modal layers to maximize the visibility of satellite imagery on small screens.

## Elevation & Depth

In a dark, deep-space environment, depth is achieved through **luminance and transparency** rather than heavy shadows.

- **Tonal Tiers:** Surfaces move "closer" to the user by increasing in brightness. Base canvas is #020617; floating panels are #0f172a.
- **Luminous Outlines:** Interactive elements use 1px or 0.5px borders. Active elements feature a Cyan (#22d3ee) glow (0px 0px 8px rgba(34, 211, 238, 0.3)).
- **Glassmorphism:** Overlays and floating controls use a backdrop-blur (12px to 20px) with 60-80% opacity on the surface color. This allows the user to maintain visual context of the map data beneath the UI.
- **Technical Markings:** Use "L-shaped" corner brackets on panels to indicate targeted containers. Use a very low-opacity white (alpha 0.05) for the background grid pattern.

## Shapes

The shape language is **Technical and Precise**. 

- **Corner Radius:** A "Soft" approach is used, but kept very subtle (4px) to maintain a professional, architectural feel. 
- **Buttons & Inputs:** Standard components use the 4px radius. Small status indicators or "Target Locks" may use sharp (0px) corners to emphasize precision.
- **Geometric Accents:** Utilize 45-degree chamfered edges (sparingly) on secondary buttons or panel headers to evoke aerospace fuselage design.

## Components

- **Buttons:**
    - *Primary:* Solid Cyan (#22d3ee) with Text Deep Space.
    - *Secondary:* Ghost style with 1px Ice-blue border and Ice-blue text.
    - *Technical:* Transparent background, borderless, with JetBrains Mono text and a subtle icon.
- **Analysis Chips:** Compact tags used for object detection (e.g., "TANKER", "VEHICLE"). Use semi-transparent Emerald background for high confidence, and Amber for low confidence.
- **Glass Containers:** Used for AI Chat and Layer controls. Must feature a 0.5px border (#1e293b) and `backdrop-filter: blur(16px)`.
- **Input Fields:** Dark navy background with a subtle bottom-border. On focus, the border transitions to Cyan with a micro-glow effect.
- **Status Indicators:** Pulsing dot indicators for "Live Stream" or "Satellite Connection." Use the `mono-label` typography for adjacent text readouts.
- **Telemetry Cards:** High-density cards for coordinate data and metadata. Use a grid-aligned layout with JetBrains Mono for all numeric values.
- **Data Visualizations:** Charts and graphs should use the accent colors (Cyan, Ice-blue, Emerald) against the dark background, avoiding solid fills in favor of strokes and gradients.
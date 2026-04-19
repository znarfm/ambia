# Design System Specification: The Sensory Sanctuary

## 1. Overview & Creative North Star

North Star: **"The Digital Breath."**

"Quiet UI" aesthetic. Recede into background, prioritize auditory experience. High-end editorial feel. No standard container/divider layouts. **Negative Space as Content**. Intentional asymmetry. Balance by weight/tone, not rigid grid. Bespoke, premium feel.

---

## 2. Colors & Surface Philosophy

"Atmospheric Depth" palette. Tonal system, alive + dimensional.

### The "No-Line" Rule

**Instruction:** No 1px solid borders for sectioning. Define boundaries via background color shifts.

- Card: `surface-container-low` on `surface` background.
- Contrast: `#0e0e0e` (Surface) vs `#191a1a` (Surface Container) for soft edges.

### Surface Hierarchy & Nesting

Stacked physical layers (fine paper).

- **Base:** `surface` (#0e0e0e)
- **Containers:** `surface-container` (#191a1a)
- **Overlays:** `surface-container-highest` (#252626)

### The "Glass & Gradient" Rule

Glassmorphism for floating controls (volume, timer).

- **Recipe:** `surface-container-high` (80% opacity) + `24px` backdrop-blur.
- **CTAs:** Linear gradient `primary` (#e3c28e) to `primary-container` (#5a431a). Soft glow effect.

---

## 3. Typography: The Editorial Voice

**Manrope** throughout. Geometric, warm, legible.

- **Display (`display-lg` to `display-sm`):** Immersive moments (soundscape name). Tracking `-0.02em`.
- **Body (`body-lg` to `body-sm`):** Descriptions/settings. Line-height `1.6`, tracking `0.01em`. Generous leading.
- **Labels (`label-md` to `label-sm`):** Metadata. All-Caps, `0.05em` tracking. Authoritative contrast.

---

## 4. Elevation & Depth

**Tonal Layering** over lines/shadows.

### The Layering Principle

`surface-container-lowest` (#000000) card on `surface-container-low` (#131313) section. Recessed/tactile effect.

### Ambient Shadows

Floating elements (play bar) use "Ambient Shadows":

- **Color:** 15% opacity `on-surface` (#e7e5e5).
- **Properties:** 0px X, 12px Y, 40px Blur. Diffused light lift.

### The "Ghost Border" Fallback

Accessibility only.

- Token: `outline-variant` (#484848).
- Opacity: 20% max. "Barely there."

---

## 5. Components

### Primary Buttons

- **Shape:** `full` (9999px) or `xl` (1.5rem).
- **Style:** Gradient fill (`primary` to `primary_dim`).
- **Interaction:** Subtle "glow" on hover (`primary_fixed` shadow, 10% opacity).
- **Sizing:** Min height 64px. Effortless touch.

### Soundscape Cards

- No divider lines.
- Base: `surface-container-high`. `lg` (1rem) roundedness.
- Name: `title-lg`. Desc: `body-sm`. `16px` vertical space.

### Ambient Mixer Sliders

- **Track:** `8px` line, `surface-container-highest`.
- **Thumb:** Large, soft circle, `primary`.
- **Feedback:** Track fills with `surface-tint`.

### Checkboxes & Radios

- Use "Toggle Pills" (`full` roundedness). Shift `surface-container-high` to `primary_container` when selected.

---

## 6. Do’s and Don’ts

### Do

- Embrace asymmetry (e.g., center play button, left metadata).
- Use `secondary_container` for secondary actions (quiet).
- Prioritize white space. Add 20% more than "enough."

### Don’t

- Use 100% opaque borders (visual noise).
- Use pure white text. Use `on_surface` (#e7e5e5) for eye comfort.
- Use "Pop" animations. Use slow transitions (300ms+) for gentle atmosphere.

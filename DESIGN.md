# Design System Specification: The Sensory Sanctuary

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Digital Breath."**

In an industry crowded with high-friction, attention-grabbing interfaces, this system takes the opposite approach. We are building a "Quiet UI"—a digital environment that recedes into the background, allowing the user’s auditory experience to take center stage.

To achieve a "High-End Editorial" feel, we move away from standard container-and-divider layouts. Instead, we use **Negative Space as Content**. We embrace intentional asymmetry, where elements are balanced by weight and tone rather than rigid grid alignment. This creates a bespoke, premium feel that mimics a luxury print journal or a high-end gallery space.

---

## 2. Colors & Surface Philosophy

The palette is built on "Atmospheric Depth." We avoid flat colors in favor of a tonal system that feels alive and dimensional.

### The "No-Line" Rule

**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined solely through background color shifts.

- A card should not have a border; it should be a `surface-container-low` element sitting on a `surface` background.
- Use the natural contrast between `#0e0e0e` (Surface) and `#191a1a` (Surface Container) to create soft, "felt" edges.

### Surface Hierarchy & Nesting

Treat the UI as a series of physical layers—like stacked sheets of fine, heavy-stock paper.

- **Base Layer:** `surface` (#0e0e0e)
- **Primary Interaction Containers:** `surface-container` (#191a1a)
- **Floating Elements/Overlays:** `surface-container-highest` (#252626)

### The "Glass & Gradient" Rule

To elevate the "Dark/Cozy" aesthetic, use Glassmorphism for floating controls (e.g., a volume mixer or timer).

- **Recipe:** Use `surface-container-high` at 80% opacity with a `24px` backdrop-blur.
- **Signature Textures:** For main CTAs, use a subtle linear gradient transitioning from `primary` (#e3c28e) to `primary-container` (#5a431a). This mimics the soft glow of a candle, providing "soul" that flat hex codes cannot achieve.

---

## 3. Typography: The Editorial Voice

We use **Manrope** across the entire system. It is a modern, geometric sans-serif that maintains high legibility while feeling warmer than standard system fonts.

- **Display Scales (`display-lg` to `display-sm`):** Use these for immersive moments, like the name of the current soundscape. These should have a tracking of `-0.02em` to feel tight and intentional.
- **Body Scales (`body-lg` to `body-sm`):** For descriptions and settings. Increase line-height to `1.6` and tracking to `0.01em`. Generous leading is the key to a "calming" interface; never let text feel crowded.
- **Labels (`label-md` to `label-sm`):** Use these for metadata. These should be set in All-Caps with `0.05em` tracking to provide an authoritative, editorial contrast to the soft body text.

---

## 4. Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** rather than traditional structural lines or heavy drop shadows.

### The Layering Principle

Place a `surface-container-lowest` (#000000) card on a `surface-container-low` (#131313) section. This creates a "recessed" or "pressed" effect, making the UI feel tactile and premium without the clutter of shadows.

### Ambient Shadows

When an element must "float" (like a persistent play bar), use "Ambient Shadows":

- **Shadow Color:** A 15% opacity version of `on-surface` (#e7e5e5).
- **Properties:** 0px X, 12px Y, 40px Blur. This creates a soft, natural lift that mimics diffused light.

### The "Ghost Border" Fallback

If a border is required for accessibility (e.g., in high-contrast mode), use a **Ghost Border**:

- Token: `outline-variant` (#484848).
- Opacity: 20% max.
- It should be "barely there"—visible only when looked for, never interrupting the flow of the eye.

---

## 5. Components

### Primary Buttons

- **Shape:** `full` (9999px) or `xl` (1.5rem) roundedness.
- **Style:** Gradient fill (`primary` to `primary_dim`).
- **Interaction:** On hover/tap, the element should not just change color, but subtly "glow" using a `primary_fixed` outer shadow at 10% opacity.
- **Sizing:** Large touch targets (min height 64px) to ensure the experience is "effortless" for tired users.

### Soundscape Cards

- **Constraint:** Absolutely no divider lines.
- **Structure:** Use `surface-container-high` as the card base. Use `lg` (1rem) roundedness.
- **Typography:** Use `title-lg` for the name and `body-sm` for the description, separated by `16px` of vertical white space.

### Ambient Mixer Sliders

- **Track:** A thick `8px` line using `surface-container-highest`.
- **Thumb:** A large, soft circle (`full` roundedness) using the `primary` token.
- **Visual Feedback:** As the slider moves, the track should fill with a `surface-tint` color.

### Checkboxes & Radios

- Avoid the standard "box." Use "Toggle Pills." A pill-shaped container (`full` roundedness) that shifts from `surface-container-high` to `primary_container` when selected.

---

## 6. Do’s and Don’ts

### Do

- **Do** embrace asymmetry. Center-align the play button, but left-align the metadata to create a dynamic, editorial layout.

* **Do** use `secondary_container` for secondary actions to keep them visually "quiet."
* **Do** prioritize white space. If you think there is enough space, add 20% more.

### Don’t

- **Don’t** use 100% opaque borders. They create "visual noise" that contradicts the peaceful brand personality.

* **Don’t** use pure white for text. Use `on_surface` (#e7e5e5) to reduce eye strain in Dark/Cozy mode.
* **Don’t** use "Pop" animations. Use slow, ease-in-out transitions (300ms+) to maintain a supportive, gentle atmosphere.

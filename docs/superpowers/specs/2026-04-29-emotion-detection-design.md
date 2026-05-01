# Emotion Detection via face-api.js

## Purpose

Add client-side emotion detection to Ambia, adapting the background noise and haptic feedback based on the user's facial expression.

## Architecture

### 1. Setup & Models

- Use `face-api.js` for completely local, offline expression detection.
- Add `scripts/download-models.sh` to fetch `tiny_face_detector` and `face_expression` models into `/public/models/`.

### 2. State & Persistence

- Update `hooks/use-ambia-persistence.ts` to include `isEmotionEnabled` (boolean) to toggle the feature on or off across page reloads.

### 3. Hooks

- **`use-emotion.ts`**:
  - Requires `isEmotionEnabled` flag. If true, requests webcam stream.
  - Mounts a hidden `<video>` element (appended to DOM but `display: none` or opacity 0).
  - Loads models from `/public/models`.
  - Runs inference every 2 seconds via `setInterval`.
  - Returns current `dominantEmotion` (`"happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised" | "neutral" | null`).
  - Cleans up stream and interval on unmount or disable.
- **`use-emotion-noise.ts`**:
  - Bridge hook. Takes `dominantEmotion`, `activeNoise` (current), and setters (`setActiveNoise`, `haptic.trigger`).
  - Watches `dominantEmotion`. If it changes:
    - `angry | fearful | disgusted` -> Set noise to `brown`
    - `neutral | surprised` -> Set noise to `pink`
    - `happy | sad` -> Set noise to `white`
  - Haptics:
    - Positive (`happy`): `haptic.trigger('selection')` twice (mock short double-pulse) or similar available pattern.
    - Negative (`angry, fearful, disgusted, sad`): `haptic.trigger('heavy')` single pulse.
    - Neutral/surprised: No haptics.

### 4. UI Integration

- **`components/header.tsx`**: Add a toggle button (using `Smile` or `Webcam` icon from `lucide-react`) next to the theme toggle.
- Button state shows if emotion tracking is active.

## Error Handling

- If camera access is denied or model fails to load, gracefully disable `isEmotionEnabled` and log error.

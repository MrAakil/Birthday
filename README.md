# Meena Banu's Interactive Birthday Surprise Website 🎂✨

An unforgettable, emotional, and cinematic digital birthday surprise website built as a premium interactive gift for **Meena Banu**. The website guides the visitor through a storytelling journey from a mysterious starting intro to a grand celebration reveal.

---

## 🚀 Tech Stack

The project leverages a modern web stack to achieve premium animations, 3D interactions, and programmatic audio processing:

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Render**: [Three.js](https://threejs.org/) & [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Scrollytelling & Scroll Physics**: [Lenis Smooth Scroll](https://lenis.darkroom.engineering/) & [GSAP (GreenSock Animation Platform)](https://gsap.com/)
- **UI Animation Core**: [Framer Motion](https://www.framer.com/motion/)
- **Audio Engines**: 
  - [Howler.js](https://howlerjs.com/) (Background music streaming)
  - **HTML5 Web Audio API** (Programmatic sound effect synthesizer for clicks, chimes, locks, and paper friction with 0-byte asset footprints)
- **Special Effects**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🎭 The Journey (User Flow)

1. **Cinematic Intro**: Typewriter welcome lines fade in on a starry sky background, prompting a "Start Journey" interaction to unlock audio contexts.
2. **Preference Trivia**: Playful preference questions (saved in the client's `localStorage` for visual setups).
3. **Occasion Guess**: Shaking multiple-choice options. Choosing the correct birthday option releases a celebratory confetti pop.
4. **Secret Lock**: Password portal unlocking on any word (with a custom sweet message on `"forever"`).
5. **Surprise Preparation**: A loading sequence showing floating balloons and preparation alerts, transitioning into the main page.
6. **Grand Reveal**: A parallax memory image slideshow with Ken-Burns cross-fades and a typewriter birthday letter.
7. **3D Cake**: A rotating 3D birthday cake with glowing flames. Blow out the candles using your microphone (analyzing low-frequency breath noise) or a manual button fallback to release fireworks, confetti, and balloons.
8. **Lyrics Player**: A vinyl-style visualizer playing the theme song synchronized with an Apple-Music-style scrolling lyrics board.
9. **Memory Timeline**: An alternating vertical grid timeline with glowing connector nodes, watermarked indices, and scroll entries.
10. **Love Letter**: A 3D digital envelope that opens with paper sound effects and slides out a handwriting-styled glass letter.
11. **Nebula Star Constellation**: A deep space star sky where clicking/hovering on stars reveals individual personal reasons why Meena Banu is special.

---

## 🛠️ Getting Started

First, install dependencies and run the local development server:

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the surprise.

To build the static application bundle:

```bash
npm run build
```

---

## 🎨 Personalization & Customization

You can customize names, theme parameters, lyrics timings, memory captions, images, and final star coordinates in a single file:

👉 **[src/config/birthday.ts](file:///Users/mraakil/Desktop/Aakil's%20Birthday/src/config/birthday.ts)**

No code changes are required anywhere else.

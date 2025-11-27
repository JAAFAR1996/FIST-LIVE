# Fish Web - UX/UI Prototype

This project is a high-fidelity prototype for an advanced aquarium e-commerce platform, focusing on immersive UX, animations, and sustainability.

## 🏆 Award-Winning Design Features

This project implements several cutting-edge design patterns:

- **Immersive Themes**: Switch between Day, Deep Ocean, Neon Bioluminescent, and Pastel Reef modes.
- **Micro-Interactions**: "Fish swim to cart" animations, water ripples, and bubble trails.
- **3D & AR**: Interactive 3D aquarium scenes and AR product previews.
- **Guided Commerce**: A "Fish Finder" wizard to help beginners choose the right setup.
- **Sustainability First**: Dedicated eco-friendly guides and transparency features.

## 🎨 Themes

We support multiple themes using CSS variables and Tailwind:
- **Light**: Clean, modern e-commerce look.
- **Dark**: Deep ocean vibe, reduces eye strain.
- **Neon Ocean**: Cyberpunk-inspired aquatic aesthetic.
- **Pastel**: Soft, calming colors inspired by coral reefs.
- **Monochrome**: High-contrast, minimal design.

To switch themes, use the button in the navbar.

## 🚀 Feature Flags

Features can be toggled in `src/lib/config/features.ts`:
- `enhanced3D`: Enables WebGL aquarium scenes.
- `fishFinder`: Enables the guided selection wizard.
- `arViewer`: Enables Augmented Reality product previews.
- `sustainability`: Enables eco-score and donation features.

## 🛠 Tech Stack

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS + Framer Motion + Custom CSS Animations
- **State**: React Query + Wouter (Routing)
- **Visuals**: Three.js (R3F) + Canvas Confetti

## 📦 Installation

```bash
npm install
npm run dev
```

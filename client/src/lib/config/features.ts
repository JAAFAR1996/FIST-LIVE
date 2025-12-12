/// <reference types="vite/client" />

// Feature Flags
export const FEATURES = {
  enhanced3D: true,
  fishFinder: true,
  journey: true,
  arViewer: false, // Default false as requested
  socialProof: true,
  sustainability: true,
  luxuryShowcase: true,
  themes: true,
};

export const IS_DEV = import.meta.env.DEV;

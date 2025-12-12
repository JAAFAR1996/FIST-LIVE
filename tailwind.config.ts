import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./client/src/**/*.{ts,tsx}",
    "./client/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", "sans-serif"],
        heading: ["Changa", "sans-serif"],
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px var(--color-primary)' },
          '50%': { opacity: '0.5', boxShadow: '0 0 10px var(--color-primary)' },
        },
        rise: {
          '0%': { transform: 'translateY(100%) scale(0.5)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-20%) scale(1)', opacity: '0' },
        },
        'fish-swim': {
          '0%': { transform: 'translateX(-100%) translateY(0)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateX(100vw) translateY(-20px)', opacity: '0' },
        },
        'luxury-fade': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        'water-ripple': {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      animation: {
        wave: 'wave 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        rise: 'rise 4s ease-in infinite',
        'fish-swim': 'fish-swim 15s linear infinite',
        'luxury-fade': 'luxury-fade 0.8s ease-out forwards',
        'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
        'water-ripple': 'water-ripple 1s ease-out forwards',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

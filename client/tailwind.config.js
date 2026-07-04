/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0f19', // Slate 950 deep backdrop
        darkCard: 'rgba(17, 24, 39, 0.7)', // Slate 900 glass fill
        glassBorder: 'rgba(99, 102, 241, 0.15)', // Indigo-500/15
        brandViolet: '#8b5cf6',
        brandIndigo: '#6366f1',
        brandBlue: '#3b82f6',
        brandCyan: '#06b6d4',
        brandEmerald: '#10b981',
        brandPurple: '#a855f7'
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        neonCyan: '0 0 15px rgba(6, 182, 212, 0.4)',
        neonIndigo: '0 0 20px rgba(99, 102, 241, 0.3)'
      },
      backdropBlur: {
        glass: '12px'
      }
    },
  },
  plugins: [],
}

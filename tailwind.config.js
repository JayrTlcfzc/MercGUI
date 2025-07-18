// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure this matches your file paths
    "./public/index.html", // Optional: include your public HTML if needed
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'], // Add the Quicksand font family here
      },
      textShadow: { sm: '0 1px 2px rgba(0, 0, 0, 0.5)', default: '0 2px 4px rgba(0, 0, 0, 0.5)', lg: '0 3px 6px rgba(0, 0, 0, 0.5)',
      },
      boxShadow: {
        'outline': '0 0 5px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [ function ({ addBase, config }) { addBase({ '.text-shadow-sm': { textShadow: config('theme.textShadow.sm') }, '.text-shadow': { textShadow: config('theme.textShadow.default') }, '.text-shadow-lg': { textShadow: config('theme.textShadow.lg') }, }); },],
};

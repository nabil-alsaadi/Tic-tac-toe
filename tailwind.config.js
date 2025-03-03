/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#322625",
        grey: "#ebebeb",
        blue: "#c0e3e5",
        yellow: "#fdc936",
      },
      fontFamily: {
        neutra: ["Neutra Text Alt", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        bold: "700",
      },
    },
  },
  plugins: [],
};

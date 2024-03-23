const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#335BBA",
        secondary: "#8CAEFF",
        background: "#FFFFFF",
        text: "#183883",
        accent1: "#8CAEFF",
      },
      height: {
        header: "var(--custom-header)",
      },
      padding: {
        "header-r": "var(--custom-header-padding-right)",
      },
      boxShadow: {
        card: "0 2px 2px 2px rgba(140, 174, 255, 0.3)",
      },
      aspectRatio: {
        "2/1": "2 / 1",
      },
      animation: {
        "bounce-slow": "bounce 3s linear infinite",
      },
      minWidth: {
        5: "1.25rem",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".text-8": {
          fontSize: "10px",
          fontWeight: "200",
        },
        ".text-body-regular-16": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "normal",
        },
        ".text-header-h1-bold-24": {
          fontSize: "24px",
          lineHeight: "40px",
          fontWeight: "bold",
        },
      });
    }),
  ],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15211d",
        mint: "#0f9f7a",
        coral: "#ef6a4d",
        skywash: "#e8f5f3",
        graphite: "#2d3436"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(21, 33, 29, 0.16)"
      }
    }
  },
  plugins: []
};

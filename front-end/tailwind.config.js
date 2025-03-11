const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [flowbite.content(), "./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customBeige: "#EAE0D5",
        sideInactive: "#576F73",
        sideActive: "#7D9D9C",
        recruitHeader: "#637a7d",
        profileModalHeader: "#576F73",
        profileTabText: "#576F73",
        jpSystemGreen: "#576F73",

      },
      boxShadow: {
        "profile-section":
          "0px 4px 8px rgba(0, 0, 0, 0.08), 0px -4px 8px rgba(0, 0, 0, 0.08), 4px 0px 8px rgba(0, 0, 0, 0.08), -4px 0px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [flowbite.content()],
};

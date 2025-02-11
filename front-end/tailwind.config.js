const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    flowbite.content(),
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBeige: '#EAE0D5',
        sideInactive: '#576F73',
        sideActive: '#7D9D9C',
        recruitHeader: '#637a7d',
      },
    },
  },
  plugins: [
    flowbite.content(),

  ],
};

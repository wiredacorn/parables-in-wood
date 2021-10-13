module.exports = {
  purge: {
    mode: "all",
    content: ["./**/*.html"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    container: {
      center: true,
    },
    extend: {
      'height': {
        'hero': '400px',
        'heroSmall': '150px'
      },
      'minHeight': {
        'hero': '400px',
        'heroSmall': '150px'
      },
      colors: {},
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/typography"),
    require('@tailwindcss/aspect-ratio')
  ],
};

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        "regal-blue": "#243c5a",
        "primarydark": "#4d426d",
        "primarylight": "#5c4f82",
        "secondary": "#efa985",
      },
    },
  },
  variants: {},
  plugins: [],
};

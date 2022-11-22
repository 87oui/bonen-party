module.exports = {
  './src/**/*.{css,html}': ['prettier --write'],
  './**/*.{js,cjs,ts,tsx}': ['prettier --write', 'eslint --fix'],
};

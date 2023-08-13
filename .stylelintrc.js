module.exports = {
  extends: 'stylelint-config-standard-scss',
  plugins: ['stylelint-scss'],
  rules: {
    'selector-class-pattern':
      '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$|^.*$',
    'no-descending-specificity': null,
  },
};

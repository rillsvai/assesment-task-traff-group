module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // 1. Enforce commit types:
    //    feat:     A new feature
    //    fix:      A bug fix
    //    docs:     Documentation only changes
    //    style:    Changes that do not affect the meaning of the code (white-space, formatting, etc)
    //    refactor: A code change that neither fixes a bug nor adds a feature
    //    perf:     A code change that improves performance
    //    test:     Adding missing tests or correcting existing tests
    //    build:    Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
    //    ci:       Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
    //    chore:    Other changes that don’t modify src or test files
    //    revert:   Reverts a previous commit
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],

    // 2. Require a non-empty scope
    'scope-empty': [2, 'never'],

    // 3. Enforce lower-case for scope
    'scope-case': [2, 'always', 'lower-case'],

    // 4. Subject must not be empty
    'subject-empty': [2, 'never'],

    // 5. Subject should follow sentence case
    'subject-case': [2, 'always', 'sentence-case'],

    // 6. Limit the header (type + scope + subject) to 72 characters
    'header-max-length': [2, 'always', 72],

    // 7. Wrap body at 100 characters
    'body-max-line-length': [2, 'always', 100],

    // 8. Wrap footer at 100 characters
    'footer-max-line-length': [2, 'always', 100],
  },
};

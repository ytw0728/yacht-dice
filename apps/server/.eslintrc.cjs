module.exports = {
  plugins: ['import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'plugin:oxlint/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: '.',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/explicit-member-accessibility': [
      'warn',
      {
        overrides: {
          constructors: 'no-public',
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        classes: {
          memberTypes: [
            'public-static-method',
            'public-decorated-method',
            'public-instance-method',
            'public-abstract-method',
            'protected-static-method',
            'protected-decorated-method',
            'protected-instance-method',
            'protected-abstract-method',
            'private-static-method',
            'private-decorated-method',
            'private-instance-method',
            'public-constructor',
            'protected-constructor',
            'private-constructor',
            'signature',
            'public-static-field',
            'public-decorated-field',
            'public-instance-field',
            'public-abstract-field',
            'protected-static-field',
            'protected-decorated-field',
            'protected-instance-field',
            'protected-abstract-field',
            'private-static-field',
            'private-decorated-field',
            'private-instance-field',
          ],
        },
      },
    ],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
      {
        selector: ['accessor', 'typeLike'],
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-extraneous-class': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_+', ignoreRestSiblings: true }],
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-useless-constructor': 'warn',
    '@typescript-eslint/prefer-for-of': 'warn',
    '@typescript-eslint/prefer-includes': 'warn',
    '@typescript-eslint/prefer-readonly': 'warn',
    '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    eqeqeq: ['error', 'always'],
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', ['sibling', 'index']],
      },
    ],
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-return-await': 'warn',
    'prettier/prettier': 'warn',
  },
}

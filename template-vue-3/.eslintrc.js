module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard',
        '@vue/typescript/recommended',
    ],
    rules: {
        'vue/no-multiple-template-root': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/html-indent': ['error', 4],
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'], // Reasoning behind using dangling commas -> https://github.com/airbnb/javascript#commas--dangling
        'no-useless-constructor': 'off', // che: Bug in rule - unless disabled makes eslint crash
        'standard/no-callback-literal': 'off', // che: useless rule
        eqeqeq: ['error', 'smart'],
        'no-return-assign': 'off',
        'prefer-promise-reject-errors': 'off',
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'space-before-function-paren': ['error', 'never'],
        'vue/html-closing-bracket-newline': [
            'error',
            {
                singleline: 'never',
                multiline: 'never',
            },
        ],
        'vue/html-self-closing': ['error', {
            html: {
                void: 'never',
                normal: 'any',
                component: 'always',
            },
            svg: 'always',
            math: 'always',
        }],
        'vue/html-closing-bracket-spacing': ['error', {
            startTag: 'never',
            endTag: 'never',
            selfClosingTag: 'never',
        }],
        'vue/max-attributes-per-line': [
            'error',
            {
                singleline: 4,
                multiline: {
                    max: 4,
                    allowFirstLine: true,
                },
            },
        ],
        'vue/no-v-html': 'off',
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },

};

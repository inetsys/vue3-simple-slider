module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard',
    ],
    plugins: [
        'vue',
    ],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        'brace-style': ['error', 'stroustrup'],
        'comma-dangle': ['warn', 'always-multiline'],
        indent: ['warn', 4, {
            SwitchCase: 1,
        }],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'space-before-function-paren': ['warn', 'never'],
        'vue/attribute-hyphenation': 'warn',
        'vue/attributes-order': 'off',
        'vue/camelcase': 'warn',
        'vue/comma-dangle': ['warn', 'always-multiline'],
        'vue/eqeqeq': 'warn',
        'vue/html-indent': ['warn', 4, {
            alignAttributesVertically: false,
        }],
        'vue/html-quotes': 'warn',
        'vue/html-self-closing': 'warn',
        'vue/max-attributes-per-line': ['warn', {
            singleline: 3,
            multiline: {
                max: 1,
                allowFirstLine: true,
            },
        }],
        'vue/require-prop-types': 'warn',
        'vue/script-indent': ['warn', 4, {
            switchCase: 1,
        }],
        'vue/singleline-html-element-content-newline': 0,
        'vue/this-in-template': 'warn',
    },
}

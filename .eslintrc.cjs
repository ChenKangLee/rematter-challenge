module.exports = {
    parser: 'vue-eslint-parser',
    env: {
        browser: true,
        es6: true,
        node: true,
        commonjs: true
    },
    extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended', 'prettier'],
    plugins: ['prettier'],
    parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 'latest',
        requireConfigFile: false,
        sourceType: 'module'
    },
    rules: {
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'vue/no-side-effects-in-computed-properties': 'off',
        'vue/no-reserved-keys': 'warn',
        'vue/require-prop-types': 'warn',
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
        'vue/max-attributes-per-line': 'off',
        'vue/require-v-for-key': 'warn',
        'vue/valid-v-for': 'warn',
        'vue/no-parsing-error': 'warn',
        'vue/no-v-html': 'off',
        'vue/order-in-components': 'warn',
        'vue/attributes-order': 'warn',
        'vue/html-indent': 'warn',
        'vue/first-attribute-linebreak': 'off',
        'vue/no-reserved-props': [
            'error',
            {
                vueVersion: 3
            }
        ],
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'any'
                }
            }
        ],
        'vue/html-closing-bracket-spacing': [
            'warn',
            {
                startTag: 'never',
                endTag: 'never'
            }
        ],
        'vue/no-template-key': 'warn',
        'vue/no-template-shadow': 'off',
        'vue/no-use-v-if-with-v-for': 'off',
        'array-bracket-spacing': 'warn',
        indent: [
            'error',
            2,
            {
                SwitchCase: 1,
                ignoredNodes: ['TemplateLiteral']
            }
        ]
    }
}

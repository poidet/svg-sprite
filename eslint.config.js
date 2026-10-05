import { config } from '@prleasing/eslint';

export default config().append({
	rules: {
		'antfu/consistent-list-newline': 'off',
		'vue/singleline-html-element-content-newline': 'off',
		'vue/html-closing-bracket-newline': 'off',
		'vue/html-indent': 'off',
		// Formatting is Prettier's: these two fight its output (operator at line end, "'" inside strings)
		'style/operator-linebreak': 'off',
		'style/quotes': 'off'
	},
	ignores: ['**/*.md']
});

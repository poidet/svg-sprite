import { config } from '@prleasing/eslint';

export default config().append({
	rules: {
		'antfu/consistent-list-newline': 'off',
		'vue/singleline-html-element-content-newline': 'off',
		'vue/html-closing-bracket-newline': 'off',
		'vue/html-indent': 'off'
	},
	ignores: ['**/*.md']
});

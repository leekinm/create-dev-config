const globals = require('globals');
const js = require('@eslint/js');

/**
 * Basic Usage Demonstration
 * 0, off
 * 1, on,raise warning message
 * 2, on,raise error message
 */
module.exports = [
	js.configs.recommended,
	{
		ignores: [],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'commonjs',
			globals: {
				...globals.node,
			},
		},
		rules: {
			'no-console': 0,
			'no-var': 2,
			quotes: [2, 'single', { allowTemplateLiterals: true }],
		},
	},
];

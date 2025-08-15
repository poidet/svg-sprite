import consola from 'consola';
import { defineNuxtConfig } from 'nuxt/config';

const alias = {};

// eslint-disable-next-line node/prefer-global/process
if (process.env.NODE_ENV === 'development') {
	consola.warn('Using local @poidet/svg-sprite!');
	alias['@poidet/svg-sprite'] = '../src/module.ts';
}

export default defineNuxtConfig({
	extends: '@nuxt-themes/docus',
	alias,
	modules: ['@poidet/svg-sprite']
});

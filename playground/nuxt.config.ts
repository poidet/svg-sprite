import svgModule from '../src/module';

export default defineNuxtConfig({
	modules: [svgModule],
	svgSprite: {
		alias: '#icons'
	}
});

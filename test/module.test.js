import { fileURLToPath } from 'node:url';
import { $fetch, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';

// The playground is built and served once; the checks read the rendered HTML and the
// generated sprites, so no browser is needed (CI does not install one).
describe('render module', async () => {
	await setup({
		rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
		server: true
	});

	const uses = (html) => Array.from(html.matchAll(/<use[^>]*\shref="([^"]+)"/g), ([, href]) => href);

	it('every icon points to an existing sprite symbol', async () => {
		const hrefs = uses(await $fetch('/'));
		expect(hrefs.length).toBeGreaterThan(0);

		for (const href of hrefs) {
			const [path, id] = href.split('#');
			// Browsers do not render <use> pointing at a data: URL, so a sprite must stay a file.
			expect(path.startsWith('data:'), href).toBe(false);

			const sprite = await $fetch(path, { responseType: 'text' });
			expect(sprite, href).toContain(`id="${id}"`);
		}
	});

	it('every referenced symbol keeps a non-empty viewBox', async () => {
		for (const href of uses(await $fetch('/'))) {
			const [path, id] = href.split('#');
			const sprite = await $fetch(path, { responseType: 'text' });
			const symbol = sprite.match(new RegExp(`<symbol[^>]*\\sid="${id}"[^>]*>`))?.[0] ?? '';
			const [, , , width, height] =
				symbol.match(/viewBox="([\d.-]+)[\s,]+([\d.-]+)[\s,]+([\d.]+)[\s,]+([\d.]+)"/) ?? [];

			expect(Number(width), href).toBeGreaterThan(0);
			expect(Number(height), href).toBeGreaterThan(0);
		}
	});

	// The icon's <defs> are moved out of its <symbol> into the sprite-level <defs>
	// (generateSprite), so references inside the symbol still resolve.
	it('<defs> of an icon move out of its symbol into the sprite', async () => {
		const [href] = uses(await $fetch('/empty-defs'));
		const [path, id] = href.split('#');
		const sprite = await $fetch(path, { responseType: 'text' });
		const symbol = sprite.match(new RegExp(`<symbol[^>]*\\sid="${id}"[^>]*>([\\s\\S]*?)</symbol>`))?.[1] ?? '';
		const refs = Array.from(symbol.matchAll(/(?:href="#|url\(#)([^")]+)/g), ([, ref]) => ref);

		expect(symbol).not.toContain('<defs');
		expect(refs.length).toBeGreaterThan(0);
		for (const ref of refs) {
			expect(sprite, ref).toContain(`id="${ref}"`);
		}
	});
});

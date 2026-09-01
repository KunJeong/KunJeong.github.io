import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import rehypeEscapeKatexBraces from './src/lib/rehype-escape-katex-braces.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex, rehypeEscapeKatexBraces]
		})
	],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		// Set BASE_PATH to "/repo-name" when deploying to GitHub project pages.
		// Leave empty for a user page (user.github.io) or a custom domain.
		paths: {
			base: process.env.BASE_PATH ?? ''
		}
	}
};

export default config;

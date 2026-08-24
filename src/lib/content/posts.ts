import type { PostLanguage, PostMeta } from './types';

interface MarkdownMeta {
	title?: string;
	date?: string;
	summary?: string;
	pinned?: boolean;
	tags?: string[];
	language?: PostLanguage;
	unlisted?: boolean;
}

// A language suffix marks the post language without becoming part of its URL slug.
const files = import.meta.glob('/src/content/blog/*.md', { eager: true });

export const posts: PostMeta[] = Object.entries(files)
	.map(([path, mod]) => {
		const source = path.split('/').pop()!.replace(/\.md$/, '');
		const suffix = source.match(/^(.*)\.(en|ko)$/);
		const slug = suffix?.[1] ?? source;
		const meta = (mod as { metadata?: MarkdownMeta }).metadata ?? {};

		return {
			slug,
			source,
			title: meta.title ?? slug,
			date: meta.date ?? '',
			summary: meta.summary ?? '',
			pinned: meta.pinned ?? false,
			tags: meta.tags ?? [],
			language: meta.language ?? (suffix?.[2] as PostLanguage | undefined) ?? 'en',
			unlisted: meta.unlisted ?? false
		};
	})
	.sort((a, b) => (a.date < b.date ? 1 : -1));

export const listedPosts = posts.filter((post) => !post.unlisted);
export const pinnedPosts = listedPosts.filter((post) => post.pinned);
export const recentPosts = listedPosts.slice(0, 3);

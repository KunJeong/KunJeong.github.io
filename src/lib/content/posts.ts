import type { PostLanguage, PostMeta } from './types';

interface MarkdownMeta {
	title?: string;
	date?: string;
	summary?: string;
	pinned?: boolean;
	tags?: string[];
	language?: PostLanguage;
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
			language: meta.language ?? (suffix?.[2] as PostLanguage | undefined) ?? 'en'
		};
	})
	.sort((a, b) => (a.date < b.date ? 1 : -1));

export const pinnedPosts = posts.filter((p) => p.pinned);
export const recentPosts = posts.slice(0, 3);

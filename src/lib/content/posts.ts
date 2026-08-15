import type { PostMeta } from './types';

// Each markdown file in src/content/blog is a post. Its filename is the slug.
const files = import.meta.glob('/src/content/blog/*.md', { eager: true });

export const posts: PostMeta[] = Object.entries(files)
	.map(([path, mod]) => {
		const slug = path.split('/').pop()!.replace(/\.md$/, '');
		const meta = (mod as { metadata?: Partial<PostMeta> }).metadata ?? {};
		return {
			slug,
			title: meta.title ?? slug,
			date: meta.date ?? '',
			summary: meta.summary ?? '',
			pinned: meta.pinned ?? false,
			tags: meta.tags ?? []
		};
	})
	.sort((a, b) => (a.date < b.date ? 1 : -1));

export const pinnedPosts = posts.filter((p) => p.pinned);
export const recentPosts = posts.slice(0, 3);

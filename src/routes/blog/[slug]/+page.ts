import { error } from '@sveltejs/kit';
import { posts } from '$lib/content/posts';
import type { EntryGenerator, PageLoad } from './$types';

// Tell the prerenderer which slugs exist.
export const entries: EntryGenerator = () => posts.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
	const post = posts.find((p) => p.slug === params.slug);
	if (!post) throw error(404, 'Post not found');
	return { post };
};

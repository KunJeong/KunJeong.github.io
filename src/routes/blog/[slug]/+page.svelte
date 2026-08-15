<script lang="ts">
	import DateLabel from '$lib/components/atoms/DateLabel.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import Link from '$lib/components/atoms/Link.svelte';
	import type { Component } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Every post is compiled in at build time. Select this one's component by slug.
	const modules = import.meta.glob('/src/content/blog/*.md', { eager: true });
	const mod = modules[`/src/content/blog/${data.post.slug}.md`] as { default: Component };
	const Post = mod.default;
</script>

<svelte:head>
	<title>{data.post.title} · Seokhun Jeong</title>
	<meta name="description" content={data.post.summary} />
</svelte:head>

<article class="post">
	<p class="post__back"><Link href="/blog" muted>← Writing</Link></p>
	<header class="post__head">
		<h1 class="post__title">{data.post.title}</h1>
		<div class="post__meta">
			<DateLabel date={data.post.date} />
			{#if data.post.tags?.length}
				<span class="post__tags">{#each data.post.tags as tag}<Tag>{tag}</Tag>{/each}</span>
			{/if}
		</div>
	</header>
	<div class="prose article"><Post /></div>
</article>

<style>
	.post {
		padding-top: 3rem;
	}
	.post__back {
		font-size: var(--text-fine);
		margin: 0 0 1.5rem;
	}
	.post__title {
		font-family: var(--font-display);
		font-size: var(--text-display);
		line-height: var(--text-display--line-height);
		font-weight: 600;
		color: var(--color-ink);
		max-width: 24ch;
		margin: 0 0 0.625rem;
	}
	.post__meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 0 0 2rem;
	}
	.post__tags {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
</style>

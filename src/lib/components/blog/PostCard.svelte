<script lang="ts">
	import DateLabel from '../atoms/DateLabel.svelte';
	import Link from '../atoms/Link.svelte';
	import Tag from '../atoms/Tag.svelte';
	import type { PostMeta } from '$lib/content/types';

	let { post }: { post: PostMeta } = $props();
</script>

<article class="card">
	<DateLabel date={post.date} />
	<div class="card__body">
		<h3 class="card__title"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
		{#if post.summary}<p class="card__summary">{post.summary}</p>{/if}
		{#if post.tags?.length}
			<div class="card__tags">
				{#each post.tags as tag}<Tag>{tag}</Tag>{/each}
			</div>
		{/if}
	</div>
</article>

<style>
	.card {
		display: grid;
		grid-template-columns: 5.25rem 1fr;
		gap: 1rem;
		padding: 1rem 0;
		border-top: 1px solid var(--color-hairline);
	}
	.card:last-child {
		border-bottom: 1px solid var(--color-hairline);
	}
	.card__title {
		font-size: var(--text-body);
		font-weight: 600;
		line-height: 1.4;
		margin: 0 0 0.25rem;
	}
	.card__summary {
		font-size: var(--text-fine);
		color: var(--color-muted);
		line-height: 1.6;
		max-width: 60ch;
		margin: 0 0 0.5rem;
	}
	.card__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
	@media (max-width: 620px) {
		.card {
			grid-template-columns: 4.25rem 1fr;
		}
	}
</style>

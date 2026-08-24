<script lang="ts">
	import { listedPosts, pinnedPosts } from '$lib/content/posts';
	import PostCard from '$lib/components/blog/PostCard.svelte';
</script>

<svelte:head>
	<title>Writing · Seokhun Jeong</title>
	<meta name="description" content="Essays and notes by Seokhun Jeong." />
</svelte:head>

<div class="blog">
	<header class="blog__head">
		<h1 class="blog__title">Writing</h1>
		<p class="blog__lede">Essays and notes.</p>
	</header>

	{#if pinnedPosts.length}
		<section class="blog__group">
			<h2 class="blog__group-title">Pinned</h2>
			{#each pinnedPosts as post}<PostCard {post} />{/each}
		</section>
	{/if}

	<section class="blog__group">
		<h2 class="blog__group-title">All posts</h2>
		{#each listedPosts as post}<PostCard {post} />{/each}
	</section>
</div>

<style>
	.blog__head {
		padding-top: 3.5rem;
	}
	.blog__title {
		font-family: var(--font-display);
		font-size: var(--text-display);
		line-height: var(--text-display--line-height);
		font-weight: 600;
		color: var(--color-ink);
		margin: 0 0 0.5rem;
	}
	.blog__lede {
		font-size: var(--text-lede);
		color: var(--color-muted);
		line-height: 1.6;
		max-width: 60ch;
		margin: 0;
	}
	.blog__group {
		margin-top: 2.875rem;
	}
	.blog__group-title {
		font-family: var(--font-heading);
		font-size: var(--text-heading);
		font-weight: 600;
		color: var(--color-ink);
		margin: 0 0 1rem;
	}
</style>

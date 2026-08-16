<script lang="ts">
	import Link from '../atoms/Link.svelte';
	import type { Publication } from '$lib/content/types';

	let { pub }: { pub: Publication } = $props();
</script>

<article class="pub">
	<h3 class="pub__title">{pub.title}</h3>
	<p class="pub__authors">
		{#each pub.authors as author, i}{i > 0 ? ', ' : ''}<span class:me={author.me}
				>{author.name}</span
			>{/each}
	</p>
	<p class="pub__venue">
		<span>{pub.venue}</span>
		{#if pub.links?.length}
			<span class="pub__links">
				{#each pub.links as link}<Link href={link.href} external>{link.label}</Link>{/each}
			</span>
		{/if}
	</p>
</article>

<style>
	.pub {
		padding: 0.8125rem 0;
		border-top: 1px solid var(--color-hairline);
	}
	.pub:last-child {
		border-bottom: 1px solid var(--color-hairline);
	}
	.pub__title {
		font-size: var(--text-body);
		font-weight: 560;
		line-height: 1.45;
		color: var(--color-ink);
		margin: 0 0 0.1875rem;
	}
	.pub__authors {
		font-size: var(--text-fine);
		color: var(--color-muted);
		margin: 0 0 0.1875rem;
	}
	.pub__authors .me {
		font-weight: 600;
	}
	.pub__venue {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.5rem;
		row-gap: 0.15rem;
		font-size: var(--text-meta);
		color: var(--color-faint);
	}
	.pub__links {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.pub__links::before {
		content: '·';
		color: var(--color-faint);
	}
</style>

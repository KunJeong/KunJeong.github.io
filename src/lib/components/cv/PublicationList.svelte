<script lang="ts">
	import PubEntry from './PubEntry.svelte';
	import { publications } from '$lib/content/publications';
	import type { Publication } from '$lib/content/types';

	type Group = { year: number; items: Publication[] };

	const groups: Group[] = Object.values(
		publications.reduce<Record<number, Group>>((acc, pub) => {
			(acc[pub.year] ??= { year: pub.year, items: [] }).items.push(pub);
			return acc;
		}, {})
	).sort((a, b) => b.year - a.year);
</script>

{#each groups as group}
	<p class="year">{group.year}</p>
	<div class="year-group">
		{#each group.items as pub}
			<PubEntry {pub} />
		{/each}
	</div>
{/each}

<style>
	.year {
		font-size: var(--text-meta);
		font-weight: 600;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
		margin: 1.25rem 0 0.125rem;
	}
	.year:first-of-type {
		margin-top: 0;
	}
</style>

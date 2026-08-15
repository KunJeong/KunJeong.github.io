<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id?: string;
		children: Snippet;
	}

	let { id, children }: Props = $props();
</script>

<h2 {id} class="heading">{@render children()}</h2>

<style>
	.heading {
		font-family: var(--font-heading);
		font-size: var(--text-heading);
		line-height: var(--text-heading--line-height);
		font-weight: 600;
		letter-spacing: 0.002em;
		color: var(--color-ink);
		margin: 0 0 1rem;
	}
</style>

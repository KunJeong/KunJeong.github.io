<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<span class="tag">{@render children()}</span>

<style>
	.tag {
		display: inline-block;
		font-size: var(--text-meta);
		color: var(--color-muted);
		border: 1px solid var(--color-hairline);
		border-radius: var(--radius-sm);
		padding: 0.125rem 0.5rem;
		line-height: 1.4;
	}
</style>

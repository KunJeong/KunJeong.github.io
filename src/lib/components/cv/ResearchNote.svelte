<script lang="ts">
	import type { ResearchTheme } from '$lib/content/types';

	let { theme }: { theme: ResearchTheme } = $props();
</script>

<div class="note">
	<strong class="note__title">{theme.title}.</strong>
	<span class="note__desc">{theme.description}</span>
</div>

<style>
	.note {
		padding: 0.8125rem 0;
		border-top: 1px solid var(--color-hairline);
		font-size: var(--text-body);
		line-height: 1.6;
	}
	.note:last-child {
		border-bottom: 1px solid var(--color-hairline);
	}
	.note__title {
		color: var(--color-ink);
		font-weight: 600;
	}
	.note__desc {
		color: var(--color-muted);
	}
</style>

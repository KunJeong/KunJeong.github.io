<script lang="ts">
	import type { EducationEntry } from '$lib/content/types';

	let { entry }: { entry: EducationEntry } = $props();
</script>

<div class="edu">
	<span class="edu__period">{entry.period}</span>
	<div class="edu__body">
		<div class="edu__degree">{entry.degree}</div>
		<div class="edu__place">
			{entry.place}{#if entry.note}, {entry.note}{/if}
		</div>
	</div>
</div>

<style>
	.edu {
		display: grid;
		grid-template-columns: 8.5rem 1fr;
		gap: 1rem;
		padding: 0.6875rem 0;
		border-top: 1px solid var(--color-hairline);
		line-height: 1.5;
	}
	.edu:last-child {
		border-bottom: 1px solid var(--color-hairline);
	}
	.edu__period {
		color: var(--color-faint);
		font-size: var(--text-meta);
		padding-top: 0.1rem;
	}
	.edu__degree {
		color: var(--color-ink);
		font-weight: 600;
		font-size: var(--text-body);
	}
	.edu__place {
		color: var(--color-muted);
		font-size: var(--text-fine);
	}
	@media (max-width: 620px) {
		.edu {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>

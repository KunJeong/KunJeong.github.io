<script lang="ts">
	import type { Snippet } from 'svelte';
	import DateLabel from './DateLabel.svelte';

	interface Props {
		date: string;
		children: Snippet;
	}

	let { date, children }: Props = $props();
</script>

<div class="row">
	<DateLabel {date} />
	<div class="row__body">{@render children()}</div>
</div>

<style>
	.row {
		display: grid;
		grid-template-columns: 5.25rem 1fr;
		gap: 1rem;
		padding: 0.5625rem 0;
		border-top: 1px solid var(--color-hairline);
		font-size: var(--text-body);
		line-height: 1.55;
	}
	.row:last-child {
		border-bottom: 1px solid var(--color-hairline);
	}
	.row__body {
		color: var(--color-ink);
	}
	@media (max-width: 620px) {
		.row {
			grid-template-columns: 4.25rem 1fr;
		}
	}
</style>

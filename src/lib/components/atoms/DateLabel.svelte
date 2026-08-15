<script lang="ts">
	import { formatMonth } from '$lib/utils/date';

	let { date }: { date: string } = $props();
</script>

<span class="date">{formatMonth(date)}</span>

<style>
	.date {
		color: var(--color-faint);
		font-size: var(--text-meta);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
</style>

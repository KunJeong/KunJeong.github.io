<script lang="ts">
	import type { Snippet } from 'svelte';
	import SectionHeading from '../atoms/SectionHeading.svelte';

	interface Props {
		title: string;
		id?: string;
		children: Snippet;
	}

	let { title, id, children }: Props = $props();
</script>

<section class="section" {id}>
	<SectionHeading>{title}</SectionHeading>
	{@render children()}
</section>

<style>
	.section {
		margin-top: 2.875rem;
		scroll-margin-top: 1.5rem;
	}
</style>

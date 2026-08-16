<script lang="ts">
	import { base } from '$app/paths';
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		external?: boolean;
		muted?: boolean;
		children: Snippet;
	}

	let { href, external = false, muted = false, children }: Props = $props();

	// Prefix root-relative links with the deploy base path. Hashes,
	// mailto:, and absolute URLs are left untouched.
	const resolved = $derived(href.startsWith('/') ? base + href : href);
</script>

<a
	href={resolved}
	class="link"
	class:muted
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}>{@render children()}</a
>

<style>
	.link {
		color: var(--color-accent);
		text-decoration: none;
	}
	.link:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.muted {
		color: var(--color-muted);
	}
	.muted:hover {
		color: var(--color-accent);
	}
</style>

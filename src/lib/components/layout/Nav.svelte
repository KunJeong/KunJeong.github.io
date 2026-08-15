<script lang="ts">
	import { base } from '$app/paths';
	import { site } from '$lib/content/site';
	import { profile } from '$lib/content/profile';
	import Link from '../atoms/Link.svelte';
</script>

<nav class="nav">
	<div class="wrap nav__in">
		<a class="brand" href={`${base}/`}>
			<span class="brand__mark">{profile.initials}</span>
			<span class="brand__name">{profile.name}</span>
		</a>
		<div class="nav__links">
			{#each site.nav as item}
				<Link href={item.href} external={item.external} muted>{item.label}</Link>
			{/each}
		</div>
	</div>
</nav>

<style>
	.nav {
		border-bottom: 1px solid var(--color-hairline);
	}
	.nav__in {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		text-decoration: none;
	}
	.brand__mark {
		width: 1.625rem;
		height: 1.625rem;
		border-radius: var(--radius-sm);
		background: var(--color-accent);
		color: var(--color-on-accent);
		font-family: var(--font-display);
		font-size: 0.8125rem;
		font-weight: 600;
		display: grid;
		place-items: center;
	}
	.brand__name {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-ink);
	}
	.nav__links {
		display: flex;
		gap: 1.375rem;
		font-size: var(--text-fine);
	}
	@media (max-width: 620px) {
		.nav__links {
			gap: 1rem;
		}
	}
</style>

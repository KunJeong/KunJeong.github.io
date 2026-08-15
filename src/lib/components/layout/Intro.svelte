<script lang="ts">
	import { profile } from '$lib/content/profile';
	import Avatar from '../atoms/Avatar.svelte';
	import Link from '../atoms/Link.svelte';
</script>

<header class="intro">
	<div class="intro__text">
		<h1 class="intro__name">{profile.name}</h1>
		<p class="intro__role">{profile.role}</p>
		<p class="intro__place">{profile.location}</p>
		<p class="intro__bio">{profile.bio}</p>
		<nav class="intro__links">
			{#each profile.links as link}
				<Link href={link.href} external={link.external}>{link.label}</Link>
			{/each}
		</nav>
	</div>
	<Avatar src={profile.photo} initials={profile.initials} alt={profile.name} />
</header>

<style>
	.intro {
		padding-top: 3.5rem;
		display: grid;
		grid-template-columns: 1fr 128px;
		gap: 2.125rem;
		align-items: start;
	}
	.intro__name {
		font-family: var(--font-display);
		font-size: var(--text-display);
		line-height: var(--text-display--line-height);
		font-weight: 600;
		letter-spacing: 0.002em;
		color: var(--color-ink);
		margin: 0 0 0.5rem;
	}
	.intro__role {
		font-size: var(--text-body);
		color: var(--color-muted);
		margin: 0;
	}
	.intro__place {
		font-size: var(--text-fine);
		color: var(--color-faint);
		margin: 0.25rem 0 0;
	}
	.intro__bio {
		font-size: var(--text-lede);
		line-height: 1.72;
		color: var(--color-ink);
		max-width: 60ch;
		margin: 1.125rem 0 0;
	}
	.intro__links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem 1.125rem;
		margin-top: 1.125rem;
		font-size: var(--text-fine);
	}
	@media (max-width: 620px) {
		.intro {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}
	}
</style>

<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		src?: string;
		initials: string;
		alt?: string;
	}

	let { src, initials, alt = '' }: Props = $props();

	const resolved = $derived(src && src.startsWith('/') ? base + src : src);
</script>

{#if resolved}
	<img class="avatar" src={resolved} {alt} width="128" height="148" />
{:else}
	<div class="avatar avatar--fallback" aria-hidden="true">
		<span>{initials}</span>
	</div>
{/if}

<style>
	.avatar {
		width: 128px;
		height: 148px;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-hairline);
		object-fit: cover;
		display: block;
	}
	.avatar--fallback {
		display: grid;
		place-items: center;
		background: var(--color-hairline);
	}
	.avatar--fallback span {
		font-family: var(--font-display);
		font-size: 2rem;
		color: var(--color-faint);
	}
	@media (max-width: 620px) {
		.avatar {
			width: 104px;
			height: 120px;
		}
	}
</style>

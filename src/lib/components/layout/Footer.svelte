<script lang="ts">
	import { profile } from '$lib/content/profile';

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="wrap footer__in">
		<span>© {year} {profile.name}</span>
	</div>
</footer>

<style>
	.footer__in {
		margin-top: 3.5rem;
		padding-top: 1.25rem;
		padding-bottom: 6.875rem;
		border-top: 1px solid var(--color-hairline);
		font-size: var(--text-meta);
		color: var(--color-faint);
	}
</style>

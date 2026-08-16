<script lang="ts">
	import Link from '$lib/components/atoms/Link.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import DateLabel from '$lib/components/atoms/DateLabel.svelte';
	import Row from '$lib/components/atoms/Row.svelte';
	import Avatar from '$lib/components/atoms/Avatar.svelte';
	import SectionHeading from '$lib/components/atoms/SectionHeading.svelte';
	import PubEntry from '$lib/components/cv/PubEntry.svelte';
	import ResearchNote from '$lib/components/cv/ResearchNote.svelte';
	import { publications } from '$lib/content/publications';
	import { research } from '$lib/content/research';

	const colors = [
		{ token: '--color-paper', role: 'surface' },
		{ token: '--color-ink', role: 'primary text' },
		{ token: '--color-muted', role: 'secondary text' },
		{ token: '--color-faint', role: 'meta text' },
		{ token: '--color-hairline', role: 'borders' },
		{ token: '--color-ink-blue', role: 'accent option' },
		{ token: '--color-deep-teal', role: 'accent option' },
		{ token: '--color-accent', role: 'active accent' }
	];

	const type = [
		{ token: '--text-display', font: 'var(--font-display)', role: 'Display / name' },
		{ token: '--text-heading', font: 'var(--font-heading)', role: 'Section heading' },
		{ token: '--text-lede', font: 'var(--font-sans)', role: 'Lede / bio' },
		{ token: '--text-body', font: 'var(--font-sans)', role: 'Body / lists' },
		{ token: '--text-fine', font: 'var(--font-sans)', role: 'Fine / authors, nav' },
		{ token: '--text-meta', font: 'var(--font-sans)', role: 'Meta / dates' }
	];
</script>

<svelte:head>
	<title>Style guide · Seokhun Jeong</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="sg">
	<header class="sg__head">
		<h1>Style guide</h1>
		<p>The design tokens and reusable components the site is built from, in one place.</p>
	</header>

	<section class="sg__block">
		<h2 class="sg__heading">Color tokens</h2>
		<div class="swatches">
			{#each colors as c}
				<div class="swatch">
					<div class="swatch__chip" style="background: var({c.token})"></div>
					<code>{c.token}</code>
					<span>{c.role}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="sg__block">
		<h2 class="sg__heading">Type scale</h2>
		<div class="type">
			{#each type as t}
				<div class="type__row">
					<span class="type__sample" style="font-size: var({t.token}); font-family: {t.font}"
						>{t.role}</span
					>
					<code>{t.token}</code>
				</div>
			{/each}
		</div>
	</section>

	<section class="sg__block">
		<h2 class="sg__heading">Atoms</h2>
		<div class="specimen">
			<span class="specimen__label">Link</span>
			<span>
				<Link href="/">Internal</Link> ·
				<Link href="https://example.com" external>External</Link> ·
				<Link href="#" muted>Muted</Link>
			</span>
		</div>
		<div class="specimen">
			<span class="specimen__label">SectionHeading</span>
			<SectionHeading>News</SectionHeading>
		</div>
		<div class="specimen">
			<span class="specimen__label">DateLabel</span>
			<DateLabel date="2026-08" />
		</div>
		<div class="specimen">
			<span class="specimen__label">Tag</span>
			<span class="tags"><Tag>evaluation</Tag><Tag>interpretability</Tag></span>
		</div>
		<div class="specimen">
			<span class="specimen__label">Avatar</span>
			<Avatar initials="SJ" />
		</div>
		<div class="specimen specimen--stack">
			<span class="specimen__label">Row</span>
			<div class="specimen__fill">
				<Row date="2026-08">A dated one-line entry, used for news and writing.</Row>
			</div>
		</div>
	</section>

	<section class="sg__block">
		<h2 class="sg__heading">CV components</h2>
		<div class="specimen specimen--stack">
			<span class="specimen__label">PubEntry</span>
			<div class="specimen__fill"><PubEntry pub={publications[0]} /></div>
		</div>
		<div class="specimen specimen--stack">
			<span class="specimen__label">ResearchNote</span>
			<div class="specimen__fill"><ResearchNote theme={research[0]} /></div>
		</div>
	</section>
</div>

<style>
	.sg {
		padding-top: 3rem;
	}
	.sg__head h1 {
		font-family: var(--font-display);
		font-size: var(--text-display);
		font-weight: 600;
		color: var(--color-ink);
		margin: 0 0 0.5rem;
	}
	.sg__head p {
		color: var(--color-muted);
		font-size: var(--text-body);
		line-height: 1.6;
		max-width: 60ch;
		margin: 0;
	}
	.sg__block {
		margin-top: 3rem;
	}
	.sg__heading {
		font-family: var(--font-heading);
		font-size: var(--text-heading);
		font-weight: 600;
		color: var(--color-ink);
		margin: 0 0 1.25rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-hairline);
	}

	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
		gap: 1rem;
	}
	.swatch {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}
	.swatch__chip {
		height: 3.5rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-hairline);
	}

	.type {
		display: flex;
		flex-direction: column;
	}
	.type__row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 1rem 0;
		border-top: 1px solid var(--color-hairline);
	}
	.type__sample {
		color: var(--color-ink);
		font-weight: 600;
		line-height: 1.1;
	}

	.specimen {
		display: grid;
		grid-template-columns: 9rem 1fr;
		gap: 1rem;
		align-items: center;
		padding: 1rem 0;
		border-top: 1px solid var(--color-hairline);
	}
	.specimen--stack {
		align-items: start;
	}
	.specimen__fill {
		width: 100%;
	}
	.tags {
		display: inline-flex;
		gap: 0.5rem;
	}

	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: var(--text-meta);
		color: var(--color-faint);
		white-space: nowrap;
	}
	.swatch code {
		color: var(--color-ink);
	}
	.swatch span {
		font-size: var(--text-meta);
		color: var(--color-faint);
	}
	.specimen__label {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: var(--text-meta);
		color: var(--color-faint);
	}

	@media (max-width: 620px) {
		.specimen {
			grid-template-columns: 1fr;
		}
	}
</style>

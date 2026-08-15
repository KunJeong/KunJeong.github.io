<script lang="ts">
	import { site } from '$lib/content/site';
	import { news } from '$lib/content/news';
	import { research } from '$lib/content/research';
	import { education } from '$lib/content/education';
	import { recentPosts } from '$lib/content/posts';
	import Intro from '$lib/components/layout/Intro.svelte';
	import Section from '$lib/components/layout/Section.svelte';
	import Row from '$lib/components/atoms/Row.svelte';
	import Link from '$lib/components/atoms/Link.svelte';
	import PublicationList from '$lib/components/cv/PublicationList.svelte';
	import ResearchNote from '$lib/components/cv/ResearchNote.svelte';
	import EduEntry from '$lib/components/cv/EduEntry.svelte';
</script>

<svelte:head>
	<title>{site.title} · {site.tagline}</title>
	<meta name="description" content={site.description} />
</svelte:head>

<Intro />

<Section title="News">
	{#each news as item}
		<Row date={item.date}>{item.text}</Row>
	{/each}
</Section>

<Section title="Research">
	{#each research as theme}
		<ResearchNote {theme} />
	{/each}
</Section>

<Section title="Publications">
	<PublicationList />
</Section>

<Section title="Education">
	{#each education as entry}
		<EduEntry {entry} />
	{/each}
</Section>

<Section title="Writing">
	{#each recentPosts as post}
		<Row date={post.date}><Link href={`/blog/${post.slug}`}>{post.title}</Link></Row>
	{/each}
</Section>

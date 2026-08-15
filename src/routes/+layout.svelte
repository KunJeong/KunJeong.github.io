<script lang="ts">
	import '$lib/styles/fonts.css';
	import '../app.css';
	import newsreaderUrl from '$lib/styles/fonts/Newsreader.woff2?url';
	import loraUrl from '$lib/styles/fonts/Lora.woff2?url';
	import Nav from '$lib/components/layout/Nav.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preload" href={newsreaderUrl} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={loraUrl} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<Nav />
<main class="wrap">
	{@render children()}
</main>
<Footer />

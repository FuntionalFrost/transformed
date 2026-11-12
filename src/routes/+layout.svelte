<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { Seo } from 'yaxa-svelte/seo';
	import { siteConfig } from '../site.config';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<Seo config={siteConfig} />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

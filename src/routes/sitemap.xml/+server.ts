import { createSitemapHandler } from 'yaxa-svelte/seo';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET = createSitemapHandler({
	config: siteConfig,
	staticRoutes: [
		{
			loc: '/',
			changefreq: 'weekly',
			priority: 1.0,
			lastmod: '2026-11-11'
		}
	]
});

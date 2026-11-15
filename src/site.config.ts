import { defineSiteConfig } from 'yaxa-svelte/seo';

export const siteConfig = defineSiteConfig({
	name: 'Attention Archive',
	title: 'The Architecture of Attention (2017–2026)',
	description:
		'The mathematical, algorithmic, and micro-architectural lineage of modern LLMs: from Scaled Dot-Product Attention in 2017 to FlashAttention asynchronous SRAM tiling, Multi-Head Latent Compression (MLA), and Blackwell NVFP4 / RDNA 4 WMMA silicon powering autonomous software engineering agents.',
	url: 'https://attentionarchive.pages.dev',
	email: 'devfrost@protonmail.com',
	version: '1.0.0',
	defaultLocale: 'en',
	project: {
		license: 'MIT',
		licenseUrl: 'https://github.com/FuntionalFrost/transformed/blob/main/LICENSE',
		type: 'open-source',
		pricingModel: 'open-source',
		isAccessibleForFree: true,
		badge: 'MIT Open Source',
		repositoryUrl: 'https://github.com/FuntionalFrost/transformed'
	},
	theme: {
		primaryColor: 'cyan',
		defaultMode: 'dark'
	},
	seo: {
		titleTemplate: '%s · Attention Archive',
		defaultOgImage: '/images/og-card.png',
		twitterCard: 'summary_large_image',
		keywords: [
			'attention',
			'transformers',
			'flashattention',
			'deepseek-mla',
			'autonomous-coding-agents',
			'tensor-cores',
			'blackwell-nvfp4',
			'rope',
			'grpo',
			'mcts',
			'svelte5'
		]
	},
	sitemap: {
		changefreq: 'weekly',
		priority: 1.0
	},
	robots: {
		rules: [
			{
				userAgent: '*',
				allow: ['/'],
				disallow: []
			}
		]
	}
});

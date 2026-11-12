import { createLlmsTxtHandler } from 'yaxa-svelte/seo';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET = createLlmsTxtHandler({
	config: siteConfig,
	sections: [
		{
			title: 'Core Attention Architecture & Lineage',
			description:
				'Chronology of mathematical, algorithmic, and micro-architectural breakthroughs from 2017 to 2026.',
			links: [
				{
					title: 'Vaswani et al. (2017) Attention Is All You Need',
					url: 'https://arxiv.org/abs/1706.03762',
					description:
						'Canonical attention operator: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V'
				},
				{
					title: 'Su et al. (2021) RoFormer: Rotary Position Embedding (RoPE)',
					url: 'https://arxiv.org/abs/2104.09864',
					description:
						'Relative position rotations enabling million-token context without position decay'
				},
				{
					title: 'DeepSeek (2024) Multi-Head Latent Attention (MLA)',
					url: 'https://arxiv.org/abs/2405.04434',
					description:
						'Low-rank key-value joint compression into 512-dim latent vector, cutting KV VRAM by 92%'
				},
				{
					title: 'Gloeckle et al. (2024) Multi-Token Prediction',
					url: 'https://arxiv.org/abs/2404.19737',
					description: 'Parallel n-token speculative heads accelerating inference by 3x'
				}
			]
		},
		{
			title: 'Hardware Accelerators & Kernel Innovation',
			description:
				'On-chip SRAM online softmax tiling, asynchronous TMA, and microscaling precision.',
			links: [
				{
					title: 'Tri Dao et al. (2022–2024) FlashAttention 1, 2 & 3',
					url: 'https://arxiv.org/abs/2205.14135',
					description: 'O(N) linear IO via online softmax tiling in 256 KB on-chip SRAM'
				},
				{
					title: 'NVIDIA Hopper TMA & Blackwell NVFP4',
					url: 'https://nvidia.com',
					description: 'Asynchronous hardware memory transfers and 4-bit microscaling tensor cores'
				},
				{
					title: 'AMD RDNA 4 WMMA Architecture (2025)',
					url: 'https://amd.com',
					description: 'Wave Matrix Multiply-Accumulate vector instructions for open silicon'
				}
			]
		},
		{
			title: 'The 5-Pillar Autonomous SEA Stack',
			description:
				'Vertical software engineering agent hierarchy connecting silicon to autonomous agency.',
			links: [
				{
					title: 'Layer 1: Context Layer (Attention, RoPE, MLA, MTP)',
					url: '/#timeline-section',
					description: 'Working memory preserving code AST syntax across 1M+ tokens'
				},
				{
					title: 'Layer 2: Hardware Engine (Tiled SRAM, Tensor Cores, NVFP4)',
					url: '/#timeline-section',
					description: 'High-throughput matrix acceleration sustaining 73%+ MFU'
				},
				{
					title: 'Layer 3: Scaling & Search (Chinchilla, MCTS, PRMs)',
					url: '/#timeline-section',
					description: 'Test-time compute scaling laws and Monte Carlo Tree Search'
				},
				{
					title: 'Layer 4: Training & RL (Codex, FIM, GRPO)',
					url: '/#timeline-section',
					description: 'Fill-in-the-Middle and compiler-reward Group Relative Policy Optimization'
				},
				{
					title: 'Layer 5: Agent Loop (ReAct, Tree-sitter Diffs, Micro-VMs)',
					url: '/#timeline-section',
					description: 'Autonomous tool cycles, surgical replacements, and Firecracker sandboxes'
				}
			]
		}
	],
	notes: [
		'Interactive Mathematical Simulator Suite available at https://attentionarchive.pages.dev/#simulator-lab',
		'Full codebase repository: https://github.com/attentionarchive/attention-archive',
		'Built with Svelte 5 runes, KaTeX, and Yaxa UI'
	]
});

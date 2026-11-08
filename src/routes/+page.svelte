<script lang="ts">
	import { Kbd } from 'yaxa-svelte';
	import { TIMELINE_MILESTONES, CATEGORIES, getAttentionHighlight } from '../lib/data/timeline';
	import type { CategoryId, CategoryInfo, Milestone } from '../lib/types';
	import MilestoneCard from '../lib/components/MilestoneCard.svelte';
	import MilestoneModal from '../lib/components/MilestoneModal.svelte';
	import KatexMath from '../lib/components/KatexMath.svelte';
	import KVLatentCalculator from '../lib/components/interactive/KVLatentCalculator.svelte';
	import GRPOSimulator from '../lib/components/interactive/GRPOSimulator.svelte';
	import ChinchillaSimulator from '../lib/components/interactive/ChinchillaSimulator.svelte';
	import PassKCalculator from '../lib/components/interactive/PassKCalculator.svelte';
	import PrecisionExplorer from '../lib/components/interactive/PrecisionExplorer.svelte';
	import ReActLoopSimulator from '../lib/components/interactive/ReActLoopSimulator.svelte';
	import FlashAttentionVisualizer from '../lib/components/interactive/FlashAttentionVisualizer.svelte';
	import TestTimeSearchSimulator from '../lib/components/interactive/TestTimeSearchSimulator.svelte';
	import PageRankExplorer from '../lib/components/interactive/PageRankExplorer.svelte';
	import AttentionExploder from '../lib/components/interactive/AttentionExploder.svelte';
	import NeuroAttentionExplorer from '../lib/components/interactive/NeuroAttentionExplorer.svelte';
	import RopeExplorer from '../lib/components/interactive/RopeExplorer.svelte';
	import FimSimulator from '../lib/components/interactive/FimSimulator.svelte';
	import MtpVisualizer from '../lib/components/interactive/MtpVisualizer.svelte';
	import TensorTileBitboard from '../lib/components/interactive/TensorTileBitboard.svelte';

	// Filters & State
	let selectedYear = $state<number | 'all'>('all');
	let selectedCategory = $state<CategoryId | 'all'>('all');
	let searchQuery = $state('');
	let viewMode = $state<'timeline' | 'grid' | 'lab'>('timeline');
	let heroDieView = $state<'formula' | 'bitboard'>('formula');
	let activeModalMilestone = $state<Milestone | null>(null);
	let isReactorSurging = $state(false);
	let surgeTimeout: ReturnType<typeof setTimeout> | null = null;

	function triggerReactorSurge() {
		if (surgeTimeout) clearTimeout(surgeTimeout);
		isReactorSurging = true;
		surgeTimeout = setTimeout(() => {
			isReactorSurging = false;
		}, 2200);
	}
	let selectedNeuroDrug = $state<
		'lisdexamfetamine' | 'methylphenidate' | 'dextroamphetamine' | 'acetylcholine'
	>('lisdexamfetamine');
	let activeLabTab = $state<
		| 'bitboard'
		| 'mla'
		| 'grpo'
		| 'chinchilla'
		| 'passk'
		| 'flash'
		| 'test-time'
		| 'react'
		| 'precision'
		| 'pagerank'
		| 'attention'
		| 'neuro'
		| 'rope'
		| 'fim'
		| 'mtp'
	>('bitboard');

	const years = [2017, 2021, 2022, 2023, 2024, 2025, 2026];
	const categoryList = Object.values(CATEGORIES) as CategoryInfo[];

	const yearLabels: Record<number, string> = {
		2017: '2017: Attention Revolution & Matrix Tensor Cores',
		2021: '2021: Relative Position (RoPE), Code CLM & BF16',
		2022: '2022: Compute-Optimal Scaling, FlashAttention & The ReAct Cycle',
		2023: '2023: llama.cpp, Ollama, FlashAttention-2 & Deterministic Diffs',
		2024: '2024: FlashAttention-3, Blackwell NVFP4 & Latent Context (MLA)',
		2025: '2025: AMD RDNA 4 WMMA, Test-Time Scaling & Critic-Free RL',
		2026: '2026: Industrial MCP, Micro-VM Sandboxes & Autonomous SEA'
	};

	const attentionHeroFormula =
		'\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V';

	let copiedHeroLatex = $state(false);

	async function copyHeroLatex() {
		try {
			await navigator.clipboard.writeText(attentionHeroFormula);
			copiedHeroLatex = true;
			setTimeout(() => {
				copiedHeroLatex = false;
			}, 1800);
		} catch (err) {
			console.error('Failed to copy LaTeX', err);
		}
	}

	const conferenceChips = [
		{
			conf: 'NeurIPS',
			year: 2017,
			fullConf: 'NeurIPS 2017 (Long Beach)',
			seminalWork: 'Attention Is All You Need',
			citation: 'Vaswani et al. · Scaled Dot-Product Attention & Self-Attention',
			activeBorder: 'border-cyan-400',
			activeBg: 'bg-cyan-950/60',
			activeText: 'text-cyan-200',
			activeRing: 'ring-cyan-400/50',
			textColor: 'text-cyan-400'
		},
		{
			conf: 'ICLR',
			year: 2022,
			fullConf: 'ICLR 2022 · NeurIPS 2022',
			seminalWork: 'FlashAttention-1 & Chinchilla Scaling',
			citation: 'Dao et al. · Hoffmann, Kaplan et al. · Tiled SRAM Matrix Loops',
			activeBorder: 'border-amber-400',
			activeBg: 'bg-amber-950/60',
			activeText: 'text-amber-200',
			activeRing: 'ring-amber-400/50',
			textColor: 'text-amber-400'
		},
		{
			conf: 'ASPLOS',
			year: 2024,
			fullConf: 'ASPLOS 2024 · ICML 2024',
			seminalWork: 'FlashAttention-3 & DeepSeek-V2 MLA',
			citation: 'Shah, Dao et al. · Hopper TMA, WGMMA & Latent Compression',
			activeBorder: 'border-emerald-400',
			activeBg: 'bg-emerald-950/60',
			activeText: 'text-emerald-200',
			activeRing: 'ring-emerald-400/50',
			textColor: 'text-emerald-400'
		},
		{
			conf: 'IEEE Micro',
			year: 2026,
			fullConf: 'IEEE Micro 2025–2026 · Hot Chips',
			seminalWork: 'Blackwell NVFP4 & Agent Micro-VMs',
			citation: 'NVIDIA, AMD RDNA 4 & Industrial Agent Protocols',
			activeBorder: 'border-violet-400',
			activeBg: 'bg-violet-950/60',
			activeText: 'text-violet-200',
			activeRing: 'ring-violet-400/50',
			textColor: 'text-violet-400'
		}
	];

	function jumpToConferenceYear(year: number) {
		selectedYear = selectedYear === year ? 'all' : year;
		if (viewMode === 'lab') {
			viewMode = 'timeline';
		}
		const el = document.getElementById('timeline-section');
		el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function switchViewMode(mode: 'timeline' | 'grid' | 'lab') {
		viewMode = mode;
		setTimeout(() => {
			const targetId = mode === 'lab' ? 'simulator-lab' : 'timeline-section';
			const el = document.getElementById(targetId);
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 40);
	}

	let filteredMilestones = $derived.by(() => {
		return TIMELINE_MILESTONES.filter((m: Milestone) => {
			const matchesYear = selectedYear === 'all' || m.year === selectedYear;
			const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
			const q = searchQuery.toLowerCase().trim();
			const matchesSearch =
				!q ||
				m.title.toLowerCase().includes(q) ||
				m.subtitle.toLowerCase().includes(q) ||
				m.authors.toLowerCase().includes(q) ||
				m.tags.some((t: string) => t.toLowerCase().includes(q)) ||
				m.equations.some(
					(e: { latex: string; label: string }) =>
						e.latex.toLowerCase().includes(q) || e.label.toLowerCase().includes(q)
				);

			return matchesYear && matchesCategory && matchesSearch;
		});
	});

	function handleGlobalKeydown(e: KeyboardEvent) {
		if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
			e.preventDefault();
			const searchInput = document.getElementById('search-input');
			searchInput?.focus();
		}
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<div
	class="attention-grid relative flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200"
>
	<!-- Accessible Skip Link (WCAG 2.4.1 Bypass Blocks) -->
	<a
		href="#main-content"
		class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-cyan-400 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:text-slate-950 focus:shadow-xl focus:outline-none"
	>
		Skip to main content
	</a>

	<!-- Attention & FlashAttention Memory Flow Background FX -->
	<div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
		<div
			class="absolute -top-40 left-1/2 h-[550px] w-[1100px] -translate-x-1/2 bg-gradient-to-b from-cyan-500/15 via-amber-500/10 to-transparent opacity-80 blur-3xl"
		></div>
		<div class="absolute top-[400px] -left-48 h-[650px] w-[650px] bg-cyan-500/10 blur-3xl"></div>
		<div class="absolute top-[800px] -right-48 h-[650px] w-[650px] bg-amber-500/10 blur-3xl"></div>
		<div class="absolute top-[1400px] left-1/3 h-[500px] w-[500px] bg-violet-500/8 blur-3xl"></div>
	</div>

	<!-- Navigation Bar -->
	<header class="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
		<!-- Optical Bus Photonic Gradient Edge -->
		<div
			class="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
		></div>
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
			<div class="flex items-center gap-3">
				<div
					class="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/20 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]"
				>
					<!-- Micro-chip corner fiducials -->
					<div class="pointer-events-none absolute inset-0 opacity-40">
						<span class="absolute top-0.5 left-0.5 h-1 w-1 border-t border-l border-cyan-400"
						></span>
						<span class="absolute top-0.5 right-0.5 h-1 w-1 border-t border-r border-cyan-400"
						></span>
						<span class="absolute bottom-0.5 left-0.5 h-1 w-1 border-b border-l border-cyan-400"
						></span>
						<span class="absolute right-0.5 bottom-0.5 h-1 w-1 border-r border-b border-cyan-400"
						></span>
					</div>

					<!-- Bespoke Attention Archive Logo Mark: Architectural 'A' with Quantum Attention Crossbar -->
					<svg
						class="h-5 w-5 transition-transform duration-300 group-hover:scale-105"
						viewBox="0 0 32 32"
						fill="none"
						aria-label="Attention Archive Logo"
					>
						<defs>
							<linearGradient id="logoArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
								<stop offset="0%" stop-color="#22d3ee" />
								<stop offset="60%" stop-color="#38bdf8" />
								<stop offset="100%" stop-color="#f59e0b" />
							</linearGradient>
							<filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
								<feGaussianBlur stdDeviation="1" result="blur" />
								<feComposite in="SourceGraphic" in2="blur" operator="over" />
							</filter>
						</defs>
						<!-- Silicon Die Substrate / Alignment Grid -->
						<rect
							x="3"
							y="3"
							width="26"
							height="26"
							rx="4"
							stroke="#0891b2"
							stroke-width="1"
							stroke-dasharray="2 2"
							opacity="0.35"
						/>
						<!-- I/O Die Pin Notches -->
						<line
							x1="2"
							y1="16"
							x2="4.5"
							y2="16"
							stroke="#22d3ee"
							stroke-width="1.5"
							stroke-linecap="round"
							opacity="0.7"
						/>
						<line
							x1="27.5"
							y1="16"
							x2="30"
							y2="16"
							stroke="#22d3ee"
							stroke-width="1.5"
							stroke-linecap="round"
							opacity="0.7"
						/>
						<line
							x1="16"
							y1="2"
							x2="16"
							y2="4.5"
							stroke="#22d3ee"
							stroke-width="1.5"
							stroke-linecap="round"
							opacity="0.7"
						/>
						<line
							x1="16"
							y1="27.5"
							x2="16"
							y2="30"
							stroke="#22d3ee"
							stroke-width="1.5"
							stroke-linecap="round"
							opacity="0.7"
						/>
						<!-- Architectural 'A' Struts -->
						<path
							d="M8.5 24.5L16 6.5L23.5 24.5"
							stroke="url(#logoArchGrad)"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<!-- Attention Matrix Crossbar Bridge -->
						<path
							d="M11 18.5H21"
							stroke="#38bdf8"
							stroke-width="2"
							stroke-linecap="round"
							opacity="0.9"
						/>
						<!-- Illuminated Quantum Core Focal Dot -->
						<circle cx="16" cy="18.5" r="2.2" fill="#f59e0b" filter="url(#logoGlow)" />
						<!-- Apex Vertex Focus Point -->
						<circle cx="16" cy="6.5" r="1.4" fill="#22d3ee" />
					</svg>
				</div>
				<div>
					<span
						class="flex items-center gap-2 text-sm font-black tracking-wider text-white uppercase sm:text-base"
					>
						<span>Attention Archive</span>
						<span
							class="rounded-full border border-cyan-400/50 bg-cyan-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300"
						>
							2017 → 2026
						</span>
					</span>
					<p class="hidden font-mono text-[10px] text-slate-400 sm:flex sm:items-center sm:gap-1.5">
						<span class="text-slate-300">TRANSFORMERS (2017)</span>
						<span class="text-cyan-500/70">➔</span>
						<span class="text-amber-300/90">FLASHATTENTION (2022–24)</span>
						<span class="text-cyan-500/70">➔</span>
						<span class="text-violet-300/90">BLACKWELL / RDNA 4 (2026)</span>
					</p>
				</div>
			</div>

			<!-- View Mode Toggles -->
			<div class="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/90 p-1">
				<button
					type="button"
					onclick={() => switchViewMode('timeline')}
					aria-pressed={viewMode === 'timeline'}
					class="flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-xs transition-colors {viewMode ===
					'timeline'
						? 'bg-cyan-600 font-bold text-white shadow-sm'
						: 'text-slate-400 hover:text-slate-200'}"
				>
					<svg
						class="h-3.5 w-3.5 shrink-0 opacity-80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="3" y1="12" x2="21" y2="12" />
						<polyline points="17 8 21 12 17 16" />
						<circle cx="7" cy="12" r="2" fill="currentColor" />
						<circle cx="12" cy="12" r="2" fill="currentColor" />
					</svg>
					<span>Timeline Flow</span>
				</button>
				<button
					type="button"
					onclick={() => switchViewMode('grid')}
					aria-pressed={viewMode === 'grid'}
					class="flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-xs transition-colors {viewMode ===
					'grid'
						? 'bg-cyan-600 font-bold text-white shadow-sm'
						: 'text-slate-400 hover:text-slate-200'}"
				>
					<svg
						class="h-3.5 w-3.5 shrink-0 opacity-80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="3" y="3" width="7" height="7" rx="1" />
						<rect x="14" y="3" width="7" height="7" rx="1" />
						<rect x="14" y="14" width="7" height="7" rx="1" />
						<rect x="3" y="14" width="7" height="7" rx="1" />
					</svg>
					<span>Matrix Grid</span>
				</button>
				<button
					type="button"
					onclick={() => switchViewMode('lab')}
					aria-pressed={viewMode === 'lab'}
					class="flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-xs transition-colors {viewMode ===
					'lab'
						? 'bg-cyan-600 font-bold text-white shadow-sm'
						: 'text-slate-400 hover:text-slate-200'}"
				>
					<svg
						class="h-3.5 w-3.5 shrink-0 opacity-80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
					</svg>
					<span>Simulator Lab</span>
				</button>
			</div>
		</div>
	</header>

	<main
		id="main-content"
		tabindex="-1"
		class="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 outline-none sm:px-6 sm:py-12"
	>
		<!-- Attention Is All You Need & FlashAttention Hero -->
		<section class="relative mx-auto mb-12 max-w-5xl text-center">
			<!-- Silicon Die Backplane & Radial Photonic Core Glow -->
			<div
				class="pointer-events-none absolute -top-16 left-1/2 -z-10 h-[500px] w-full max-w-4xl -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.14)_0%,rgba(245,158,11,0.06)_45%,transparent_75%)] blur-3xl"
			></div>

			<!-- Interactive Research Lineage & Conference Citation Chips -->
			<div
				class="mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-800/90 bg-slate-950/80 p-1.5 shadow-2xl backdrop-blur-md"
			>
				<span class="px-2 font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase">
					PROCEEDINGS:
				</span>

				{#each conferenceChips as chip (chip.conf)}
					<div class="group/chip relative">
						<button
							type="button"
							onclick={() => jumpToConferenceYear(chip.year)}
							class="cursor-pointer rounded-xl border px-3 py-1 font-mono text-xs transition-all duration-200 {selectedYear ===
							chip.year
								? `${chip.activeBorder} ${chip.activeBg} ${chip.activeText} shadow-lg ring-1 ${chip.activeRing} font-bold`
								: 'border-slate-800/90 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'}"
						>
							<span class="font-bold">{chip.conf}</span>
							<span class="ml-1 opacity-70">'{chip.year.toString().slice(2)}</span>
						</button>

						<!-- Floating HUD Tooltip on Hover (Opens downwards into open hero canvas) -->
						<div
							class="pointer-events-none absolute top-full left-1/2 z-50 mt-2.5 -translate-x-1/2 -translate-y-1 opacity-0 transition-all duration-200 group-hover/chip:translate-y-0 group-hover/chip:opacity-100"
						>
							<div
								class="w-68 rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 text-left shadow-2xl ring-1 ring-slate-700/50 backdrop-blur-xl"
							>
								<div
									class="flex items-center justify-between font-mono text-[10px] font-bold uppercase {chip.textColor}"
								>
									<span>{chip.fullConf}</span>
									<span>{chip.year}</span>
								</div>
								<div class="mt-1 font-sans text-xs font-semibold text-slate-100">
									{chip.seminalWork}
								</div>
								<p class="mt-1 font-mono text-[10px] text-slate-400">
									{chip.citation}
								</p>
								<div
									class="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-1.5 font-mono text-[9px] text-cyan-400"
								>
									<span>Isolate {chip.year} research</span>
									<span>➔</span>
								</div>
							</div>
						</div>
					</div>
				{/each}

				<span class="hidden px-2 text-slate-700 sm:inline">|</span>
				<span class="hidden px-2 font-mono text-[11px] font-semibold text-slate-400 md:inline">
					SYSTEMS & ARCHITECTURE ARCHIVE
				</span>
			</div>

			<h1
				class="text-4xl leading-none font-black tracking-tight text-white uppercase sm:text-6xl lg:text-7xl"
			>
				The Architecture of <br />
				<span
					class="bg-gradient-to-r from-cyan-400 via-amber-300 to-violet-400 bg-clip-text text-transparent"
				>
					Attention
				</span>
			</h1>

			<p class="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
				The mathematical, algorithmic, and micro-architectural lineage of modern LLMs: from
				<strong class="text-cyan-300">Scaled Dot-Product Attention</strong> in 2017 to
				<strong class="text-amber-300">FlashAttention asynchronous SRAM tiling</strong>,
				<strong class="text-emerald-300">Multi-Head Latent Compression (MLA)</strong>, and
				<strong class="text-violet-300">Blackwell NVFP4 / RDNA 4 WMMA silicon</strong> powering autonomous
				software engineering agents.
			</p>

			<!-- Monolithic Silicon Die Package (Unified Hardware Architecture) -->
			<div
				class="group relative mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border transition-all duration-500 {isReactorSurging
					? 'scale-[1.006] border-cyan-400/80 bg-slate-950 shadow-[0_0_60px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/70'
					: 'border-slate-800/80 bg-slate-950/90 shadow-2xl hover:border-slate-700/90'}"
			>
				<!-- Subtle Silicon Wafer Dither Pattern & Plasma Glow -->
				<div
					class="dither-grid-subtle pointer-events-none absolute inset-0 opacity-40"
					aria-hidden="true"
				></div>
				<div
					class="pointer-events-none absolute -inset-20 rounded-full bg-gradient-to-r from-cyan-500/8 via-amber-500/8 to-transparent blur-3xl transition-opacity duration-500 {isReactorSurging
						? 'opacity-100'
						: 'opacity-30'}"
					aria-hidden="true"
				></div>

				<!-- 1. Top Substrate Telemetry Header -->
				<div
					class="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5 font-mono text-[11px]"
				>
					<div class="flex items-center gap-2">
						<span
							class="flex h-2 w-2 rounded-full {isReactorSurging
								? 'animate-ping bg-amber-400'
								: 'animate-pulse bg-cyan-400'}"
						></span>
						<span class="font-bold tracking-wider text-slate-200 uppercase">
							NOC-DIE // CANONICAL ATTENTION OPERATOR
						</span>
						<span
							class="rounded border border-cyan-800/60 bg-cyan-950/70 px-2 py-0.5 font-mono text-[10px] text-cyan-300"
						>
							{isReactorSurging
								? '⚡ DISPATCHING: WARP GEMM + ASYNC SRAM TILING'
								: 'ROOFLINE INTENSITY: O(N) IO · O(N²) FLOP'}
						</span>
					</div>

					<div class="flex items-center gap-2">
						<!-- TeX vs Bit-Tile Mode Toggle -->
						<div
							class="flex items-center rounded border border-slate-700/80 bg-slate-800/80 p-0.5 font-mono text-[10px]"
						>
							<button
								type="button"
								onclick={() => (heroDieView = 'formula')}
								class="cursor-pointer rounded px-2 py-0.5 transition-colors {heroDieView ===
								'formula'
									? 'bg-cyan-600 font-bold text-white'
									: 'text-slate-400 hover:text-slate-200'}"
								title="Display continuous KaTeX equation"
							>
								TeX
							</button>
							<button
								type="button"
								onclick={() => (heroDieView = 'bitboard')}
								class="flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 transition-colors {heroDieView ===
								'bitboard'
									? 'bg-cyan-600 font-bold text-white'
									: 'text-slate-400 hover:text-slate-200'}"
								title="Display 16×16 Tensor Core SRAM Bitboard"
							>
								<span>▦</span>
								<span>Bit-Tile</span>
							</button>
						</div>

						<button
							type="button"
							onclick={triggerReactorSurge}
							class="cursor-pointer rounded border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase transition-all duration-300 {isReactorSurging
								? 'animate-pulse border-amber-400 bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40'
								: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white'}"
							title="Simulate Tensor Core Forward Pass Dispatch"
						>
							{isReactorSurging ? '⚡ DISPATCHING KERNEL...' : 'BENCHMARK DISPATCH ⚡'}
						</button>
						<button
							type="button"
							onclick={copyHeroLatex}
							class="cursor-pointer rounded border border-slate-700/80 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-300 transition-colors hover:border-cyan-400 hover:bg-slate-700 hover:text-cyan-200"
							title="Copy Canonical LaTeX Formula"
						>
							{copiedHeroLatex ? 'Copied!' : 'Copy TeX'}
						</button>
						<span class="hidden text-slate-500 sm:inline">NeurIPS 2017 · 2022 · 2023</span>
					</div>
				</div>

				<!-- 2. Formal Operator Specification Core -->
				<div class="relative z-10 px-5 pt-5 pb-4">
					{#if heroDieView === 'formula'}
						<!-- Mathematical Formula -->
						<div class="py-2 text-center text-lg sm:text-xl">
							<KatexMath latex={attentionHeroFormula} displayMode={true} copyable={false} />
						</div>
					{:else}
						<!-- 16x16 SRAM Tile Bitboard View -->
						<div class="py-1">
							<TensorTileBitboard />
						</div>
					{/if}

					<!-- Fast SRAM Tiling Footnote & Inspector Link -->
					<div
						class="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-2 font-mono text-[11px]"
					>
						<div class="flex items-center gap-2 text-slate-400">
							<span class="inline-flex items-center gap-1.5 text-cyan-400">
								<span class="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
								<span>IO-aware asynchronous SRAM tiling & online softmax (Tri Dao et al.)</span>
							</span>
						</div>
						<button
							type="button"
							onclick={() => {
								viewMode = 'lab';
								activeLabTab = 'bitboard';
							}}
							class="cursor-pointer font-semibold text-cyan-400 underline decoration-cyan-500/40 hover:text-cyan-200"
						>
							Inspect Full Bitboard in Simulator Lab →
						</button>
					</div>
				</div>

				<!-- 3. Embedded High-Speed On-Chip Crossbar (NoC / NVLink Fabric) -->
				<div class="relative z-10 border-t border-b border-slate-800/80 bg-slate-950/70 py-1.5">
					<!-- Crossbar Telemetry Rail -->
					<div
						class="flex items-center justify-between px-4 pb-1 font-mono text-[9px] tracking-wider text-slate-500 uppercase"
					>
						<div class="flex items-center gap-1.5 text-slate-400">
							<span class="h-1 w-1 rounded-full bg-cyan-400"></span>
							<span>HIGH-SPEED ON-CHIP CROSSBAR // 128-BIT ASYNC INTERCONNECT</span>
						</div>
						<span>3.2 TB/S HBM3e ⟷ 256 KB L1/SRAM PER SM</span>
					</div>

					<!-- Silicon Bus Transmission Channels (Directly feeding into the 4 Functional Blocks) -->
					<div class="grid grid-cols-2 divide-x divide-slate-800/50 sm:grid-cols-4">
						<!-- Bus Channel 0 (Cyan - Context) -->
						<div class="flex items-center justify-between bg-cyan-950/15 px-3 py-1">
							<span class="font-mono text-[9px] font-semibold text-cyan-400/90">BUS_0: TMA_CTX</span
							>
							<span
								class="flex h-1.5 w-1.5 rounded-full {isReactorSurging
									? 'animate-ping bg-cyan-400'
									: 'bg-cyan-500/70'}"
							></span>
						</div>
						<!-- Bus Channel 1 (Amber - SRAM Tiling) -->
						<div class="flex items-center justify-between bg-amber-950/15 px-3 py-1">
							<span class="font-mono text-[9px] font-semibold text-amber-400/90"
								>BUS_1: SRAM_TILE</span
							>
							<span
								class="flex h-1.5 w-1.5 rounded-full {isReactorSurging
									? 'animate-ping bg-amber-400'
									: 'bg-amber-500/70'}"
							></span>
						</div>
						<!-- Bus Channel 2 (Emerald - Tensor ALU) -->
						<div class="flex items-center justify-between bg-emerald-950/15 px-3 py-1">
							<span class="font-mono text-[9px] font-semibold text-emerald-400/90"
								>BUS_2: WARP_ALU</span
							>
							<span
								class="flex h-1.5 w-1.5 rounded-full {isReactorSurging
									? 'animate-ping bg-emerald-400'
									: 'bg-emerald-500/70'}"
							></span>
						</div>
						<!-- Bus Channel 3 (Violet - MLA Latent) -->
						<div class="flex items-center justify-between bg-violet-950/15 px-3 py-1">
							<span class="font-mono text-[9px] font-semibold text-violet-400/90"
								>BUS_3: MLA_LATENT</span
							>
							<span
								class="flex h-1.5 w-1.5 rounded-full {isReactorSurging
									? 'animate-ping bg-violet-400'
									: 'bg-violet-500/70'}"
							></span>
						</div>
					</div>

					<!-- Animated Photonic Dataflow Laser Beam across the Crossbar -->
					<div class="relative h-1 w-full overflow-hidden bg-slate-900" aria-hidden="true">
						<div
							class="h-full w-full bg-gradient-to-r from-cyan-500 via-amber-400 to-violet-500 {isReactorSurging
								? 'animate-pulse opacity-100 duration-300'
								: 'opacity-40'}"
						></div>
					</div>
				</div>

				<!-- 4. Lower Die Substrate: 4 Integrated Execution Blocks -->
				<div
					class="relative z-10 grid grid-cols-1 divide-y divide-slate-800/80 bg-slate-900/40 text-left sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4"
				>
					<!-- Block 0: Effective Context Window (Cyan Channel) -->
					<div
						class="p-4 transition-colors duration-300 hover:bg-slate-900/70 {isReactorSurging
							? 'bg-cyan-950/20'
							: ''}"
					>
						<div class="flex items-center justify-between">
							<div class="font-mono text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
								Effective Context
							</div>
							<span class="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
						</div>
						<div class="mt-1 font-mono text-2xl font-black text-white">1M+ Tokens</div>
						<div class="mt-1 text-[11px] leading-snug text-slate-400">
							Up from 512 tokens (2017) · &gt;99.8% Needle-in-a-Haystack retrieval
						</div>
						<div class="mt-2.5 font-mono text-[9px] tracking-wider text-slate-500 uppercase">
							RoPE + RingAttention
						</div>
					</div>

					<!-- Block 1: Flash Memory IO (Amber Channel) -->
					<div
						class="p-4 transition-colors duration-300 hover:bg-slate-900/70 {isReactorSurging
							? 'bg-amber-950/20'
							: ''}"
					>
						<div class="flex items-center justify-between">
							<div class="font-mono text-[10px] font-bold tracking-wider text-amber-400 uppercase">
								HBM Memory Traffic
							</div>
							<span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
						</div>
						<div class="mt-1 font-mono text-2xl font-black text-white">O(N) Linear IO</div>
						<div class="mt-1 text-[11px] leading-snug text-slate-400">
							Tiled SRAM eliminates intermediate O(N²) quadratic HBM writes
						</div>
						<div class="mt-2.5 font-mono text-[9px] tracking-wider text-slate-500 uppercase">
							FlashAttention-1/2/3
						</div>
					</div>

					<!-- Block 2: Tensor Core Efficiency (Emerald Channel) -->
					<div
						class="p-4 transition-colors duration-300 hover:bg-slate-900/70 {isReactorSurging
							? 'bg-emerald-950/20'
							: ''}"
					>
						<div class="flex items-center justify-between">
							<div
								class="font-mono text-[10px] font-bold tracking-wider text-emerald-400 uppercase"
							>
								Tensor Core Efficiency
							</div>
							<span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
						</div>
						<div class="mt-1 font-mono text-2xl font-black text-white">73% A100/H100</div>
						<div class="mt-1 text-[11px] leading-snug text-slate-400">
							Warp-specialized asynchronous TMA copy & ping-pong GEMM
						</div>
						<div class="mt-2.5 font-mono text-[9px] tracking-wider text-slate-500 uppercase">
							FP8 / NVFP4 Tensor Cores
						</div>
					</div>

					<!-- Block 3: KV Cache Compression (Violet Channel) -->
					<div
						class="p-4 transition-colors duration-300 hover:bg-slate-900/70 {isReactorSurging
							? 'bg-violet-950/20'
							: ''}"
					>
						<div class="flex items-center justify-between">
							<div class="font-mono text-[10px] font-bold tracking-wider text-violet-400 uppercase">
								KV-Cache Latent VRAM
							</div>
							<span class="h-1.5 w-1.5 rounded-full bg-violet-400"></span>
						</div>
						<div class="mt-1 font-mono text-2xl font-black text-white">-92% Footprint</div>
						<div class="mt-1 text-[11px] leading-snug text-slate-400">
							Low-rank joint key-value compression via latent vector c_t^KV ∈ ℝ^{512}
						</div>
						<div class="mt-2.5 font-mono text-[9px] tracking-wider text-slate-500 uppercase">
							Multi-Head Latent Attn
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 2026 Full Stack Architecture Map & Timeline Filters (Visible in Timeline & Grid Views) -->
		{#if viewMode !== 'lab'}
			<!-- 2026 Full Stack Architecture Map (Clickable to Filter) -->
			<section
				class="relative mb-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm sm:p-6"
			>
				<!-- Subtle Silicon Wafer Dither Pattern -->
				<div
					class="dither-grid-subtle pointer-events-none absolute inset-0 opacity-35"
					aria-hidden="true"
				></div>
				<div class="mb-3 flex items-center justify-between border-b border-slate-800/80 pb-3">
					<h2
						class="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-200 uppercase"
					>
						<span class="h-2 w-2 rounded-full bg-cyan-400"></span>
						The 5-Pillar Autonomous SEA Stack (Click a layer to filter)
					</h2>
					<span class="hidden font-mono text-xs text-slate-400 sm:inline"
						>Interactive Layer Selector</span
					>
				</div>

				<div class="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 md:grid-cols-5">
					<button
						type="button"
						onclick={() =>
							(selectedCategory = selectedCategory === 'architecture' ? 'all' : 'architecture')}
						class="rounded-lg border p-3.5 text-left transition-all {selectedCategory ===
						'architecture'
							? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20'
							: 'border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400'}"
					>
						<div class="mb-1 flex items-center justify-between font-mono font-bold text-cyan-300">
							<span>1. Context Layer</span>
							{#if selectedCategory === 'architecture'}<span class="text-[10px] text-cyan-400"
									>Active</span
								>{/if}
						</div>
						<p class="text-[11px] leading-relaxed text-slate-300">
							Transformers (2017), RoPE (2021), Multi-Head Latent Attention (2024), and Multi-Token
							Lookahead (MTP). Foundation for high-fidelity code AST ingestion.
						</p>
					</button>

					<button
						type="button"
						onclick={() =>
							(selectedCategory = selectedCategory === 'hardware' ? 'all' : 'hardware')}
						class="rounded-lg border p-3.5 text-left transition-all {selectedCategory === 'hardware'
							? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-500/20'
							: 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400'}"
					>
						<div
							class="mb-1 flex items-center justify-between font-mono font-bold text-emerald-300"
						>
							<span>2. Hardware Engine</span>
							{#if selectedCategory === 'hardware'}<span class="text-[10px] text-emerald-400"
									>Active</span
								>{/if}
						</div>
						<p class="text-[11px] leading-relaxed text-slate-300">
							Tensor Cores (Volta to Blackwell B200), NVFP4 microscaling, AMD RDNA 4 WMMA,
							FlashAttention 1, 2 & 3 TMA async tiling, and TensorRT-LLM continuous batching.
						</p>
					</button>

					<button
						type="button"
						onclick={() => (selectedCategory = selectedCategory === 'scaling' ? 'all' : 'scaling')}
						class="rounded-lg border p-3.5 text-left transition-all {selectedCategory === 'scaling'
							? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/20'
							: 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400'}"
					>
						<div class="mb-1 flex items-center justify-between font-mono font-bold text-amber-300">
							<span>3. Scaling & Search</span>
							{#if selectedCategory === 'scaling'}<span class="text-[10px] text-amber-400"
									>Active</span
								>{/if}
						</div>
						<p class="text-[11px] leading-relaxed text-slate-300">
							Chinchilla compute optimality (6ND) and Test-Time Compute Scaling laws. MCTS with UCT
							bounds and Process Reward Models (PRMs).
						</p>
					</button>

					<button
						type="button"
						onclick={() =>
							(selectedCategory = selectedCategory === 'training' ? 'all' : 'training')}
						class="rounded-lg border p-3.5 text-left transition-all {selectedCategory === 'training'
							? 'border-violet-400 bg-violet-950/40 shadow-lg shadow-violet-500/20'
							: 'border-violet-500/30 bg-violet-950/20 hover:border-violet-400'}"
					>
						<div class="mb-1 flex items-center justify-between font-mono font-bold text-violet-300">
							<span>4. Training & RL</span>
							{#if selectedCategory === 'training'}<span class="text-[10px] text-violet-400"
									>Active</span
								>{/if}
						</div>
						<p class="text-[11px] leading-relaxed text-slate-300">
							Causal LM on code, pass@k test suites, Fill-in-the-Middle (FIM), and critic-free Group
							Relative Policy Optimization (GRPO).
						</p>
					</button>

					<button
						type="button"
						onclick={() =>
							(selectedCategory = selectedCategory === 'agent-loop' ? 'all' : 'agent-loop')}
						class="rounded-lg border p-3.5 text-left transition-all {selectedCategory ===
						'agent-loop'
							? 'border-rose-400 bg-rose-950/40 shadow-lg shadow-rose-500/20'
							: 'border-rose-500/30 bg-rose-950/20 hover:border-rose-400'}"
					>
						<div class="mb-1 flex items-center justify-between font-mono font-bold text-rose-300">
							<span>5. Agent Loop</span>
							{#if selectedCategory === 'agent-loop'}<span class="text-[10px] text-rose-400"
									>Active</span
								>{/if}
						</div>
						<p class="text-[11px] leading-relaxed text-slate-300">
							The ReAct loop, deterministic surgical search-and-replace, tree-sitter AST maps, and
							Firecracker micro-VM ephemeral sandboxes.
						</p>
					</button>
				</div>
			</section>

			<!-- Interactive Controls: Filter & Search Bar Floating Dock -->
			<section
				id="timeline-section"
				class="sticky top-[76px] z-30 mb-8 [transform:translateZ(0)] scroll-mt-24 rounded-2xl border border-slate-800/90 bg-slate-950/95 p-3.5 px-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)] ring-1 ring-slate-800/60 backdrop-blur-md sm:px-5"
			>
				<!-- Timeline Year Scrubber -->
				<div class="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
					<span class="mr-1 font-mono text-xs whitespace-nowrap text-slate-400">Year:</span>
					<button
						type="button"
						onclick={() => (selectedYear = 'all')}
						class="rounded-full px-3 py-1 font-mono text-xs whitespace-nowrap transition-all {selectedYear ===
						'all'
							? 'bg-slate-100 font-bold text-slate-950 shadow-md'
							: 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'}"
					>
						All (2017–2026)
					</button>
					{#each years as y (y)}
						<button
							type="button"
							onclick={() => (selectedYear = y)}
							class="rounded-full px-3 py-1 font-mono text-xs whitespace-nowrap transition-all {selectedYear ===
							y
								? 'bg-cyan-500 font-bold text-slate-950 shadow-lg shadow-cyan-500/30'
								: 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'}"
						>
							{y}
						</button>
					{/each}
				</div>

				<!-- Category Pills & Search Input -->
				<div class="mt-2.5 flex flex-wrap items-center justify-between gap-3">
					<!-- Category Filters -->
					<div class="flex flex-wrap items-center gap-1.5">
						<button
							type="button"
							onclick={() => (selectedCategory = 'all')}
							class="rounded px-2.5 py-1 text-xs font-medium transition-colors {selectedCategory ===
							'all'
								? 'bg-slate-700 font-semibold text-white'
								: 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'}"
						>
							All Pillars ({TIMELINE_MILESTONES.length})
						</button>
						{#each categoryList as cat (cat.id)}
							{@const count = TIMELINE_MILESTONES.filter(
								(m: Milestone) => m.category === cat.id
							).length}
							<button
								type="button"
								onclick={() => (selectedCategory = cat.id)}
								class="rounded border px-2.5 py-1 text-xs font-medium transition-all {selectedCategory ===
								cat.id
									? `${cat.badgeClass} font-bold shadow-sm`
									: 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'}"
							>
								{cat.shortLabel} ({count})
							</button>
						{/each}
					</div>

					<!-- Search Input with Yaxa Kbd Shortcut Indicator -->
					<div class="relative w-full sm:w-72">
						<label for="search-input" class="sr-only">Search equations, authors, topics</label>
						<input
							id="search-input"
							type="text"
							bind:value={searchQuery}
							placeholder="Search equations, authors, topics..."
							class="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 pr-8 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
						/>
						{#if searchQuery}
							<button
								type="button"
								onclick={() => (searchQuery = '')}
								aria-label="Clear search query"
								class="absolute top-1/2 right-2.5 -translate-y-1/2 font-mono text-xs text-slate-400 hover:text-white"
							>
								✕
							</button>
						{:else}
							<div class="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2">
								<Kbd value="/" size="xs" />
							</div>
						{/if}
					</div>
				</div>
			</section>
		{/if}

		<!-- Content Rendering according to viewMode -->
		{#if viewMode === 'lab'}
			<!-- Dedicated Interactive Simulator Suite -->
			<section id="simulator-lab" class="scroll-mt-24 space-y-6">
				<div
					class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3"
				>
					<div>
						<h2 class="flex items-center gap-2 text-xl font-bold text-white">
							<span class="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400"></span>
							Interactive Mathematical Simulator Suite
						</h2>
						<p class="mt-0.5 text-xs text-slate-400">
							Direct hands-on parameter manipulation for the core equations that power autonomous
							coding agents.
						</p>
					</div>
					<div
						role="tablist"
						aria-label="Interactive Simulator Selection"
						class="flex flex-wrap gap-1 font-mono text-xs"
					>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'bitboard'}
							onclick={() => (activeLabTab = 'bitboard')}
							class="flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors {activeLabTab ===
							'bitboard'
								? 'bg-cyan-600 font-bold text-white shadow-md shadow-cyan-500/20'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							<span>▦</span>
							<span>16×16 SRAM Bitboard</span>
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'mla'}
							onclick={() => (activeLabTab = 'mla')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'mla'
								? 'bg-cyan-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							MLA KV-Cache
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'grpo'}
							onclick={() => (activeLabTab = 'grpo')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'grpo'
								? 'bg-violet-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							GRPO Advantage
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'chinchilla'}
							onclick={() => (activeLabTab = 'chinchilla')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'chinchilla'
								? 'bg-amber-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							Chinchilla
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'passk'}
							onclick={() => (activeLabTab = 'passk')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'passk'
								? 'bg-emerald-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							pass@k
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'flash'}
							onclick={() => (activeLabTab = 'flash')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'flash'
								? 'bg-emerald-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							FlashAttention
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'test-time'}
							onclick={() => (activeLabTab = 'test-time')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'test-time'
								? 'bg-amber-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							Test-Time MCTS
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'precision'}
							onclick={() => (activeLabTab = 'precision')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'precision'
								? 'bg-cyan-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							FP8/FP4 Precision
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'react'}
							onclick={() => (activeLabTab = 'react')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'react'
								? 'bg-rose-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							ReAct Loop
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'pagerank'}
							onclick={() => (activeLabTab = 'pagerank')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'pagerank'
								? 'bg-rose-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							AST PageRank
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'attention'}
							onclick={() => (activeLabTab = 'attention')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'attention'
								? 'bg-cyan-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							Attention Math
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'rope'}
							onclick={() => (activeLabTab = 'rope')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'rope'
								? 'bg-cyan-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							RoPE Geometry
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'fim'}
							onclick={() => (activeLabTab = 'fim')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'fim'
								? 'bg-violet-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							FIM Infilling
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'mtp'}
							onclick={() => (activeLabTab = 'mtp')}
							class="rounded px-2.5 py-1 transition-colors {activeLabTab === 'mtp'
								? 'bg-violet-600 font-bold text-white'
								: 'bg-slate-800 text-slate-400 hover:text-white'}"
						>
							MTP Lookahead
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={activeLabTab === 'neuro'}
							onclick={() => (activeLabTab = 'neuro')}
							class="flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors {activeLabTab ===
							'neuro'
								? 'bg-gradient-to-r from-amber-500 to-cyan-500 font-bold text-slate-950 shadow-md shadow-amber-500/20'
								: 'border border-amber-500/30 bg-slate-800 text-amber-300 hover:text-white'}"
						>
							<span>🧠</span>
							<span>Neuro-Attention & Pharmacodynamics</span>
						</button>
					</div>
				</div>

				<div class="mt-4">
					{#if activeLabTab === 'bitboard'}
						<TensorTileBitboard />
					{:else if activeLabTab === 'mla'}
						<KVLatentCalculator />
					{:else if activeLabTab === 'grpo'}
						<GRPOSimulator />
					{:else if activeLabTab === 'chinchilla'}
						<ChinchillaSimulator />
					{:else if activeLabTab === 'passk'}
						<PassKCalculator />
					{:else if activeLabTab === 'flash'}
						<FlashAttentionVisualizer />
					{:else if activeLabTab === 'test-time'}
						<TestTimeSearchSimulator />
					{:else if activeLabTab === 'precision'}
						<PrecisionExplorer />
					{:else if activeLabTab === 'react'}
						<ReActLoopSimulator />
					{:else if activeLabTab === 'pagerank'}
						<PageRankExplorer />
					{:else if activeLabTab === 'attention'}
						<AttentionExploder />
					{:else if activeLabTab === 'rope'}
						<RopeExplorer />
					{:else if activeLabTab === 'fim'}
						<FimSimulator />
					{:else if activeLabTab === 'mtp'}
						<MtpVisualizer />
					{:else if activeLabTab === 'neuro'}
						<NeuroAttentionExplorer bind:selectedDrug={selectedNeuroDrug} />
					{/if}
				</div>
			</section>
		{:else if viewMode === 'grid'}
			<!-- Matrix Grid View -->
			<section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each filteredMilestones as milestone (milestone.id)}
					<MilestoneCard {milestone} onSelect={(m: Milestone) => (activeModalMilestone = m)} />
				{/each}
			</section>
		{:else}
			<!-- Chronological Timeline Flow View with Center/Side Spine & Glowing Connectors -->
			<section class="relative">
				<!-- Timeline Vertical Spine (Central Attention Powerline Conduit) -->
				<div
					class="absolute top-4 bottom-4 left-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-amber-500 to-emerald-500 opacity-30 sm:left-1/2"
				></div>

				<!-- Photonic Pulse Stream: Power flowing continuously down the central spine -->
				<div
					class="pointer-events-none absolute top-4 bottom-4 left-4 w-1 -translate-x-1/2 overflow-hidden sm:left-1/2"
					aria-hidden="true"
				>
					<div
						class="spine-pulse-beam {isReactorSurging ? 'brightness-175 duration-700' : ''}"
					></div>
				</div>

				<div class="relative space-y-12">
					{#each filteredMilestones as milestone, idx (milestone.id)}
						{@const isEven = idx % 2 === 0}
						{@const isFirstOfYear =
							idx === 0 || filteredMilestones[idx - 1].year !== milestone.year}
						{@const attentionType = getAttentionHighlight(milestone)}

						<!-- Year Marker on Spine when year transitions -->
						{#if isFirstOfYear && selectedYear === 'all'}
							<div class="relative z-20 flex justify-center py-2">
								<div
									class="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900 px-4 py-1.5 font-mono text-xs font-bold text-cyan-300 shadow-lg"
								>
									<span class="h-2 w-2 rounded-full bg-cyan-400"></span>
									<span>{yearLabels[milestone.year] || milestone.year}</span>
								</div>
							</div>
						{/if}

						<div
							class="relative flex flex-col items-start sm:flex-row {isEven
								? 'sm:flex-row-reverse'
								: ''} gap-6"
						>
							<!-- Timeline Center Node Badge -->
							{#if attentionType === 'flash-attention'}
								<!-- Radiant FlashAttention Spine Node -->
								<div
									class="absolute top-5 left-4 z-20 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-amber-300 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 shadow-xl ring-4 shadow-amber-500/80 ring-amber-400/40 sm:left-1/2"
									title="FlashAttention Engine Breakthrough"
								>
									<span class="animate-pulse text-xs font-black text-slate-950">⚡</span>
									<div
										class="absolute -inset-1 animate-ping rounded-full border border-amber-400/60 opacity-60"
									></div>
								</div>
							{:else if attentionType === 'attention-core'}
								<!-- Radiant Attention Core Spine Node -->
								<div
									class="absolute top-5 left-4 z-20 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-cyan-300 bg-gradient-to-br from-cyan-400 via-sky-500 to-cyan-600 shadow-xl ring-4 shadow-cyan-500/80 ring-cyan-400/40 sm:left-1/2"
									title="Attention Architecture Breakthrough"
								>
									<span class="animate-pulse text-xs font-black text-slate-950">⚡</span>
									<div
										class="absolute -inset-1 animate-ping rounded-full border border-cyan-400/60 opacity-60"
									></div>
								</div>
							{:else}
								<!-- Standard Milestone Node Badge -->
								<div
									class="absolute top-6 left-4 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-cyan-400 bg-slate-950 shadow-lg shadow-cyan-500/50 sm:left-1/2"
								>
									<div class="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></div>
								</div>
							{/if}

							<!-- Horizontal Connector Stem (Desktop only) -->
							<div
								class="absolute top-9 hidden h-0.5 -translate-y-1/2 sm:block {attentionType ===
								'flash-attention'
									? isEven
										? 'left-[calc(50%-2rem)] w-8 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 shadow-sm shadow-amber-400'
										: 'left-1/2 w-8 bg-gradient-to-r from-amber-500 via-amber-400 to-transparent shadow-sm shadow-amber-400'
									: attentionType === 'attention-core'
										? isEven
											? 'left-[calc(50%-2rem)] w-8 bg-gradient-to-r from-transparent via-cyan-400 to-cyan-500 shadow-sm shadow-cyan-400'
											: 'left-1/2 w-8 bg-gradient-to-r from-cyan-500 via-cyan-400 to-transparent shadow-sm shadow-cyan-400'
										: isEven
											? 'left-[calc(50%-2rem)] w-8 bg-gradient-to-r from-transparent to-cyan-500/70'
											: 'left-1/2 w-8 bg-gradient-to-r from-cyan-500/70 to-transparent'}"
							></div>

							<!-- Horizontal Connector Stem (Mobile only) -->
							<div
								class="absolute top-9 left-4 h-0.5 w-6 -translate-y-1/2 sm:hidden {attentionType ===
								'flash-attention'
									? 'bg-amber-400 shadow-sm shadow-amber-400'
									: attentionType === 'attention-core'
										? 'bg-cyan-400 shadow-sm shadow-cyan-400'
										: 'bg-cyan-500/50'}"
							></div>

							<!-- Milestone Card Container -->
							<div class="ml-10 w-full sm:ml-0 sm:w-[calc(50%-2rem)]">
								<MilestoneCard
									{milestone}
									onSelect={(m: Milestone) => (activeModalMilestone = m)}
								/>
							</div>

							<!-- Empty spacer for alternating layout on desktop -->
							<div class="hidden sm:block sm:w-[calc(50%-2rem)]"></div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if filteredMilestones.length === 0}
			<div class="py-16 text-center font-mono text-sm text-slate-400">
				No breakthroughs found matching your filter criteria. Try clearing search or selecting
				"All".
			</div>
		{/if}
	</main>

	<!-- Deep Dive Modal -->
	<MilestoneModal milestone={activeModalMilestone} onClose={() => (activeModalMilestone = null)} />

	<!-- Footer with Academic References -->
	<footer class="mt-16 border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-400">
		<div class="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
			<div
				class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6"
			>
				<div>
					<div class="text-sm font-bold text-slate-200">
						Autonomous LLM Coding Agents Archive (2017–2026)
					</div>
					<div class="mt-0.5 font-mono text-[11px] text-slate-500">
						Chronology of architectural, empirical, hardware, alignment, and control breakthroughs.
					</div>
				</div>
				<div class="font-mono text-xs text-slate-500">Built with Svelte 5 & KaTeX</div>
			</div>

			<!-- Literature Bibliography References -->
			<div class="grid grid-cols-1 gap-4 font-mono text-[11px] md:grid-cols-2 lg:grid-cols-4">
				<div>
					<div class="mb-1 font-bold text-slate-300">Architecture</div>
					<ul class="space-y-1 text-slate-500">
						<li>• Vaswani et al. (2017) <em>Attention Is All You Need</em></li>
						<li>• Su et al. (2021) <em>RoFormer: RoPE</em></li>
						<li>• DeepSeek (2024) <em>MLA: Multi-Head Latent Attn</em></li>
						<li>• Gloeckle et al. (2024) <em>Multi-Token Prediction</em></li>
					</ul>
				</div>
				<div>
					<div class="mb-1 font-bold text-slate-300">Hardware & Kernels</div>
					<ul class="space-y-1 text-slate-500">
						<li>• Dao et al. (2022) <em>FlashAttention-1</em></li>
						<li>• Dao (2023) <em>FlashAttention-2</em></li>
						<li>• NVIDIA (2024) <em>TensorRT-LLM & FP8</em></li>
						<li>• NVIDIA (2025–2026) <em>Blackwell NVFP4 Microscaling</em></li>
					</ul>
				</div>
				<div>
					<div class="mb-1 font-bold text-slate-300">Empirical Scaling</div>
					<ul class="space-y-1 text-slate-500">
						<li>• Hoffmann et al. (2022) <em>Chinchilla Optimal</em></li>
						<li>• OpenAI (2024) <em>o1/o3 Test-Time Search Scaling</em></li>
						<li>• Lightman et al. (2023) <em>Process Reward Models</em></li>
					</ul>
				</div>
				<div>
					<div class="mb-1 font-bold text-slate-300">Training & Control</div>
					<ul class="space-y-1 text-slate-500">
						<li>• Chen et al. (2021) <em>Codex & pass@k</em></li>
						<li>• Bavarian et al. (2022) <em>Fill-in-the-Middle (FIM)</em></li>
						<li>• Yao et al. (2022) <em>ReAct: Reasoning & Acting</em></li>
						<li>• DeepSeek (2024–2025) <em>DeepSeek-R1 & GRPO</em></li>
					</ul>
				</div>
			</div>
		</div>
	</footer>
</div>

<script lang="ts">
	import { smoothSlide } from 'yaxa-svelte';
	import KatexMath from '../KatexMath.svelte';
	import TensorTileBitboard from '../interactive/TensorTileBitboard.svelte';
	import { ATTENTION_BOTTLENECKS } from '../../data/progressiveArchitecture';
	import type { LabTabId } from '../views/SimulatorLabSuite.svelte';

	let {
		selectedYear = $bindable('all'),
		isReactorSurging = $bindable(false),
		onOpenSimulator,
		onJumpToConferenceYear
	}: {
		selectedYear: number | 'all';
		isReactorSurging: boolean;
		onOpenSimulator: (labId: LabTabId) => void;
		onJumpToConferenceYear: (year: number) => void;
	} = $props();

	let heroDieView = $state<'formula' | 'bitboard'>('formula');
	let copiedHeroLatex = $state(false);
	let surgeTimeout: ReturnType<typeof setTimeout> | null = null;

	// Progressive Architecture Disclosure State
	let bottleneckViewMode = $state<'progressive' | 'telemetry'>('progressive');
	let expandedBottleneckId = $state<'context' | 'io' | 'compute' | 'kv-cache' | null>(null);

	const attentionHeroFormula =
		'\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V';

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

	function triggerReactorSurge() {
		if (surgeTimeout) clearTimeout(surgeTimeout);
		isReactorSurging = true;
		surgeTimeout = setTimeout(() => {
			isReactorSurging = false;
		}, 2200);
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
</script>

<section class="relative mx-auto mb-12 max-w-5xl text-center">
	<!-- Silicon Die Backplane & Radial Photonic Core Glow -->
	<div
		class="pointer-events-none absolute -top-16 left-1/2 -z-10 h-125 w-full max-w-4xl -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.14)_0%,rgba(245,158,11,0.06)_45%,transparent_75%)] blur-3xl"
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
					onclick={() => onJumpToConferenceYear(chip.year)}
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
		class="text-3xl font-black tracking-tight text-white uppercase sm:text-5xl sm:leading-none md:text-6xl lg:text-7xl"
	>
		The Architecture of <br class="hidden sm:inline" />
		<span
			class="bg-linear-to-r from-cyan-400 via-amber-300 to-violet-400 bg-clip-text text-transparent"
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
			class="pointer-events-none absolute -inset-20 rounded-full bg-linear-to-r from-cyan-500/8 via-amber-500/8 to-transparent blur-3xl transition-opacity duration-500 {isReactorSurging
				? 'opacity-100'
				: 'opacity-30'}"
			aria-hidden="true"
		></div>

		<!-- 1. Top Substrate Telemetry Header -->
		<div
			class="relative z-10 flex flex-col justify-between gap-2.5 border-b border-slate-800/80 bg-slate-900/60 p-3 font-mono text-[11px] sm:flex-row sm:items-center sm:px-4 sm:py-2.5"
		>
			<div class="flex flex-wrap items-center justify-between gap-2 sm:justify-start">
				<div class="flex items-center gap-2">
					<span
						class="flex h-2 w-2 shrink-0 rounded-full {isReactorSurging
							? 'animate-ping bg-amber-400'
							: 'animate-pulse bg-cyan-400'}"
					></span>
					<span class="text-[10px] font-bold tracking-wider text-slate-200 uppercase sm:text-xs">
						NOC-DIE // CANONICAL ATTENTION OPERATOR
					</span>
				</div>
				<span
					class="rounded border border-cyan-800/60 bg-cyan-950/70 px-2 py-0.5 font-mono text-[9px] text-cyan-300 sm:text-[10px]"
				>
					{isReactorSurging
						? '⚡ DISPATCHING: WARP GEMM + ASYNC SRAM TILING'
						: 'ROOFLINE INTENSITY: O(N) IO · O(N²) FLOP'}
				</span>
			</div>

			<div class="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
				<!-- TeX vs Bit-Tile Mode Toggle -->
				<div
					class="flex items-center rounded border border-slate-700/80 bg-slate-800/80 p-0.5 font-mono text-[10px]"
				>
					<button
						type="button"
						onclick={() => (heroDieView = 'formula')}
						class="cursor-pointer rounded px-2 py-0.5 transition-colors {heroDieView === 'formula'
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

				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={triggerReactorSurge}
						class="cursor-pointer rounded border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase transition-all duration-300 sm:px-2.5 {isReactorSurging
							? 'animate-pulse border-amber-400 bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40'
							: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white'}"
						title="Simulate Tensor Core Forward Pass Dispatch"
					>
						{isReactorSurging ? '⚡ DISPATCHING...' : 'BENCHMARK DISPATCH ⚡'}
					</button>
					<button
						type="button"
						onclick={copyHeroLatex}
						class="cursor-pointer rounded border border-slate-700/80 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-300 transition-colors hover:border-cyan-400 hover:bg-slate-700 hover:text-cyan-200"
						title="Copy Canonical LaTeX Formula"
					>
						{copiedHeroLatex ? 'Copied!' : 'Copy TeX'}
					</button>
				</div>
			</div>
		</div>

		<!-- 2. Formal Operator Specification Core -->
		<div class="relative z-10 p-3 sm:px-5 sm:pt-5 sm:pb-4">
			{#if heroDieView === 'formula'}
				<!-- Mathematical Formula with responsive scaling & smooth overflow scrolling -->
				<div class="hero-operator-math w-full overflow-x-auto py-2 text-center">
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
				class="mt-2 flex flex-col justify-between gap-1.5 border-t border-slate-800/60 pt-2 font-mono text-[10px] sm:flex-row sm:items-center sm:text-[11px]"
			>
				<div class="flex items-center gap-2 text-slate-400">
					<span class="inline-flex items-center gap-1.5 text-cyan-400">
						<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400"></span>
						<span>IO-aware asynchronous SRAM tiling & online softmax (Tri Dao et al.)</span>
					</span>
				</div>
				<button
					type="button"
					onclick={() => onOpenSimulator('bitboard')}
					class="cursor-pointer text-left font-semibold text-cyan-400 underline decoration-cyan-500/40 hover:text-cyan-200 sm:text-right"
				>
					Inspect Full Bitboard in Simulator Lab →
				</button>
			</div>
		</div>

		<!-- 3. Embedded High-Speed On-Chip Crossbar (NoC / NVLink Fabric) -->
		<div class="relative z-10 border-t border-b border-slate-800/80 bg-slate-950/70 py-1.5">
			<!-- Crossbar Telemetry Rail -->
			<div
				class="flex flex-col justify-between gap-1 px-3 pb-1 font-mono text-[9px] tracking-wider text-slate-500 uppercase sm:flex-row sm:items-center sm:px-4"
			>
				<div class="flex items-center gap-1.5 truncate text-slate-400">
					<span class="h-1 w-1 shrink-0 rounded-full bg-cyan-400"></span>
					<span class="truncate">HIGH-SPEED ON-CHIP CROSSBAR // 128-BIT ASYNC INTERCONNECT</span>
				</div>
				<span class="text-slate-400/80 sm:text-right">3.2 TB/S HBM3e ⟷ 256 KB L1/SRAM PER SM</span>
			</div>

			<!-- Silicon Bus Transmission Channels (Directly feeding into the 4 Functional Blocks) -->
			<div class="grid grid-cols-2 divide-x divide-slate-800/50 sm:grid-cols-4">
				<!-- Bus Channel 0 (Cyan - Context) -->
				<div class="flex items-center justify-between bg-cyan-950/15 px-3 py-1">
					<span class="font-mono text-[9px] font-semibold text-cyan-400/90">BUS_0: TMA_CTX</span>
					<span
						class="flex h-1.5 w-1.5 rounded-full {isReactorSurging
							? 'animate-ping bg-cyan-400'
							: 'bg-cyan-500/70'}"
					></span>
				</div>
				<!-- Bus Channel 1 (Amber - SRAM Tiling) -->
				<div class="flex items-center justify-between bg-amber-950/15 px-3 py-1">
					<span class="font-mono text-[9px] font-semibold text-amber-400/90">BUS_1: SRAM_TILE</span>
					<span
						class="flex h-1.5 w-1.5 rounded-full {isReactorSurging
							? 'animate-ping bg-amber-400'
							: 'bg-amber-500/70'}"
					></span>
				</div>
				<!-- Bus Channel 2 (Emerald - Tensor ALU) -->
				<div class="flex items-center justify-between bg-emerald-950/15 px-3 py-1">
					<span class="font-mono text-[9px] font-semibold text-emerald-400/90">BUS_2: WARP_ALU</span
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
					class="h-full w-full bg-linear-to-r from-cyan-500 via-amber-400 to-violet-500 {isReactorSurging
						? 'animate-pulse opacity-100 duration-300'
						: 'opacity-40'}"
				></div>
			</div>
		</div>

		<!-- 4. Lower Die Substrate: The 4 Physical Attention Bottlenecks (Progressive Evolution) -->
		<div class="relative z-10 border-t border-slate-800/80 bg-slate-950/90">
			<!-- Progressive Explanation Control Bar -->
			<div
				class="flex flex-col justify-between gap-2 px-3.5 py-2.5 font-mono text-[11px] sm:flex-row sm:items-center sm:px-5"
			>
				<div class="flex items-center gap-2">
					<span class="h-2 w-2 rounded-full bg-cyan-400"></span>
					<span class="font-bold tracking-wider text-slate-200 uppercase">
						The 4 Physical Attention Bottlenecks
					</span>
					<span class="hidden text-slate-500 md:inline"
						>// 2017 Memory Wall ➔ 2026 Autonomous SEA</span
					>
				</div>

				<!-- Toggle between Progressive Breakdown and Silicon Telemetry -->
				<div class="flex items-center gap-2">
					<span class="text-[10px] text-slate-400">Mode:</span>
					<div
						class="flex items-center rounded border border-slate-800 bg-slate-900/90 p-0.5 text-[10px]"
					>
						<button
							type="button"
							onclick={() => (bottleneckViewMode = 'progressive')}
							class="cursor-pointer rounded px-2.5 py-0.5 transition-colors {bottleneckViewMode ===
							'progressive'
								? 'bg-cyan-600 font-bold text-white shadow-sm'
								: 'text-slate-400 hover:text-slate-200'}"
						>
							Progressive Evolution
						</button>
						<button
							type="button"
							onclick={() => (bottleneckViewMode = 'telemetry')}
							class="cursor-pointer rounded px-2.5 py-0.5 transition-colors {bottleneckViewMode ===
							'telemetry'
								? 'bg-cyan-600 font-bold text-white shadow-sm'
								: 'text-slate-400 hover:text-slate-200'}"
						>
							Silicon Telemetry
						</button>
					</div>
				</div>
			</div>

			<!-- The 4 Execution Bottleneck Cards -->
			<div
				class="grid grid-cols-1 divide-y divide-slate-800/80 bg-slate-900/40 text-left sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4"
			>
				{#each ATTENTION_BOTTLENECKS as b (b.id)}
					{@const isExpanded = expandedBottleneckId === b.id}
					{@const dotBg =
						b.color === 'cyan'
							? 'bg-cyan-400'
							: b.color === 'amber'
								? 'bg-amber-400'
								: b.color === 'emerald'
									? 'bg-emerald-400'
									: 'bg-violet-400'}
					{@const titleColor =
						b.color === 'cyan'
							? 'text-cyan-400'
							: b.color === 'amber'
								? 'text-amber-400'
								: b.color === 'emerald'
									? 'text-emerald-400'
									: 'text-violet-400'}

					<div
						class="flex flex-col justify-between p-4 transition-all duration-300 {isExpanded
							? 'bg-slate-900/90 ring-1 ring-cyan-500/30'
							: 'hover:bg-slate-900/70'} {isReactorSurging ? 'bg-slate-950/30' : ''}"
					>
						<div>
							<div class="flex items-center justify-between">
								<span class="font-mono text-[10px] font-bold tracking-wider uppercase {titleColor}">
									{b.title}
								</span>
								<span class="h-1.5 w-1.5 rounded-full {dotBg}"></span>
							</div>

							<div class="mt-1 flex flex-wrap items-baseline gap-2">
								<div class="font-mono text-2xl font-black text-white">{b.stat2026}</div>
								<span class="font-mono text-[10px] text-slate-500">vs {b.stat2017}</span>
							</div>

							{#if bottleneckViewMode === 'progressive'}
								<!-- Progressive Problem -> Solution -> Agent Impact -->
								<div class="mt-2.5 space-y-1.5 text-[11px] leading-snug">
									<div class="text-slate-400">
										<span class="font-semibold text-rose-400/90">2017 Bottleneck:</span>
										{b.bottleneck2017}
									</div>
									<div class="text-slate-300">
										<span class="font-semibold text-emerald-400/90">Breakthrough:</span>
										{b.breakthrough}
									</div>
									<div class="text-cyan-200/90">
										<span class="font-semibold text-cyan-300">Agent Impact:</span>
										{b.seaImpact}
									</div>
								</div>
							{:else}
								<!-- Compact Silicon Telemetry Specs -->
								<div class="mt-2 text-[11px] leading-snug text-slate-400">
									{b.seaImpact}
								</div>
								<div class="mt-2.5 font-mono text-[9px] tracking-wider text-slate-500 uppercase">
									{b.technologies.join(' · ')}
								</div>
							{/if}
						</div>

						<!-- Card Bottom Actions & Inspector Toggle -->
						<div
							class="mt-3 flex items-center justify-between border-t border-slate-800/70 pt-2 font-mono text-[10px]"
						>
							<button
								type="button"
								onclick={() => (expandedBottleneckId = isExpanded ? null : b.id)}
								class="cursor-pointer text-slate-400 transition-colors hover:text-cyan-300"
							>
								{isExpanded ? '▲ Hide Physics' : '▼ Deep Dive'}
							</button>
							<button
								type="button"
								onclick={() => onOpenSimulator(b.labSimulatorId)}
								class="cursor-pointer font-semibold {titleColor} hover:underline"
							>
								Simulator ⚡
							</button>
						</div>
					</div>
				{/each}
			</div>

			<!-- Expandable Physics & Silicon Deep Dive Drawer -->
			{#if expandedBottleneckId}
				{@const activeB = ATTENTION_BOTTLENECKS.find((b) => b.id === expandedBottleneckId)}
				{#if activeB}
					<div
						transition:smoothSlide={{ duration: 250 }}
						class="border-t border-slate-800/90 bg-slate-950/95 p-4 font-mono text-xs sm:p-5"
					>
						<div
							class="flex flex-col justify-between gap-2 border-b border-slate-800 pb-2 sm:flex-row sm:items-center"
						>
							<div class="flex items-center gap-2">
								<span class="font-bold tracking-wider text-slate-200 uppercase">
									Micro-Architectural Deep Dive: {activeB.title}
								</span>
								<span class="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-300">
									{activeB.channel}
								</span>
							</div>
							<button
								type="button"
								onclick={() => (expandedBottleneckId = null)}
								class="cursor-pointer text-[11px] text-slate-400 hover:text-white"
							>
								✕ Close
							</button>
						</div>

						<p class="mt-2.5 font-sans text-[11px] leading-relaxed text-slate-300">
							{activeB.deepDive}
						</p>

						<div
							class="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-2.5"
						>
							<div class="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
								<span class="text-slate-500 uppercase">Core Enablers:</span>
								{#each activeB.technologies as tech (tech)}
									<span
										class="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-slate-300"
									>
										{tech}
									</span>
								{/each}
							</div>
							<button
								type="button"
								onclick={() => onOpenSimulator(activeB.labSimulatorId)}
								class="cursor-pointer rounded bg-cyan-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-cyan-500"
							>
								Launch {activeB.labSimulatorName} in Lab →
							</button>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</section>

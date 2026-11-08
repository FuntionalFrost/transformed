<script lang="ts">
	import type { Milestone } from '../types';
	import { CATEGORIES, getAttentionHighlight } from '../data/timeline';
	import KatexMath from './KatexMath.svelte';
	import KVLatentCalculator from './interactive/KVLatentCalculator.svelte';
	import GRPOSimulator from './interactive/GRPOSimulator.svelte';
	import ChinchillaSimulator from './interactive/ChinchillaSimulator.svelte';
	import PassKCalculator from './interactive/PassKCalculator.svelte';
	import PrecisionExplorer from './interactive/PrecisionExplorer.svelte';
	import ReActLoopSimulator from './interactive/ReActLoopSimulator.svelte';
	import PageRankExplorer from './interactive/PageRankExplorer.svelte';
	import AttentionExploder from './interactive/AttentionExploder.svelte';
	import FlashAttentionVisualizer from './interactive/FlashAttentionVisualizer.svelte';
	import TestTimeSearchSimulator from './interactive/TestTimeSearchSimulator.svelte';
	import NeuroAttentionExplorer from './interactive/NeuroAttentionExplorer.svelte';
	import RopeExplorer from './interactive/RopeExplorer.svelte';
	import FimSimulator from './interactive/FimSimulator.svelte';
	import MtpVisualizer from './interactive/MtpVisualizer.svelte';

	interface Props {
		milestone: Milestone;
		onSelect: (m: Milestone) => void;
	}

	let { milestone, onSelect }: Props = $props();

	let category = $derived(CATEGORIES[milestone.category]);
	let attentionType = $derived(getAttentionHighlight(milestone));
	let showInlineSimulator = $state(false);
	let copiedEquation = $state(false);

	async function copyEquationLatex(e: MouseEvent) {
		e.stopPropagation();
		if (!milestone.equations || milestone.equations.length === 0) return;
		try {
			await navigator.clipboard.writeText(milestone.equations[0].latex);
			copiedEquation = true;
			setTimeout(() => {
				copiedEquation = false;
			}, 1800);
		} catch (err) {
			console.error('Failed to copy LaTeX', err);
		}
	}
</script>

<div
	class="group tensor-bracket milestone-card milestone-card-contain relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-300 hover:shadow-2xl {attentionType ===
	'flash-attention'
		? 'border-amber-400/80 bg-gradient-to-b from-slate-900/95 via-amber-950/20 to-slate-900/95 shadow-[0_0_35px_rgba(245,158,11,0.22)] ring-1 ring-amber-400/40'
		: attentionType === 'attention-core'
			? 'border-cyan-400/80 bg-gradient-to-b from-slate-900/95 via-cyan-950/20 to-slate-900/95 shadow-[0_0_35px_rgba(6,182,212,0.22)] ring-1 ring-cyan-400/40'
			: `bg-slate-900/85 hover:bg-slate-900/95 ${category.borderClass} ${category.glowClass}`}"
>
	<!-- Card Header -->
	<div>
		{#if attentionType === 'flash-attention'}
			<!-- FlashAttention Standout Pillar Pill -->
			<div class="mb-3 flex items-center justify-between gap-2">
				<span
					class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/70 bg-amber-500/15 px-3 py-1 font-mono text-[10px] font-black tracking-wider text-amber-300 uppercase shadow-md shadow-amber-500/20"
				>
					<span class="h-2 w-2 animate-ping rounded-full bg-amber-400"></span>
					<span>⚡ FLASHATTENTION ENGINE</span>
				</span>
				<span class="font-mono text-[10px] font-bold text-amber-400">Peak IO-Aware Silicon</span>
			</div>
		{:else if attentionType === 'attention-core'}
			<!-- Core Attention Standout Pillar Pill -->
			<div class="mb-3 flex items-center justify-between gap-2">
				<span
					class="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/70 bg-cyan-500/15 px-3 py-1 font-mono text-[10px] font-black tracking-wider text-cyan-300 uppercase shadow-md shadow-cyan-500/20"
				>
					<span class="h-2 w-2 animate-ping rounded-full bg-cyan-400"></span>
					<span>⚡ ATTENTION ARCHITECTURE</span>
				</span>
				<span class="font-mono text-[10px] font-bold text-cyan-400">Foundation Context</span>
			</div>
		{/if}

		<div class="mb-3 flex items-center justify-between gap-2">
			<span
				class="rounded-md border border-slate-700/60 bg-slate-800 px-2.5 py-1 font-mono text-xs font-bold text-slate-200 shadow-sm"
			>
				{milestone.period}
			</span>
			<span
				class="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase {category.badgeClass}"
			>
				{category.shortLabel}
			</span>
		</div>

		<h3
			class="text-base leading-snug font-bold text-slate-100 transition-colors {attentionType ===
			'flash-attention'
				? 'text-amber-200 group-hover:text-amber-300'
				: attentionType === 'attention-core'
					? 'text-cyan-200 group-hover:text-cyan-300'
					: 'group-hover:text-cyan-300'}"
		>
			{milestone.title}
		</h3>
		<p class="mt-1 text-xs leading-relaxed text-slate-400">
			{milestone.subtitle}
		</p>
		<p class="mt-1.5 font-mono text-[11px] text-slate-500">
			{milestone.authors}
		</p>

		<!-- Primary Key Equation Preview (Prominently Elevated for Attention / FlashAttention) -->
		{#if milestone.equations && milestone.equations.length > 0}
			<div
				class="relative my-3 overflow-hidden rounded-xl p-3 transition-all {attentionType ===
				'flash-attention'
					? 'border-2 border-amber-400/80 bg-gradient-to-r from-slate-950 via-amber-950/35 to-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
					: attentionType === 'attention-core'
						? 'border-2 border-cyan-400/80 bg-gradient-to-r from-slate-950 via-cyan-950/35 to-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
						: 'attention-grid border border-slate-800/80 bg-slate-950/85 group-hover:border-slate-700/80'}"
			>
				<!-- Equation Header Bar: Label + Dedicated TeX Copy Button (Never overlaps math) -->
				<div
					class="mb-2 flex items-center justify-between border-b pb-1.5 font-mono text-[10px] tracking-wider uppercase {attentionType ===
					'flash-attention'
						? 'border-amber-500/30 text-amber-300'
						: attentionType === 'attention-core'
							? 'border-cyan-500/30 text-cyan-300'
							: 'border-slate-800/80 text-slate-400'}"
				>
					<div class="flex min-w-0 items-center gap-1.5 pr-2">
						<span class={attentionType === 'flash-attention' ? 'text-amber-400' : 'text-cyan-400'}>
							{attentionType ? '⚡' : '∑'}
						</span>
						<span class="truncate font-semibold text-slate-300">
							{attentionType === 'flash-attention'
								? 'FLASHATTENTION CORE'
								: attentionType === 'attention-core'
									? 'CANONICAL ATTENTION'
									: milestone.equations[0].label}
						</span>
					</div>
					<button
						type="button"
						onclick={copyEquationLatex}
						class="shrink-0 rounded border border-slate-700/80 bg-slate-800/90 px-2 py-0.5 font-mono text-[9px] font-semibold text-slate-300 transition-all hover:border-cyan-400 hover:bg-slate-700 hover:text-cyan-200"
						title="Copy LaTeX equation source"
					>
						{copiedEquation ? 'Copied!' : 'TeX'}
					</button>
				</div>

				<!-- Equation Display Area: Full Width with Safe Horizontal Scroll -->
				<div
					class="w-full max-w-full [scrollbar-width:thin] overflow-x-auto overflow-y-hidden py-1 text-center"
				>
					<KatexMath latex={milestone.equations[0].latex} displayMode={true} copyable={false} />
				</div>
			</div>
		{/if}

		<!-- Architectural Shift Preview -->
		<div
			class="mt-3 space-y-1 rounded-lg border border-slate-800/60 bg-slate-950/40 p-2.5 font-mono text-[11px]"
		>
			<div class="flex items-start gap-1.5 text-rose-400/90">
				<span class="shrink-0 font-bold">From:</span>
				<span class="line-clamp-1 text-slate-400">{milestone.architecturalShift.from}</span>
			</div>
			<div class="flex items-start gap-1.5 text-emerald-400">
				<span class="shrink-0 font-bold">To:</span>
				<span class="line-clamp-1 text-slate-200">{milestone.architecturalShift.to}</span>
			</div>
		</div>

		<!-- Metrics Chips -->
		{#if milestone.metrics && milestone.metrics.length > 0}
			<div class="mt-3 flex flex-wrap gap-1.5">
				{#each milestone.metrics as m (m.label)}
					<div
						class="rounded border border-slate-700/50 bg-slate-800/60 px-2 py-0.5 font-mono text-[10px] text-slate-300"
					>
						<span class="text-slate-500">{m.label}:</span>
						<span class="ml-1 font-bold text-slate-100">{m.value}</span>
						{#if m.delta}
							<span class="ml-1 text-emerald-400">({m.delta})</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Inline Simulator (Collapsible) -->
		{#if showInlineSimulator && milestone.interactiveToolId}
			<div class="mt-4 border-t border-slate-800 pt-3">
				{#if milestone.interactiveToolId === 'mla'}
					<KVLatentCalculator />
				{:else if milestone.interactiveToolId === 'chinchilla'}
					<ChinchillaSimulator />
				{:else if milestone.interactiveToolId === 'passk'}
					<PassKCalculator />
				{:else if milestone.interactiveToolId === 'grpo'}
					<GRPOSimulator />
				{:else if milestone.interactiveToolId === 'react'}
					<ReActLoopSimulator />
				{:else if milestone.interactiveToolId === 'precision'}
					<PrecisionExplorer />
				{:else if milestone.interactiveToolId === 'pagerank'}
					<PageRankExplorer />
				{:else if milestone.interactiveToolId === 'attention'}
					<AttentionExploder />
				{:else if milestone.interactiveToolId === 'flash'}
					<FlashAttentionVisualizer />
				{:else if milestone.interactiveToolId === 'test-time'}
					<TestTimeSearchSimulator />
				{:else if milestone.interactiveToolId === 'neuro'}
					<NeuroAttentionExplorer />
				{:else if milestone.interactiveToolId === 'rope'}
					<RopeExplorer />
				{:else if milestone.interactiveToolId === 'fim'}
					<FimSimulator />
				{:else if milestone.interactiveToolId === 'mtp'}
					<MtpVisualizer />
				{/if}
			</div>
		{/if}
	</div>

	<!-- Card Footer -->
	<div class="mt-5 flex items-center justify-between gap-2 border-t border-slate-800/60 pt-3">
		<div>
			{#if milestone.interactiveToolId}
				<button
					type="button"
					onclick={() => (showInlineSimulator = !showInlineSimulator)}
					class="inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[10px] transition-colors {showInlineSimulator
						? 'border border-cyan-500/50 bg-cyan-500/20 font-bold text-cyan-300'
						: 'border border-slate-700/60 bg-slate-800 text-slate-400 hover:text-cyan-300'}"
				>
					<span
						class="h-1.5 w-1.5 rounded-full bg-cyan-400 {showInlineSimulator
							? 'animate-none'
							: 'animate-pulse'}"
					></span>
					{showInlineSimulator ? 'Hide Simulator' : 'Live Sandbox'}
				</button>
			{/if}
		</div>

		<button
			type="button"
			onclick={() => onSelect(milestone)}
			class="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
		>
			<span>Deep Dive</span>
			<span class="text-cyan-400">→</span>
		</button>
	</div>
</div>

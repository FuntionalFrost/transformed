<script lang="ts">
	import type { Milestone } from '../types';
	import { CATEGORIES } from '../data/timeline';
	import KatexMath from './KatexMath.svelte';
	import KVLatentCalculator from './interactive/KVLatentCalculator.svelte';
	import ChinchillaSimulator from './interactive/ChinchillaSimulator.svelte';
	import PassKCalculator from './interactive/PassKCalculator.svelte';
	import GRPOSimulator from './interactive/GRPOSimulator.svelte';
	import ReActLoopSimulator from './interactive/ReActLoopSimulator.svelte';
	import PrecisionExplorer from './interactive/PrecisionExplorer.svelte';
	import PageRankExplorer from './interactive/PageRankExplorer.svelte';
	import AttentionExploder from './interactive/AttentionExploder.svelte';
	import FlashAttentionVisualizer from './interactive/FlashAttentionVisualizer.svelte';
	import TestTimeSearchSimulator from './interactive/TestTimeSearchSimulator.svelte';
	import NeuroAttentionExplorer from './interactive/NeuroAttentionExplorer.svelte';
	import RopeExplorer from './interactive/RopeExplorer.svelte';
	import FimSimulator from './interactive/FimSimulator.svelte';
	import MtpVisualizer from './interactive/MtpVisualizer.svelte';

	interface Props {
		milestone: Milestone | null;
		onClose: () => void;
	}

	let { milestone, onClose }: Props = $props();

	let copiedModalEq = $state<string | null>(null);

	let category = $derived(milestone ? CATEGORIES[milestone.category] : null);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if milestone && category}
	<!-- Modal Container with fixed overlay -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-md sm:p-6"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-milestone-title"
	>
		<!-- Invisible overlay button to dismiss on outside click -->
		<button
			type="button"
			class="fixed inset-0 -z-10 h-full w-full cursor-default bg-transparent"
			onclick={onClose}
			aria-label="Dismiss modal"
			tabindex="-1"
		></button>

		<!-- Modal Content Container -->
		<div
			class="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border bg-slate-900 p-6 text-slate-100 shadow-2xl sm:p-8 {category.borderClass} {category.glowClass}"
		>
			<!-- Close Button -->
			<button
				type="button"
				onclick={onClose}
				class="absolute top-5 right-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-mono text-sm text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
				aria-label="Close Modal"
			>
				✕
			</button>

			<!-- Header -->
			<div class="border-b border-slate-800 pb-5">
				<div class="mb-2 flex flex-wrap items-center gap-2">
					<span
						class="rounded border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-xs font-bold text-slate-200"
					>
						{milestone.period}
					</span>
					<span
						class="rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wider uppercase {category.badgeClass}"
					>
						{category.label}
					</span>
					{#if milestone.paperRef}
						<span
							class="rounded border border-slate-800 bg-slate-950/60 px-2.5 py-0.5 font-mono text-xs text-slate-400"
						>
							{milestone.paperRef}
						</span>
					{/if}
				</div>

				<h2
					id="modal-milestone-title"
					class="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
				>
					{milestone.title}
				</h2>
				<p class="mt-1 text-sm font-medium text-cyan-300">
					{milestone.subtitle}
				</p>
				<p class="mt-2 font-mono text-xs text-slate-400">
					Authored by: <span class="text-slate-300">{milestone.authors}</span>
					{#if milestone.paperTitle}
						<span class="ml-1 text-slate-500">· "{milestone.paperTitle}"</span>
					{/if}
				</p>
			</div>

			<!-- Executive Summary -->
			<div
				class="mt-5 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-300"
			>
				{milestone.summary}
			</div>

			<!-- Interactive Tool Mount (if available) -->
			{#if milestone.interactiveToolId}
				<div class="mt-6">
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

			<!-- Mathematical Formulations -->
			<div class="mt-8 space-y-6">
				<h3
					class="flex items-center gap-2 text-base font-bold tracking-wider text-slate-200 uppercase"
				>
					<span class="h-2 w-2 rounded-full bg-cyan-400"></span>
					Mathematical Formulations & Equations
				</h3>

				{#each milestone.equations as eq (eq.label)}
					<div class="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
						<div class="mb-2 flex items-center justify-between font-mono text-xs">
							<span class="font-semibold text-cyan-400">{eq.label}</span>
							<button
								type="button"
								onclick={async () => {
									try {
										await navigator.clipboard.writeText(eq.latex);
										copiedModalEq = eq.label;
										setTimeout(() => {
											copiedModalEq = null;
										}, 1800);
									} catch (err) {
										console.error('Failed to copy LaTeX', err);
									}
								}}
								class="rounded border border-slate-700/80 bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-slate-300 transition-colors hover:border-cyan-400 hover:bg-slate-700 hover:text-cyan-200"
								title="Copy LaTeX formula"
							>
								{copiedModalEq === eq.label ? 'Copied!' : 'TeX'}
							</button>
						</div>
						<div class="my-2 overflow-x-auto border-y border-slate-800/50 py-2 text-center">
							<KatexMath latex={eq.latex} displayMode={true} copyable={false} />
						</div>

						{#if eq.terms && eq.terms.length > 0}
							<div class="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
								{#each eq.terms as t (t.symbol)}
									<div class="rounded border border-slate-800/70 bg-slate-900/60 p-2">
										<div
											class="mb-0.5 flex items-center gap-1.5 font-mono font-semibold text-cyan-300"
										>
											<KatexMath latex={t.symbol} />
											<span class="text-slate-400">—</span>
											<span>{t.name}</span>
										</div>
										<p class="text-[11px] leading-normal text-slate-400">
											{t.explanation}
										</p>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Architectural Paradigm Shift -->
			<div class="mt-8">
				<h3
					class="mb-3 flex items-center gap-2 text-base font-bold tracking-wider text-slate-200 uppercase"
				>
					<span class="h-2 w-2 rounded-full bg-emerald-400"></span>
					Architectural Paradigm Shift
				</h3>
				<div class="grid grid-cols-1 gap-4 font-mono text-xs md:grid-cols-2">
					<div class="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4">
						<div class="mb-1 text-[10px] font-bold tracking-wider text-rose-400 uppercase">
							Previous Paradigm:
						</div>
						<p class="font-sans leading-relaxed text-slate-300">
							{milestone.architecturalShift.from}
						</p>
					</div>
					<div class="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
						<div class="mb-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
							Breakthrough Paradigm:
						</div>
						<p class="font-sans leading-relaxed text-slate-100">
							{milestone.architecturalShift.to}
						</p>
					</div>
				</div>
				<div
					class="mt-2 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-400"
				>
					<strong class="text-slate-300">Underlying Mechanism:</strong>
					{milestone.architecturalShift.mechanism}
				</div>
			</div>

			<!-- Impact on Autonomous Coding Agents -->
			<div class="mt-8">
				<h3
					class="mb-3 flex items-center gap-2 text-base font-bold tracking-wider text-slate-200 uppercase"
				>
					<span class="h-2 w-2 rounded-full bg-violet-400"></span>
					Impact on Autonomous Software Engineering Agents (SEA)
				</h3>
				<ul class="space-y-2">
					{#each milestone.impactOnCodingAgents as impact, i (i)}
						<li
							class="flex items-start gap-2.5 rounded-lg border border-slate-800/60 bg-slate-950/40 p-2.5 text-xs leading-relaxed text-slate-300"
						>
							<span class="mt-0.5 font-bold text-emerald-400">✔</span>
							<span>{impact}</span>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Technical Deep Dive -->
			<div class="mt-8">
				<h3
					class="mb-3 flex items-center gap-2 text-base font-bold tracking-wider text-slate-200 uppercase"
				>
					<span class="h-2 w-2 rounded-full bg-amber-400"></span>
					Technical Deep Dive & Analysis
				</h3>
				<div
					class="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-300"
				>
					<p>{milestone.technicalDeepDive}</p>
				</div>
			</div>

			<!-- Tags Footer -->
			<div
				class="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4"
			>
				<div class="flex flex-wrap gap-1.5">
					{#each milestone.tags as tag (tag)}
						<span
							class="rounded border border-slate-700/60 bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400"
						>
							#{tag}
						</span>
					{/each}
				</div>

				<button
					type="button"
					onclick={onClose}
					class="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-500"
				>
					Done Reading
				</button>
			</div>
		</div>
	</div>
{/if}

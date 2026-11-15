<script lang="ts">
	import KVLatentCalculator from '../interactive/KVLatentCalculator.svelte';
	import GRPOSimulator from '../interactive/GRPOSimulator.svelte';
	import ChinchillaSimulator from '../interactive/ChinchillaSimulator.svelte';
	import PassKCalculator from '../interactive/PassKCalculator.svelte';
	import PrecisionExplorer from '../interactive/PrecisionExplorer.svelte';
	import ReActLoopSimulator from '../interactive/ReActLoopSimulator.svelte';
	import FlashAttentionVisualizer from '../interactive/FlashAttentionVisualizer.svelte';
	import TestTimeSearchSimulator from '../interactive/TestTimeSearchSimulator.svelte';
	import PageRankExplorer from '../interactive/PageRankExplorer.svelte';
	import AttentionExploder from '../interactive/AttentionExploder.svelte';
	import NeuroAttentionExplorer from '../interactive/NeuroAttentionExplorer.svelte';
	import RopeExplorer from '../interactive/RopeExplorer.svelte';
	import FimSimulator from '../interactive/FimSimulator.svelte';
	import MtpVisualizer from '../interactive/MtpVisualizer.svelte';
	import TensorTileBitboard from '../interactive/TensorTileBitboard.svelte';

	export type LabTabId =
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
		| 'mtp';

	export type NeuroDrugId =
		'lisdexamfetamine' | 'methylphenidate' | 'dextroamphetamine' | 'acetylcholine';

	let {
		activeLabTab = $bindable('bitboard'),
		selectedNeuroDrug = $bindable('lisdexamfetamine')
	}: {
		activeLabTab: LabTabId;
		selectedNeuroDrug: NeuroDrugId;
	} = $props();
</script>

<section id="simulator-lab" class="scroll-mt-24 space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
		<div>
			<h2 class="flex items-center gap-2 text-xl font-bold text-white">
				<span class="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400"></span>
				Interactive Mathematical Simulator Suite
			</h2>
			<p class="mt-0.5 text-xs text-slate-400">
				Direct hands-on parameter manipulation for the core equations that power autonomous coding
				agents.
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
					? 'bg-linear-to-r from-amber-500 to-cyan-500 font-bold text-slate-950 shadow-md shadow-amber-500/20'
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

<script lang="ts">
	import type { Component } from 'svelte';
	import type { LabTabId, NeuroDrugId } from '../../types';

	type StandardSimulatorComponent = Component<Record<string, never>>;

	const SIMULATOR_LOADERS: Record<
		Exclude<LabTabId, 'neuro'>,
		() => Promise<{ default: StandardSimulatorComponent }>
	> = {
		bitboard: () => import('./TensorTileBitboard.svelte'),
		mla: () => import('./KVLatentCalculator.svelte'),
		chinchilla: () => import('./ChinchillaSimulator.svelte'),
		passk: () => import('./PassKCalculator.svelte'),
		grpo: () => import('./GRPOSimulator.svelte'),
		react: () => import('./ReActLoopSimulator.svelte'),
		precision: () => import('./PrecisionExplorer.svelte'),
		pagerank: () => import('./PageRankExplorer.svelte'),
		attention: () => import('./AttentionExploder.svelte'),
		flash: () => import('./FlashAttentionVisualizer.svelte'),
		'test-time': () => import('./TestTimeSearchSimulator.svelte'),
		rope: () => import('./RopeExplorer.svelte'),
		fim: () => import('./FimSimulator.svelte'),
		mtp: () => import('./MtpVisualizer.svelte')
	};

	let {
		id,
		selectedNeuroDrug = $bindable<NeuroDrugId>('lisdexamfetamine')
	}: {
		id: LabTabId;
		selectedNeuroDrug?: NeuroDrugId;
	} = $props();
</script>

{#snippet loadingSkeleton()}
	<div
		class="flex min-h-40 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-950/60 p-6 font-mono text-xs text-slate-400"
		role="status"
		aria-live="polite"
	>
		<span class="mr-2 h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
		Loading interactive simulator...
	</div>
{/snippet}

{#snippet errorFallback()}
	<div
		class="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 font-mono text-xs text-rose-300"
		role="alert"
	>
		Failed to load simulator module. Please refresh and try again.
	</div>
{/snippet}

{#if id === 'neuro'}
	{#await import('./NeuroAttentionExplorer.svelte')}
		{@render loadingSkeleton()}
	{:then { default: NeuroExplorer }}
		<NeuroExplorer bind:selectedDrug={selectedNeuroDrug} />
	{:catch}
		{@render errorFallback()}
	{/await}
{:else}
	{#await SIMULATOR_LOADERS[id]()}
		{@render loadingSkeleton()}
	{:then { default: Simulator }}
		<Simulator />
	{:catch}
		{@render errorFallback()}
	{/await}
{/if}

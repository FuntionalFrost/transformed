<script lang="ts">
	import type { Milestone } from '../../types';
	import { getAttentionHighlight } from '../../data/timeline';
	import MilestoneCard from '../MilestoneCard.svelte';

	let {
		milestones,
		selectedYear,
		yearLabels,
		isReactorSurging,
		onSelectMilestone
	}: {
		milestones: Milestone[];
		selectedYear: number | 'all';
		yearLabels: Record<number, string>;
		isReactorSurging: boolean;
		onSelectMilestone: (m: Milestone) => void;
	} = $props();
</script>

<section class="relative">
	<!-- Timeline Vertical Spine (Central Attention Powerline Conduit) -->
	<div
		class="absolute top-4 bottom-4 left-4 w-0.5 -translate-x-1/2 bg-linear-to-b from-cyan-500 via-amber-500 to-emerald-500 opacity-30 sm:left-1/2"
	></div>

	<!-- Photonic Pulse Stream: Power flowing continuously down the central spine -->
	<div
		class="pointer-events-none absolute top-4 bottom-4 left-4 w-1 -translate-x-1/2 overflow-hidden sm:left-1/2"
		aria-hidden="true"
	>
		<div class="spine-pulse-beam {isReactorSurging ? 'brightness-175 duration-700' : ''}"></div>
	</div>

	<div class="relative space-y-12">
		{#each milestones as milestone, idx (milestone.id)}
			{@const isEven = idx % 2 === 0}
			{@const isFirstOfYear = idx === 0 || milestones[idx - 1].year !== milestone.year}
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
						class="absolute top-5 left-4 z-20 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-amber-300 bg-linear-to-br from-amber-400 via-orange-500 to-amber-600 shadow-xl ring-4 shadow-amber-500/80 ring-amber-400/40 sm:left-1/2"
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
						class="absolute top-5 left-4 z-20 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-cyan-300 bg-linear-to-br from-cyan-400 via-sky-500 to-cyan-600 shadow-xl ring-4 shadow-cyan-500/80 ring-cyan-400/40 sm:left-1/2"
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
							? 'left-[calc(50%-2rem)] w-8 bg-linear-to-r from-transparent via-amber-400 to-amber-500 shadow-sm shadow-amber-400'
							: 'left-1/2 w-8 bg-linear-to-r from-amber-500 via-amber-400 to-transparent shadow-sm shadow-amber-400'
						: attentionType === 'attention-core'
							? isEven
								? 'left-[calc(50%-2rem)] w-8 bg-linear-to-r from-transparent via-cyan-400 to-cyan-500 shadow-sm shadow-cyan-400'
								: 'left-1/2 w-8 bg-linear-to-r from-cyan-500 via-cyan-400 to-transparent shadow-sm shadow-cyan-400'
							: isEven
								? 'left-[calc(50%-2rem)] w-8 bg-linear-to-r from-transparent to-cyan-500/70'
								: 'left-1/2 w-8 bg-linear-to-r from-cyan-500/70 to-transparent'}"
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

				<!-- Milestone Card Container (Sized cleanly on mobile without horizontal overflow) -->
				<div class="ml-9 w-[calc(100%-2.25rem)] min-w-0 sm:ml-0 sm:w-[calc(50%-2rem)]">
					<MilestoneCard {milestone} onSelect={onSelectMilestone} />
				</div>

				<!-- Empty spacer for alternating layout on desktop -->
				<div class="hidden sm:block sm:w-[calc(50%-2rem)]"></div>
			</div>
		{/each}
	</div>
</section>

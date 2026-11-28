<script lang="ts">
	import { SEA_PILLARS } from '../../data/progressiveArchitecture';
	import { TIMELINE_MILESTONES } from '../../data/timeline';
	import type { CategoryId, LabTabId } from '../../types';

	let {
		selectedCategory = $bindable('all'),
		onOpenSimulator
	}: {
		selectedCategory: CategoryId | 'all';
		onOpenSimulator: (labId: LabTabId) => void;
	} = $props();

	let seaStackViewMode = $state<'hierarchy' | 'pipeline'>('hierarchy');
	let activeSeaPillarId = $state<CategoryId>('architecture');

	let activeSeaPillar = $derived(
		SEA_PILLARS.find((p) => p.id === activeSeaPillarId) ?? SEA_PILLARS[0]
	);

	function getCategoryMilestoneCount(catId: CategoryId): number {
		return TIMELINE_MILESTONES.filter((m) => m.category === catId).length;
	}
</script>

<section
	class="relative mb-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6"
>
	<!-- Subtle Silicon Wafer Dither Pattern -->
	<div
		class="dither-grid-subtle pointer-events-none absolute inset-0 opacity-35"
		aria-hidden="true"
	></div>

	<!-- Header & Progressive Explanation Preamble -->
	<div class="relative z-10 mb-4 border-b border-slate-800/80 pb-4">
		<div class="flex flex-col justify-between gap-3 md:flex-row md:items-center">
			<div>
				<div class="flex flex-wrap items-center gap-2">
					<span class="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
					<h2 class="text-sm font-bold tracking-wider text-slate-100 uppercase sm:text-base">
						The 5-Pillar Autonomous SEA Stack
					</h2>
					<span
						class="rounded border border-cyan-800/70 bg-cyan-950/70 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300"
					>
						SEA = Software Engineering Agent
					</span>
				</div>
				<p class="mt-1 text-xs text-slate-400">
					Progressive architectural hierarchy: how mathematical attention scales from silicon to
					autonomous coding loops.
				</p>
			</div>

			<!-- Mode Selector: Hierarchy vs Pipeline -->
			<div
				class="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/90 p-1 font-mono text-[11px]"
			>
				<button
					type="button"
					onclick={() => (seaStackViewMode = 'hierarchy')}
					class="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 transition-colors {seaStackViewMode ===
					'hierarchy'
						? 'bg-cyan-600 font-bold text-white shadow-sm'
						: 'text-slate-400 hover:text-white'}"
				>
					<span>Foundation Hierarchy (1 ➔ 5)</span>
				</button>
				<button
					type="button"
					onclick={() => (seaStackViewMode = 'pipeline')}
					class="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 transition-colors {seaStackViewMode ===
					'pipeline'
						? 'bg-cyan-600 font-bold text-white shadow-sm'
						: 'text-slate-400 hover:text-white'}"
				>
					<span>Runtime Execution Flow ⚡</span>
				</button>
			</div>
		</div>

		<!-- Progressive Conceptual Primer Box -->
		<div
			class="mt-3 rounded-lg border border-slate-800/70 bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-300"
		>
			<span class="font-bold text-cyan-300">Progressive Dependency Principle:</span>
			An autonomous software engineering agent is not a single monolith. It is a vertically integrated
			5-layer hierarchy where each layer solves a specific operational bottleneck. Click any layer below
			to inspect its role, input/output contracts, and filter corresponding timeline breakthroughs.
		</div>
	</div>

	<!-- Mode 1: Hierarchy View (5 Pillar Cards) -->
	{#if seaStackViewMode === 'hierarchy'}
		<div class="relative z-10 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 md:grid-cols-5">
			{#each SEA_PILLARS as pillar (pillar.id)}
				{@const isSelectedFilter = selectedCategory === pillar.id}
				{@const isInspected = activeSeaPillarId === pillar.id}
				{@const pillarBorder =
					pillar.color === 'cyan'
						? isInspected
							? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-cyan-950/40'
							: 'border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400'
						: pillar.color === 'emerald'
							? isInspected
								? 'border-emerald-400 ring-2 ring-emerald-500/30 bg-emerald-950/40'
								: 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400'
							: pillar.color === 'amber'
								? isInspected
									? 'border-amber-400 ring-2 ring-amber-500/30 bg-amber-950/40'
									: 'border-amber-500/30 bg-amber-950/20 hover:border-amber-400'
								: pillar.color === 'violet'
									? isInspected
										? 'border-violet-400 ring-2 ring-violet-500/30 bg-violet-950/40'
										: 'border-violet-500/30 bg-violet-950/20 hover:border-violet-400'
									: isInspected
										? 'border-rose-400 ring-2 ring-rose-500/30 bg-rose-950/40'
										: 'border-rose-500/30 bg-rose-950/20 hover:border-rose-400'}
				{@const titleColor =
					pillar.color === 'cyan'
						? 'text-cyan-300'
						: pillar.color === 'emerald'
							? 'text-emerald-300'
							: pillar.color === 'amber'
								? 'text-amber-300'
								: pillar.color === 'violet'
									? 'text-violet-300'
									: 'text-rose-300'}

				<button
					type="button"
					onclick={() => {
						activeSeaPillarId = pillar.id;
						selectedCategory = selectedCategory === pillar.id ? 'all' : pillar.id;
					}}
					class="cursor-pointer rounded-lg border p-3.5 text-left transition-all {pillarBorder}"
				>
					<div class="mb-1 flex items-center justify-between font-mono font-bold {titleColor}">
						<span>{pillar.layerName}</span>
						{#if isSelectedFilter}
							<span class="rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] text-cyan-300"
								>Active</span
							>
						{/if}
					</div>
					<div class="mb-1 font-mono text-[10px] text-slate-400">{pillar.role}</div>
					<p class="text-[11px] leading-relaxed text-slate-300">
						{pillar.solution2026}
					</p>
					<div class="mt-2 text-[10px] text-slate-500">
						Click to inspect & filter ({getCategoryMilestoneCount(pillar.id)} papers)
					</div>
				</button>
			{/each}
		</div>
	{:else}
		<!-- Mode 2: Runtime Execution Flow Pipeline -->
		<div class="relative z-10 space-y-3">
			<div class="grid grid-cols-1 gap-2.5 font-mono text-xs sm:grid-cols-5">
				{#each SEA_PILLARS as step (step.pillarNumber)}
					{@const isActiveStep = activeSeaPillarId === step.id}
					<button
						type="button"
						onclick={() => (activeSeaPillarId = step.id)}
						class="flex cursor-pointer flex-col justify-between rounded-lg border p-3 text-left transition-all {isActiveStep
							? 'border-cyan-400 bg-cyan-950/50 shadow-md ring-1 ring-cyan-400/50'
							: 'border-slate-800 bg-slate-950/40 hover:border-slate-700'}"
					>
						<div>
							<div
								class="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase"
							>
								<span>{step.runtimeStep.split(':')[0]}</span>
								<span
									class="h-1.5 w-1.5 rounded-full {isActiveStep
										? 'animate-ping bg-cyan-400'
										: 'bg-slate-600'}"
								></span>
							</div>
							<div class="mt-1 text-[11px] font-bold text-white">
								{step.runtimeStep.split(':')[1]?.trim() ?? step.runtimeStep}
							</div>
						</div>
						<div class="mt-2 line-clamp-2 text-[10px] text-slate-400">
							{step.runtimeAction}
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Progressive Layer Deep Dive & Hand-Off Drawer -->
	<div class="relative z-10 mt-4 rounded-xl border border-slate-800/90 bg-slate-950/80 p-4 sm:p-5">
		<div
			class="flex flex-col justify-between gap-3 border-b border-slate-800 pb-3 sm:flex-row sm:items-center"
		>
			<div>
				<div class="flex flex-wrap items-center gap-2">
					<span class="font-mono text-xs font-bold text-cyan-400 uppercase">
						LAYER {activeSeaPillar.pillarNumber} DEEP DIVE
					</span>
					<span class="text-slate-600">|</span>
					<h3 class="text-sm font-bold text-white">
						{activeSeaPillar.layerName}: {activeSeaPillar.subtitle}
					</h3>
					<span class="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
						{activeSeaPillar.role}
					</span>
				</div>
			</div>

			<!-- Direct Action Buttons -->
			<div class="flex flex-wrap items-center gap-2 font-mono text-xs">
				<button
					type="button"
					onclick={() =>
						(selectedCategory =
							selectedCategory === activeSeaPillar.id ? 'all' : activeSeaPillar.id)}
					class="cursor-pointer rounded border px-2.5 py-1 text-[11px] transition-colors {selectedCategory ===
					activeSeaPillar.id
						? 'border-cyan-400 bg-cyan-600 font-bold text-white'
						: 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'}"
				>
					{selectedCategory === activeSeaPillar.id
						? '✓ Filtering Timeline'
						: `Filter Timeline (${getCategoryMilestoneCount(activeSeaPillar.id)})`}
				</button>
				<button
					type="button"
					onclick={() => onOpenSimulator(activeSeaPillar.labSimulatorId)}
					class="cursor-pointer rounded bg-cyan-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition-colors hover:bg-cyan-500"
				>
					Simulator: {activeSeaPillar.labSimulatorName} ⚡
				</button>
			</div>
		</div>

		<div class="mt-3.5 grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
			<!-- Left: Problem & Solution -->
			<div class="space-y-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 p-3.5">
				<div>
					<div class="font-mono text-[10px] font-bold tracking-wider text-rose-400 uppercase">
						The Core Challenge (Why Standard NLP Failed)
					</div>
					<p class="mt-1 leading-relaxed text-slate-300">
						{activeSeaPillar.challenge2017}
					</p>
				</div>
				<div class="border-t border-slate-800/80 pt-2">
					<div class="font-mono text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
						The 2026 Engineering Solution
					</div>
					<p class="mt-1 leading-relaxed text-slate-300">
						{activeSeaPillar.solution2026}
					</p>
				</div>
			</div>

			<!-- Right: Progressive Hand-Off & Runtime Contract -->
			<div class="space-y-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 p-3.5">
				<div>
					<div class="font-mono text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
						Progressive Hand-off to Layer {activeSeaPillar.pillarNumber === 5
							? '1 (Cycle)'
							: activeSeaPillar.pillarNumber + 1}
					</div>
					<p class="mt-1 leading-relaxed text-slate-300">
						{activeSeaPillar.progressiveHandOff}
					</p>
				</div>
				<div class="space-y-1 border-t border-slate-800/80 pt-2 font-mono text-[11px]">
					<div class="flex items-start gap-2">
						<span class="shrink-0 text-slate-500">Input Contract:</span>
						<span class="text-slate-300">{activeSeaPillar.inputArtifact}</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="shrink-0 text-slate-500">Output Contract:</span>
						<span class="text-cyan-300">{activeSeaPillar.outputArtifact}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Key Milestones Row -->
		<div
			class="mt-3.5 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3 text-[11px]"
		>
			<span class="font-mono text-[10px] font-bold text-slate-400 uppercase"
				>Seminal Milestones:</span
			>
			{#each activeSeaPillar.keyMilestones as paper (paper)}
				<span class="rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-slate-300">
					{paper}
				</span>
			{/each}
		</div>
	</div>
</section>

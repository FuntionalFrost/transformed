<script lang="ts">
	import type { CategoryId, CategoryInfo } from '../../types';

	let {
		selectedYear = $bindable('all'),
		selectedCategory = $bindable('all'),
		searchQuery = $bindable(''),
		years,
		categoryList,
		totalMilestoneCount,
		categoryCounts
	}: {
		selectedYear: number | 'all';
		selectedCategory: CategoryId | 'all';
		searchQuery: string;
		years: number[];
		categoryList: CategoryInfo[];
		totalMilestoneCount: number;
		categoryCounts: Record<CategoryId, number>;
	} = $props();
</script>

<section
	id="timeline-section"
	class="sticky top-15 z-30 mb-6 transform-[translateZ(0)] scroll-mt-24 rounded-xl border border-slate-800/90 bg-slate-950/95 p-2.5 px-3 shadow-[0_16px_40px_rgba(0,0,0,0.85)] ring-1 ring-slate-800/60 backdrop-blur-md sm:top-19 sm:mb-8 sm:rounded-2xl sm:p-3.5 sm:px-5"
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
		<!-- Category Filters (Horizontally scrollable on mobile) -->
		<div
			class="scrollbar-none flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:flex-wrap sm:pb-0"
		>
			<button
				type="button"
				onclick={() => (selectedCategory = 'all')}
				class="rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors {selectedCategory ===
				'all'
					? 'bg-slate-700 font-semibold text-white'
					: 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'}"
			>
				All Pillars ({totalMilestoneCount})
			</button>
			{#each categoryList as cat (cat.id)}
				{@const count = categoryCounts[cat.id] ?? 0}
				<button
					type="button"
					onclick={() => (selectedCategory = cat.id)}
					class="rounded border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all {selectedCategory ===
					cat.id
						? `${cat.badgeClass} font-bold shadow-sm`
						: 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'}"
				>
					{cat.shortLabel} ({count})
				</button>
			{/each}
		</div>

		<!-- Search Input with Keyboard Shortcut Indicator -->
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
					<kbd
						class="inline-flex h-4 min-w-4 items-center justify-center rounded border border-slate-700 bg-slate-800 px-1 font-mono text-[10px] font-medium text-slate-400 select-none"
						>/</kbd
					>
				</div>
			{/if}
		</div>
	</div>
</section>

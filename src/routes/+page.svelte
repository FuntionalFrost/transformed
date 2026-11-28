<script lang="ts">
	import { TIMELINE_MILESTONES, CATEGORIES } from '../lib/data/timeline';
	import type { CategoryId, CategoryInfo, LabTabId, Milestone, NeuroDrugId } from '../lib/types';
	import MilestoneModal from '../lib/components/MilestoneModal.svelte';
	import ArchiveHeader from '../lib/components/layout/ArchiveHeader.svelte';
	import ArchiveFooter from '../lib/components/layout/ArchiveFooter.svelte';
	import HeroArchitectureDie from '../lib/components/hero/HeroArchitectureDie.svelte';
	import SeaStackSection from '../lib/components/stack/SeaStackSection.svelte';
	import TimelineFilterDock from '../lib/components/controls/TimelineFilterDock.svelte';
	import SimulatorLabSuite from '../lib/components/views/SimulatorLabSuite.svelte';
	import TimelineFlowView from '../lib/components/views/TimelineFlowView.svelte';
	import MatrixGridView from '../lib/components/views/MatrixGridView.svelte';

	// Filters & Application State
	let selectedYear = $state<number | 'all'>('all');
	let selectedCategory = $state<CategoryId | 'all'>('all');
	let searchQuery = $state('');
	let viewMode = $state<'timeline' | 'grid' | 'lab'>('timeline');
	let activeModalMilestone = $state<Milestone | null>(null);
	let isReactorSurging = $state(false);
	let selectedNeuroDrug = $state<NeuroDrugId>('lisdexamfetamine');
	let activeLabTab = $state<LabTabId>('bitboard');

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

	let categoryCounts = $derived.by(() => {
		const counts = {} as Record<CategoryId, number>;
		for (const cat of categoryList) {
			counts[cat.id] = TIMELINE_MILESTONES.filter((m) => m.category === cat.id).length;
		}
		return counts;
	});

	function openSimulatorFromPillar(labId: LabTabId) {
		viewMode = 'lab';
		activeLabTab = labId;
		setTimeout(() => {
			const el = document.getElementById('simulator-lab');
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 40);
	}

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
			class="absolute -top-40 left-1/2 h-137.5 w-275 -translate-x-1/2 bg-linear-to-b from-cyan-500/15 via-amber-500/10 to-transparent opacity-80 blur-3xl"
		></div>
		<div class="absolute top-100 -left-48 h-162.5 w-162.5 bg-cyan-500/10 blur-3xl"></div>
		<div class="absolute top-200 -right-48 h-162.5 w-162.5 bg-amber-500/10 blur-3xl"></div>
		<div class="absolute top-350 left-1/3 h-125 w-125 bg-violet-500/8 blur-3xl"></div>
	</div>

	<!-- Navigation Bar -->
	<ArchiveHeader bind:viewMode onSwitchViewMode={switchViewMode} />

	<main
		id="main-content"
		tabindex="-1"
		class="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 outline-none sm:px-6 sm:py-12"
	>
		<!-- Attention Is All You Need & FlashAttention Hero Architecture Die -->
		<HeroArchitectureDie
			bind:selectedYear
			bind:isReactorSurging
			onOpenSimulator={openSimulatorFromPillar}
			onJumpToConferenceYear={jumpToConferenceYear}
		/>

		<!-- 2026 Full Stack Architecture Map & Timeline Filters (Visible in Timeline & Grid Views) -->
		{#if viewMode !== 'lab'}
			<!-- 2026 Full Stack Architecture Map (Progressive Hierarchy & Runtime Flow) -->
			<SeaStackSection bind:selectedCategory onOpenSimulator={openSimulatorFromPillar} />

			<!-- Interactive Controls: Filter & Search Bar Floating Dock -->
			<TimelineFilterDock
				bind:selectedYear
				bind:selectedCategory
				bind:searchQuery
				{years}
				{categoryList}
				totalMilestoneCount={TIMELINE_MILESTONES.length}
				{categoryCounts}
			/>
		{/if}

		<!-- Content Rendering according to viewMode -->
		{#if viewMode === 'lab'}
			<!-- Dedicated Interactive Simulator Suite -->
			<SimulatorLabSuite bind:activeLabTab bind:selectedNeuroDrug />
		{:else if viewMode === 'grid'}
			<!-- Matrix Grid View -->
			<MatrixGridView
				milestones={filteredMilestones}
				onSelectMilestone={(m: Milestone) => (activeModalMilestone = m)}
			/>
		{:else}
			<!-- Chronological Timeline Flow View with Center/Side Spine & Glowing Connectors -->
			<TimelineFlowView
				milestones={filteredMilestones}
				{selectedYear}
				{yearLabels}
				{isReactorSurging}
				onSelectMilestone={(m: Milestone) => (activeModalMilestone = m)}
			/>
		{/if}

		{#if filteredMilestones.length === 0 && viewMode !== 'lab'}
			<div class="py-16 text-center font-mono text-sm text-slate-400">
				No breakthroughs found matching your filter criteria. Try clearing search or selecting
				"All".
			</div>
		{/if}
	</main>

	<!-- Deep Dive Modal -->
	<MilestoneModal milestone={activeModalMilestone} onClose={() => (activeModalMilestone = null)} />

	<!-- Footer with Academic References -->
	<ArchiveFooter />
</div>

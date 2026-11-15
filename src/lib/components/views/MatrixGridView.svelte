<script lang="ts">
	import type { Milestone } from '../../types';
	import MilestoneCard from '../MilestoneCard.svelte';

	let {
		milestones,
		onSelectMilestone
	}: {
		milestones: Milestone[];
		onSelectMilestone: (m: Milestone) => void;
	} = $props();
</script>

<section class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	{#each milestones as milestone (milestone.id)}
		<MilestoneCard {milestone} onSelect={onSelectMilestone} />
	{/each}
</section>

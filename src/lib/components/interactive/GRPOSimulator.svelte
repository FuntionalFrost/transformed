<script lang="ts">
	import KatexMath from '../KatexMath.svelte';

	interface Trajectory {
		id: number;
		name: string;
		compiles: boolean;
		testsPassed: number;
		totalTests: number;
		linterErrors: number;
	}

	const formulaLatex = 'A_i = \\frac{r_i - \\bar{r}}{\\sigma_r}';

	let candidates = $state<Trajectory[]>([
		{
			id: 1,
			name: 'Candidate A (Syntax Error)',
			compiles: false,
			testsPassed: 0,
			totalTests: 4,
			linterErrors: 3
		},
		{
			id: 2,
			name: 'Candidate B (Partial Fix)',
			compiles: true,
			testsPassed: 2,
			totalTests: 4,
			linterErrors: 1
		},
		{
			id: 3,
			name: 'Candidate C (Full Test Pass)',
			compiles: true,
			testsPassed: 4,
			totalTests: 4,
			linterErrors: 0
		},
		{
			id: 4,
			name: 'Candidate D (Runtime Exception)',
			compiles: true,
			testsPassed: 0,
			totalTests: 4,
			linterErrors: 0
		},
		{
			id: 5,
			name: 'Candidate E (Passing with Style Flaws)',
			compiles: true,
			testsPassed: 4,
			totalTests: 4,
			linterErrors: 4
		},
		{
			id: 6,
			name: 'Candidate F (1 Test Failing)',
			compiles: true,
			testsPassed: 3,
			totalTests: 4,
			linterErrors: 0
		}
	]);

	function calcReward(c: Trajectory): number {
		if (!c.compiles) return 0.0;
		const compileReward = 0.3;
		const testReward = 0.7 * (c.testsPassed / c.totalTests);
		const linterPenalty = 0.05 * Math.min(5, c.linterErrors);
		return Math.max(0, Math.min(1.0, compileReward + testReward - linterPenalty));
	}

	let rewards = $derived(candidates.map((c) => calcReward(c)));

	let meanReward = $derived.by(() => {
		const sum = rewards.reduce((acc, r) => acc + r, 0);
		return sum / rewards.length;
	});

	let stdReward = $derived.by(() => {
		const m = meanReward;
		const variance = rewards.reduce((acc, r) => acc + Math.pow(r - m, 2), 0) / rewards.length;
		return Math.max(0.001, Math.sqrt(variance));
	});

	let advantages = $derived.by(() => {
		const m = meanReward;
		const s = stdReward;
		return rewards.map((r) => (r - m) / s);
	});
</script>

<div class="rounded-xl border border-violet-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-violet-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-violet-400"></span>
				Interactive RL Harness
			</span>
			<h4 class="text-lg font-bold text-slate-100">DeepSeek-R1 GRPO Group Advantage Engine</h4>
		</div>
		<div class="flex items-center gap-3 font-mono text-xs text-slate-300">
			<span class="rounded bg-slate-800 px-2 py-0.5">Group Size: G = 6</span>
			<span
				class="rounded border border-violet-500/30 bg-violet-950/60 px-2 py-0.5 text-violet-300"
			>
				Mean μ = {meanReward.toFixed(2)} | σ = {stdReward.toFixed(2)}
			</span>
		</div>
	</div>

	<p class="mt-3 text-xs leading-relaxed text-slate-400">
		GRPO executes G candidate code solutions against compilers and unit test suites. By comparing
		the trajectories against the group average rather than training a separate 70B critic model, GPU
		memory is halved and value drift is eliminated.
	</p>

	<!-- Candidate Table -->
	<div class="mt-4 overflow-x-auto">
		<table class="w-full border-collapse text-left text-xs">
			<thead>
				<tr class="border-b border-slate-800 font-mono text-slate-400">
					<th class="px-2 py-2">Trajectory</th>
					<th class="px-2 py-2">Compiles?</th>
					<th class="px-2 py-2">Tests (out of 4)</th>
					<th class="px-2 py-2">Reward (r_i)</th>
					<th class="px-2 py-2">Advantage (A_i)</th>
					<th class="px-2 py-2">Gradient Shift</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-800/60 font-mono">
				{#each candidates as c, i (c.id)}
					<tr class="transition-colors hover:bg-slate-800/30">
						<td class="px-2 py-2.5 font-medium text-slate-200">
							{c.name}
						</td>
						<td class="px-2 py-2.5">
							<button
								type="button"
								onclick={() => (c.compiles = !c.compiles)}
								class="rounded px-2 py-0.5 text-[10px] font-semibold transition-colors {c.compiles
									? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
									: 'border border-rose-500/40 bg-rose-500/20 text-rose-300'}"
							>
								{c.compiles ? 'Pass' : 'Error'}
							</button>
						</td>
						<td class="px-2 py-2.5">
							<div class="flex items-center gap-1.5">
								<span class="text-slate-300">{c.testsPassed}/4</span>
								<button
									type="button"
									disabled={c.testsPassed <= 0}
									onclick={() => {
										if (c.testsPassed > 0) c.testsPassed--;
									}}
									class="flex h-4 w-4 items-center justify-center rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
									>-</button
								>
								<button
									type="button"
									disabled={c.testsPassed >= 4}
									onclick={() => {
										if (c.testsPassed < 4) c.testsPassed++;
									}}
									class="flex h-4 w-4 items-center justify-center rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
									>+</button
								>
							</div>
						</td>
						<td
							class="px-2 py-2.5 font-bold {rewards[i] > 0.7
								? 'text-emerald-400'
								: rewards[i] > 0.3
									? 'text-amber-400'
									: 'text-rose-400'}"
						>
							{rewards[i].toFixed(2)}
						</td>
						<td
							class="px-2 py-2.5 font-bold {advantages[i] >= 0
								? 'text-emerald-400'
								: 'text-rose-400'}"
						>
							{advantages[i] >= 0 ? '+' : ''}{advantages[i].toFixed(2)}
						</td>
						<td class="px-2 py-2.5">
							<span
								class="inline-flex items-center gap-1 text-[11px] {advantages[i] > 0
									? 'text-emerald-300'
									: 'text-rose-400'}"
							>
								{advantages[i] > 0 ? '▲ Reinforce tokens' : '▼ Suppress branch'}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Equation Callout -->
	<div
		class="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/80 p-3 font-mono text-xs"
	>
		<div class="flex items-center gap-2">
			<span class="text-slate-400">Relative Baseline:</span>
			<KatexMath latex={formulaLatex} copyable={false} />
		</div>
		<span class="font-medium text-emerald-400"
			>No Critic Network (V(s)) Needed: 0 GB Extra VRAM</span
		>
	</div>
</div>

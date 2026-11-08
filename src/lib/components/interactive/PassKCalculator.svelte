<script lang="ts">
	let totalSamples = $state(20); // n
	let passingSamples = $state(4); // c

	function calcPassAtK(n: number, c: number, k: number): number {
		if (n <= 0 || k <= 0 || n < k) return 0;
		if (c === 0) return 0;
		if (n - c < k) return 1.0;

		let prod = 1.0;
		for (let i = 0; i < k; i++) {
			prod *= (n - c - i) / (n - i);
		}
		return Math.max(0, Math.min(1, 1 - prod));
	}

	let passAt1 = $derived(calcPassAtK(totalSamples, passingSamples, 1));
	let passAt5 = $derived(calcPassAtK(totalSamples, passingSamples, 5));
	let passAt10 = $derived(calcPassAtK(totalSamples, passingSamples, 10));
	let passAt20 = $derived(calcPassAtK(totalSamples, passingSamples, 20));

	const presetScenarios = [
		{
			label: 'Single-Turn Greedy',
			n: 10,
			c: 2,
			desc: 'Model passes tests only 20% of the time on single attempt'
		},
		{
			label: 'Agentic Search (SWE-bench)',
			n: 20,
			c: 6,
			desc: 'Candidate exploration with test-time execution validation'
		},
		{
			label: 'Reasoning Model (o1/R1)',
			n: 30,
			c: 18,
			desc: 'Deep test-time verification yielding 60% sample pass rate'
		}
	];
</script>

<div class="rounded-xl border border-violet-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-violet-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-violet-400"></span>
				Interactive Estimator
			</span>
			<h4 class="text-lg font-bold text-slate-100">pass@k Combinatorial Estimator</h4>
		</div>
		<div
			class="rounded border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 font-mono text-xs text-violet-300"
		>
			pass@k = 1 - [C(n-c, k) / C(n, k)]
		</div>
	</div>

	<!-- Interactive Controls -->
	<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div>
			<div class="mb-1 text-xs font-medium text-slate-300">
				Total Samples per Problem (<span class="font-mono font-bold text-violet-400"
					>n = {totalSamples}</span
				>)
			</div>
			<label for="total-samples-slider" class="sr-only">Total Samples Slider</label>
			<input
				id="total-samples-slider"
				type="range"
				min="5"
				max="50"
				step="1"
				bind:value={totalSamples}
				oninput={() => {
					if (passingSamples > totalSamples) passingSamples = totalSamples;
				}}
				class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-violet-400"
			/>
		</div>

		<div>
			<div class="mb-1 text-xs font-medium text-slate-300">
				Passing Unit Tests (<span class="font-mono font-bold text-emerald-400"
					>c = {passingSamples}</span
				>
				/ {totalSamples})
			</div>
			<label for="passing-samples-slider" class="sr-only">Passing Samples Slider</label>
			<input
				id="passing-samples-slider"
				type="range"
				min="0"
				max={totalSamples}
				step="1"
				bind:value={passingSamples}
				class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400"
			/>
		</div>
	</div>

	<!-- Presets -->
	<div class="mt-3 flex flex-wrap gap-2">
		{#each presetScenarios as preset (preset.label)}
			<button
				type="button"
				onclick={() => {
					totalSamples = preset.n;
					passingSamples = preset.c;
				}}
				class="rounded border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:text-white"
			>
				{preset.label}
			</button>
		{/each}
	</div>

	<!-- K-Cards Display -->
	<div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
		<div class="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
			<div class="font-mono text-[11px] text-slate-400">pass@1 (Greedy)</div>
			<div class="mt-1 font-mono text-2xl font-bold text-slate-200">
				{(passAt1 * 100).toFixed(1)}%
			</div>
			<div class="mt-0.5 text-[10px] text-slate-500">First shot chance</div>
		</div>

		<div class="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
			<div class="font-mono text-[11px] text-slate-400">pass@5</div>
			<div class="mt-1 font-mono text-2xl font-bold text-violet-300">
				{(passAt5 * 100).toFixed(1)}%
			</div>
			<div class="mt-0.5 text-[10px] text-slate-500">5 sample budget</div>
		</div>

		<div class="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
			<div class="font-mono text-[11px] text-slate-400">pass@10</div>
			<div class="mt-1 font-mono text-2xl font-bold text-cyan-300">
				{(passAt10 * 100).toFixed(1)}%
			</div>
			<div class="mt-0.5 text-[10px] text-slate-500">10 sample budget</div>
		</div>

		<div class="rounded-lg border border-violet-500/40 bg-violet-950/20 p-3 text-center">
			<div class="font-mono text-[11px] font-semibold text-violet-300">pass@20 (Agentic)</div>
			<div class="mt-1 font-mono text-2xl font-bold text-emerald-400">
				{(passAt20 * 100).toFixed(1)}%
			</div>
			<div class="mt-0.5 text-[10px] text-emerald-400/80">Search rollout</div>
		</div>
	</div>

	<p
		class="mt-4 rounded border border-slate-800/80 bg-slate-950/40 p-3 text-[11px] leading-relaxed text-slate-400"
	>
		<strong class="text-slate-200">The Power of Test-Time Verification:</strong> Notice how even if
		individual candidate probability is low (e.g. 20%), an agent capable of generating and
		sandboxing $k=10$ or $20$ candidate rollouts achieves over
		<span class="font-mono font-bold text-emerald-400">{(passAt20 * 100).toFixed(1)}%</span> probability
		of solving the issue!
	</p>
</div>

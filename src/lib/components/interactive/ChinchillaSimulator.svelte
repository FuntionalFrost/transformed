<script lang="ts">
	let logCompute = $state(24.0); // 10^24 FLOPs

	// Compute in FLOPs: C = 10^logCompute
	// Chinchilla: N ~ G * C^0.5, D ~ G * C^0.5 with 6*N*D = C
	// Hoffmann empirical scaling: N_opt = 0.6 * sqrt(C / 6), D_opt = sqrt(C / 6) / 0.6
	let computeFlops = $derived(Math.pow(10, logCompute));

	let chinchillaParams = $derived.by(() => {
		const raw = Math.sqrt(computeFlops / 6) * 0.6;
		return raw / 1e9; // in Billions
	});

	let chinchillaTokens = $derived.by(() => {
		const raw = Math.sqrt(computeFlops / 6) / 0.6;
		return raw / 1e12; // in Trillions
	});

	// Kaplan 2020 (over-allocated to parameters):
	// N ~ C^0.73, D ~ C^0.27
	let kaplanParams = $derived.by(() => {
		const normC = computeFlops / 1e24;
		return 175 * Math.pow(normC, 0.73);
	});

	let kaplanTokens = $derived.by(() => {
		const normC = computeFlops / 1e24;
		return 0.3 * Math.pow(normC, 0.27);
	});

	const milestones = [
		{
			label: 'GPT-3 (2020)',
			logC: 23.5,
			note: 'Kaplan era: 175B on 300B tokens (severely undertrained)'
		},
		{ label: 'Chinchilla 70B (2022)', logC: 24.0, note: 'Compute-optimal: 70B on 1.4T tokens' },
		{ label: 'CodeLlama 34B (2023)', logC: 24.3, note: 'Trained on 2.5T code tokens' },
		{
			label: 'Llama-3 / DeepSeek-V3 (2024–2025)',
			logC: 25.5,
			note: 'Heavily overtrained on 15T+ tokens for ultra-cheap agent serving'
		}
	];
</script>

<div class="rounded-xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
				Interactive Scaling Law
			</span>
			<h4 class="text-lg font-bold text-slate-100">
				Chinchilla vs Kaplan: Parameter vs Token Allocation
			</h4>
		</div>
		<div
			class="rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-xs text-amber-300"
		>
			C ≈ 6ND = 10<sup>{logCompute.toFixed(1)}</sup> FLOPs
		</div>
	</div>

	<!-- Slider -->
	<div class="mt-4">
		<div class="mb-2 flex justify-between text-xs text-slate-300">
			<span>Compute Budget ($C$):</span>
			<span class="font-mono font-bold text-amber-400"
				>10<sup>{logCompute.toFixed(1)}</sup> FLOPs</span
			>
		</div>
		<label for="compute-budget-slider" class="sr-only">Compute Budget Slider</label>
		<input
			id="compute-budget-slider"
			type="range"
			min="21"
			max="26"
			step="0.1"
			bind:value={logCompute}
			class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-400"
		/>
		<div class="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
			<span>10^21 (Small)</span>
			<span>10^24 (Chinchilla Scale)</span>
			<span>10^26 (Frontier SEA)</span>
		</div>
	</div>

	<!-- Presets -->
	<div class="mt-4 flex flex-wrap gap-2">
		{#each milestones as item (item.label)}
			<button
				type="button"
				onclick={() => (logCompute = item.logC)}
				class="rounded border px-2.5 py-1 text-xs transition-colors {Math.abs(
					logCompute - item.logC
				) < 0.15
					? 'border-amber-500/50 bg-amber-500/20 font-semibold text-amber-200'
					: 'border-slate-700/60 bg-slate-800/80 text-slate-400 hover:text-slate-200'}"
			>
				{item.label}
			</button>
		{/each}
	</div>

	<!-- Comparison Cards -->
	<div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
		<!-- Chinchilla Optimal -->
		<div class="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-xs font-semibold tracking-wider text-emerald-400 uppercase"
					>Chinchilla (Hoffmann 2022)</span
				>
				<span class="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300"
					>Optimal</span
				>
			</div>
			<div class="mt-3 grid grid-cols-2 gap-2">
				<div>
					<div class="text-[11px] text-slate-400">Parameters (N)</div>
					<div class="font-mono text-xl font-bold text-slate-100">
						{chinchillaParams.toFixed(1)}B
					</div>
				</div>
				<div>
					<div class="text-[11px] text-slate-400">Tokens (D)</div>
					<div class="font-mono text-xl font-bold text-emerald-400">
						{chinchillaTokens.toFixed(2)}T
					</div>
				</div>
			</div>
			<p class="mt-3 text-[11px] leading-relaxed text-slate-400">
				Parameters and tokens scale 1:1. Produces compact, dense models that fit inside developer
				workstations and IDE memory limits.
			</p>
		</div>

		<!-- Kaplan Suboptimal -->
		<div class="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-xs font-semibold tracking-wider text-slate-400 uppercase"
					>Kaplan et al. (2020)</span
				>
				<span class="rounded bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] text-rose-300"
					>Param-Heavy</span
				>
			</div>
			<div class="mt-3 grid grid-cols-2 gap-2">
				<div>
					<div class="text-[11px] text-slate-400">Parameters (N)</div>
					<div class="font-mono text-xl font-bold text-slate-300">{kaplanParams.toFixed(1)}B</div>
				</div>
				<div>
					<div class="text-[11px] text-slate-400">Tokens (D)</div>
					<div class="font-mono text-xl font-bold text-rose-400">{kaplanTokens.toFixed(2)}T</div>
				</div>
			</div>
			<p class="mt-3 text-[11px] leading-relaxed text-slate-400">
				Over-allocated to model size. Required 8x H100 clusters to serve an undertrained model that
				struggled with rare programming APIs.
			</p>
		</div>
	</div>
</div>

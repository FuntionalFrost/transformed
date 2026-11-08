<script lang="ts">
	let contextLength = $state(131072); // 128k default
	let concurrentSessions = $state(4);
	let precisionBytes = $state(2); // 2 bytes for BF16/FP16, 1 for FP8

	// Model architecture constants (similar to DeepSeek-V2/V3 60-layer scale)
	const numLayers = 60;
	const numHeads = 128;
	const headDim = 128; // n_h * d_h = 16384
	const gqaKvHeads = 8; // Grouped Query Attention (16:1 ratio)
	const mlaLatentDim = 512; // d_c
	const mlaDecoupledRopeDim = 64; // d_r

	// Formulas in Gigabytes
	let mhaBytes = $derived.by(() => {
		const perToken = 2 * numLayers * numHeads * headDim * precisionBytes;
		return (perToken * contextLength * concurrentSessions) / 1024 ** 3;
	});

	let gqaBytes = $derived.by(() => {
		const perToken = 2 * numLayers * gqaKvHeads * headDim * precisionBytes;
		return (perToken * contextLength * concurrentSessions) / 1024 ** 3;
	});

	let mlaBytes = $derived.by(() => {
		const perToken = numLayers * (mlaLatentDim + mlaDecoupledRopeDim) * precisionBytes;
		return (perToken * contextLength * concurrentSessions) / 1024 ** 3;
	});

	let savingsPercent = $derived.by(() => {
		if (mhaBytes === 0) return 0;
		return Math.round(((mhaBytes - mlaBytes) / mhaBytes) * 100);
	});

	const contextPresets = [
		{ label: '8k (File)', value: 8192 },
		{ label: '32k (Module)', value: 32768 },
		{ label: '128k (Repo)', value: 131072 },
		{ label: '512k (Full Stack)', value: 524288 },
		{ label: '1M (Monorepo)', value: 1048576 }
	];
</script>

<div class="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-cyan-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
				Interactive Simulator
			</span>
			<h4 class="text-lg font-bold text-slate-100">MLA vs MHA / GQA: GPU Memory Impact</h4>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-xs text-slate-400">KV Cache Precision:</span>
			<button
				type="button"
				onclick={() => (precisionBytes = 2)}
				class="rounded px-2.5 py-1 font-mono text-xs font-medium transition-colors {precisionBytes ===
				2
					? 'border border-cyan-500/50 bg-cyan-500/20 text-cyan-300'
					: 'bg-slate-800 text-slate-400 hover:text-slate-200'}"
			>
				16-bit (BF16)
			</button>
			<button
				type="button"
				onclick={() => (precisionBytes = 1)}
				class="rounded px-2.5 py-1 font-mono text-xs font-medium transition-colors {precisionBytes ===
				1
					? 'border border-cyan-500/50 bg-cyan-500/20 text-cyan-300'
					: 'bg-slate-800 text-slate-400 hover:text-slate-200'}"
			>
				8-bit (FP8)
			</button>
		</div>
	</div>

	<!-- Controls -->
	<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div>
			<div class="mb-2 text-xs font-medium text-slate-300">
				Context Length: <span class="font-mono font-bold text-cyan-400"
					>{contextLength.toLocaleString()} tokens</span
				>
			</div>
			<div class="mb-2 flex flex-wrap gap-1.5">
				{#each contextPresets as preset (preset.value)}
					<button
						type="button"
						onclick={() => (contextLength = preset.value)}
						class="rounded px-2.5 py-1 font-mono text-xs transition-colors {contextLength ===
						preset.value
							? 'bg-cyan-600 font-semibold text-white'
							: 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}"
					>
						{preset.label}
					</button>
				{/each}
			</div>
			<label for="context-slider" class="sr-only">Context Length Slider</label>
			<input
				id="context-slider"
				type="range"
				min="4096"
				max="1048576"
				step="4096"
				bind:value={contextLength}
				class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
			/>
		</div>

		<div>
			<div class="mb-2 text-xs font-medium text-slate-300">
				Concurrent Agent Daemons: <span class="font-mono font-bold text-cyan-400"
					>{concurrentSessions} agent session{concurrentSessions > 1 ? 's' : ''}</span
				>
			</div>
			<div class="mb-2 flex gap-2">
				{#each [1, 2, 4, 8, 16] as count (count)}
					<button
						type="button"
						onclick={() => (concurrentSessions = count)}
						class="flex-1 rounded py-1 font-mono text-xs transition-colors {concurrentSessions ===
						count
							? 'bg-cyan-600 font-semibold text-white'
							: 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}"
					>
						{count}x
					</button>
				{/each}
			</div>
			<p class="mt-1 text-[11px] text-slate-400">
				In IDE multi-agent workflows, each agent worker (planner, coder, test runner) holds a branch
				in memory.
			</p>
		</div>
	</div>

	<!-- Visual Memory Comparison Bars -->
	<div class="mt-6 space-y-3 rounded-lg border border-slate-800/80 bg-slate-950/60 p-4">
		<!-- Standard MHA -->
		<div>
			<div class="mb-1 flex justify-between text-xs">
				<span class="font-medium text-slate-400">Standard MHA (Multi-Head Attention)</span>
				<span class="font-mono font-bold text-rose-400"
					>{mhaBytes > 1024
						? `${(mhaBytes / 1024).toFixed(1)} TB`
						: `${mhaBytes.toFixed(1)} GB`}</span
				>
			</div>
			<div class="h-3 w-full overflow-hidden rounded-full bg-slate-800">
				<div class="h-full w-full rounded-full bg-rose-500/80"></div>
			</div>
			<p class="mt-0.5 text-[10px] text-slate-500">
				Exceeds standard 80GB H100 GPU memory at long context.
			</p>
		</div>

		<!-- GQA -->
		<div>
			<div class="mb-1 flex justify-between text-xs">
				<span class="font-medium text-slate-400">GQA (Grouped-Query Attention, 16:1)</span>
				<span class="font-mono font-bold text-amber-400"
					>{gqaBytes > 1024
						? `${(gqaBytes / 1024).toFixed(1)} TB`
						: `${gqaBytes.toFixed(1)} GB`}</span
				>
			</div>
			<div class="h-3 w-full overflow-hidden rounded-full bg-slate-800">
				<div
					class="h-full rounded-full bg-amber-500/80 transition-all duration-300"
					style="width: {Math.min(100, (gqaBytes / mhaBytes) * 100)}%"
				></div>
			</div>
			<p class="mt-0.5 text-[10px] text-slate-500">
				Compresses heads, but still stores full key-value vectors per group.
			</p>
		</div>

		<!-- MLA (DeepSeek) -->
		<div>
			<div class="mb-1 flex justify-between text-xs">
				<span class="flex items-center gap-1.5 font-semibold text-cyan-300">
					<span>Multi-Head Latent Attention (MLA)</span>
					<span
						class="py-0.2 rounded border border-cyan-500/30 bg-cyan-500/20 px-1.5 text-[10px] text-cyan-300"
						>-{savingsPercent}% VRAM</span
					>
				</span>
				<span class="font-mono font-bold text-cyan-400"
					>{mlaBytes > 1024
						? `${(mlaBytes / 1024).toFixed(1)} TB`
						: `${mlaBytes.toFixed(1)} GB`}</span
				>
			</div>
			<div class="h-3 w-full overflow-hidden rounded-full bg-slate-800">
				<div
					class="h-full rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)] transition-all duration-300"
					style="width: {Math.max(3, (mlaBytes / mhaBytes) * 100)}%"
				></div>
			</div>
			<p class="mt-0.5 font-mono text-[10px] text-cyan-400/80">
				Only caches low-rank vector c_t^KV (512-dim) + decoupled RoPE (64-dim). Fits in single GPU
				memory!
			</p>
		</div>
	</div>

	<!-- Key Takeaway Banner -->
	<div
		class="mt-4 flex items-start gap-2.5 rounded-lg border border-cyan-500/20 bg-cyan-950/40 p-3 text-xs text-slate-300"
	>
		<span class="mt-0.5 text-sm text-cyan-400">💡</span>
		<div class="space-y-1">
			<p class="font-semibold text-cyan-200">Why MLA Enabled Production Coding Agents:</p>
			<p class="text-[11px] leading-relaxed text-slate-400">
				Before MLA, keeping a 128k-token AST repository map resident across 4 agent threads required
				hundreds of gigabytes of VRAM just for the KV cache, forcing constant cache eviction and
				multi-second prefill recalculations. MLA compresses the state by 85–92%, enabling persistent
				IDE agent daemons with instant sub-second turn latency.
			</p>
		</div>
	</div>
</div>

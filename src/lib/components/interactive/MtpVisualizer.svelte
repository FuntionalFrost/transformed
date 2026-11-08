<script lang="ts">
	import KatexMath from '../KatexMath.svelte';

	let lookaheadK = $state<1 | 2 | 4>(2);

	const kOptions: (1 | 2 | 4)[] = [1, 2, 4];

	const mtpLossFormula =
		'\\mathcal{L}_{\\text{MTP}} = -\\frac{1}{T} \\sum_{t=1}^T \\sum_{k=1}^K \\lambda_k \\log P\\left(x_{t+k} \\mid \\mathbf{h}_t^{(k)}; \\theta\\right)';

	const codeTokens = [
		'for',
		'i',
		'in',
		'range(len(items)):',
		'val',
		'=',
		'items[i]',
		'process(val)'
	];

	let speedup = $derived.by(() => {
		if (lookaheadK === 4) return { factor: '3.1×', tps: '185 tokens/sec', acceptance: '72%' };
		if (lookaheadK === 2) return { factor: '2.2×', tps: '135 tokens/sec', acceptance: '86%' };
		return { factor: '1.0×', tps: '62 tokens/sec', acceptance: '100% (Baseline)' };
	});
</script>

<div
	class="tensor-bracket rounded-xl border border-violet-500/35 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm"
>
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-violet-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-violet-400"></span>
				Multi-Token Prediction & Speculative Lookahead (Meta 2024 / DeepSeek)
			</span>
			<h4 class="text-lg font-bold text-slate-100">
				MTP: Parallel Prediction Heads & Speculative Decoding
			</h4>
		</div>
		<div class="flex items-center gap-1.5">
			<span class="font-mono text-xs text-slate-400">Lookahead Depth (K):</span>
			{#each kOptions as k (k)}
				<button
					type="button"
					onclick={() => (lookaheadK = k)}
					class="rounded px-2.5 py-1 font-mono text-xs transition-colors {lookaheadK === k
						? 'bg-violet-600 font-bold text-white shadow-md'
						: 'bg-slate-800 text-slate-400 hover:text-white'}"
				>
					K = {k}
					{k === 1 ? '(Standard AR)' : `(${k} Heads)`}
				</button>
			{/each}
		</div>
	</div>

	<!-- Speculative Head Hierarchy Visualizer -->
	<div class="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
		<div class="mb-3 flex items-center justify-between font-mono text-xs">
			<span class="font-bold text-slate-300">Parallel Prediction Head Branching:</span>
			<span class="text-violet-300"
				>Speculative Draft Horizon: {lookaheadK} future tokens per step</span
			>
		</div>

		<!-- Token Prediction Rows -->
		<div class="space-y-2 font-mono text-xs">
			<div class="flex items-center gap-2">
				<span class="w-24 shrink-0 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300"
					>Base Model (t):</span
				>
				<div class="flex items-center gap-1">
					<span
						class="rounded border border-cyan-500/40 bg-cyan-950/40 px-2.5 py-1 font-bold text-cyan-300"
					>
						x_t: "{codeTokens[0]}"
					</span>
				</div>
			</div>

			{#if lookaheadK >= 2}
				<div class="flex items-center gap-2">
					<span
						class="w-24 shrink-0 rounded border border-violet-500/30 bg-violet-950/40 px-2 py-1 text-[11px] text-violet-300"
						>Head #1 (t+1):</span
					>
					<div class="flex items-center gap-1">
						<span
							class="rounded border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 font-bold text-emerald-300"
						>
							x_&#123;t+1&#125;: "{codeTokens[1]}"
						</span>
						<span class="text-[10px] font-bold text-emerald-400">✓ Accepted (lossless)</span>
					</div>
				</div>
			{/if}

			{#if lookaheadK >= 4}
				<div class="flex items-center gap-2">
					<span
						class="w-24 shrink-0 rounded border border-violet-500/30 bg-violet-950/40 px-2 py-1 text-[11px] text-violet-300"
						>Head #2 (t+2):</span
					>
					<div class="flex items-center gap-1">
						<span
							class="rounded border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 font-bold text-emerald-300"
						>
							x_&#123;t+2&#125;: "{codeTokens[2]}"
						</span>
						<span class="text-[10px] font-bold text-emerald-400">✓ Accepted</span>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<span
						class="w-24 shrink-0 rounded border border-violet-500/30 bg-violet-950/40 px-2 py-1 text-[11px] text-violet-300"
						>Head #3 (t+3):</span
					>
					<div class="flex items-center gap-1">
						<span
							class="rounded border border-amber-500/40 bg-amber-950/40 px-2.5 py-1 font-bold text-amber-300"
						>
							x_&#123;t+3&#125;: "{codeTokens[3]}"
						</span>
						<span class="text-[10px] font-bold text-amber-400">~ Verified</span>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Throughput Metrics Grid -->
	<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
		<div class="rounded-lg border border-violet-500/30 bg-violet-950/20 p-3 text-center">
			<div class="font-mono text-xs text-slate-400">Inference Acceleration</div>
			<div class="mt-1 font-mono text-2xl font-bold text-violet-300">{speedup.factor} Speedup</div>
			<div class="mt-0.5 text-[10px] text-slate-500">Zero additional draft model</div>
		</div>

		<div class="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-center">
			<div class="font-mono text-xs text-slate-400">Speculative Throughput</div>
			<div class="mt-1 font-mono text-2xl font-bold text-emerald-300">{speedup.tps}</div>
			<div class="mt-0.5 text-[10px] text-slate-500">On RTX 4090 / H100 GPU</div>
		</div>

		<div class="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3 text-center">
			<div class="font-mono text-xs text-slate-400">AST Token Acceptance</div>
			<div class="mt-1 font-mono text-2xl font-bold text-cyan-300">{speedup.acceptance}</div>
			<div class="mt-0.5 text-[10px] text-slate-500">Rigorous tree verification</div>
		</div>
	</div>

	<!-- Equation Showcase -->
	<div class="mt-4 rounded-lg border border-slate-800 bg-slate-950/80 p-3.5 text-center">
		<div class="mb-1 font-mono text-[11px] text-slate-400">MTP Parallel Loss Objective:</div>
		<KatexMath latex={mtpLossFormula} displayMode={true} copyable={true} />
	</div>
</div>

<script lang="ts">
	import KatexMath from '../KatexMath.svelte';

	let testComputeTokens = $state(4000); // C_test tokens
	let activeBranch = $state<'A' | 'B' | 'C'>('C');

	const uctFormula =
		'\\text{UCT}(s, a) = Q(s, a) + c_{\\text{puct}} \\cdot P(a \\mid s) \\frac{\\sqrt{\\sum_{b} N(s, b)}}{1 + N(s, a)}';
	const cTestLatex = 'C_{\\text{test}}';

	// Empirical test-time power law: P(Success) = 1 - (1 - P_0) * (C_0 / C_test)^0.38
	let successProbability = $derived.by(() => {
		const baseFail = 0.75; // 25% zero-shot pass
		const exponent = 0.42;
		const ratio = 500 / testComputeTokens;
		const failRate = baseFail * Math.pow(ratio, exponent);
		return Math.min(0.92, Math.max(0.25, 1 - failRate));
	});

	const branches = {
		A: {
			title: 'Branch A: Greedy Stride Rewrite',
			patch: 'stride = tensor.stride()[:-1] + (1,)',
			result: '❌ Failure: Pytest IndexError: stride dimension mismatch on empty batch',
			score: 0.12,
			status: 'Pruned',
			uct: 0.34
		},
		B: {
			title: 'Branch B: Contiguous Reshape',
			patch: 'return tensor.contiguous().view(target_shape)',
			result: '⚠️ Warning: 4/5 unit tests pass, but performance benchmark times out (>2000ms)',
			score: 0.58,
			status: 'Backtracked',
			uct: 0.62
		},
		C: {
			title: 'Branch C: Zero-Copy View Injection',
			patch:
				'if not tensor.is_contiguous(): tensor = tensor.contiguous()\nreturn tensor.as_strided(target_shape, strides)',
			result: '✅ Verified: 5/5 unit tests pass, zero regressions, benchmarks optimal',
			score: 0.98,
			status: 'Selected Optimal Patch',
			uct: 0.94
		}
	};
</script>

<div class="rounded-xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
				Inference-Time Scaling Law
			</span>
			<h4 class="text-lg font-bold text-slate-100">
				Test-Time Compute: MCTS & Process Verifier Scaling
			</h4>
		</div>
		<div
			class="rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-xs text-amber-300"
		>
			P(Success) ∝ C<sub>train</sub><sup>α</sup> · C<sub>test</sub><sup>γ</sup>
		</div>
	</div>

	<!-- Token Budget Slider -->
	<div class="mt-4">
		<div class="mb-1 flex justify-between text-xs text-slate-300">
			<span class="flex items-center gap-1.5">
				<span>Inference Thinking & Sandbox Budget (</span>
				<KatexMath latex={cTestLatex} copyable={false} />
				<span>):</span>
			</span>
			<span class="font-mono font-bold text-amber-400"
				>{testComputeTokens.toLocaleString()} tokens</span
			>
		</div>
		<label for="test-tokens-slider" class="sr-only">Inference Budget Slider</label>
		<input
			id="test-tokens-slider"
			type="range"
			min="500"
			max="16000"
			step="500"
			bind:value={testComputeTokens}
			class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-400"
		/>
		<div class="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
			<span>500 (Zero-shot greedy)</span>
			<span>4,000 (Standard o1/R1 trace)</span>
			<span>16,000 (Deep SWE-bench rollout)</span>
		</div>
	</div>

	<!-- Pass Probability Metric Display -->
	<div
		class="mt-4 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 p-3"
	>
		<div>
			<div class="text-[11px] text-slate-400">Repository Task Solve Probability:</div>
			<div class="font-mono text-2xl font-bold text-emerald-400">
				{(successProbability * 100).toFixed(1)}%
			</div>
		</div>
		<div class="text-right font-mono text-[11px] text-slate-400">
			<div>
				Thinking Budget: <span class="text-amber-400"
					>{testComputeTokens.toLocaleString()} tokens</span
				>
			</div>
			<div>
				MCTS Rollouts: <span class="text-cyan-400"
					>{Math.round(testComputeTokens / 600)} candidate paths</span
				>
			</div>
		</div>
	</div>

	<!-- Interactive Tree Branches -->
	<div class="mt-4">
		<div class="mb-2 font-mono text-xs text-slate-400">
			Simulated Ephemeral Sandbox Rollout (UCT Selection):
		</div>
		<div class="grid grid-cols-1 gap-2 md:grid-cols-3">
			{#each ['A', 'B', 'C'] as ('A' | 'B' | 'C')[] as branchKey (branchKey)}
				{@const b = branches[branchKey]}
				<button
					type="button"
					onclick={() => (activeBranch = branchKey)}
					class="rounded-lg border p-3 text-left transition-all {activeBranch === branchKey
						? 'border-amber-500/60 bg-amber-950/30 shadow-lg'
						: 'border-slate-800 bg-slate-950/60 hover:border-slate-700'}"
				>
					<div class="mb-1 flex items-center justify-between">
						<span
							class="font-mono text-xs font-bold {branchKey === 'C'
								? 'text-emerald-400'
								: 'text-slate-300'}"
						>
							{b.title}
						</span>
					</div>
					<div
						class="inline-block rounded px-1.5 py-0.5 font-mono text-[10px] {b.status ===
						'Selected Optimal Patch'
							? 'bg-emerald-500/20 text-emerald-300'
							: b.status === 'Pruned'
								? 'bg-rose-500/20 text-rose-300'
								: 'bg-amber-500/20 text-amber-300'}"
					>
						{b.status}
					</div>
					<div class="mt-2 font-mono text-[10px] text-slate-400">
						UCT Score: <span class="text-slate-200">{b.uct.toFixed(2)}</span>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Active Branch Detail -->
	<div class="mt-4 rounded-lg border border-slate-800/90 bg-slate-950/90 p-3.5 font-mono text-xs">
		<div class="mb-1 text-[11px] text-slate-400">Proposed Code Patch:</div>
		<pre class="rounded bg-slate-900 p-2 text-[11px] whitespace-pre-wrap text-cyan-300">{branches[
				activeBranch
			].patch}</pre>
		<div
			class="mt-2 font-sans text-[11px] {activeBranch === 'C'
				? 'text-emerald-300'
				: 'text-rose-400'}"
		>
			{branches[activeBranch].result}
		</div>
	</div>

	<!-- Formula Reference -->
	<div class="mt-3 rounded border border-slate-800/80 bg-slate-950/40 p-2.5 text-center">
		<KatexMath latex={uctFormula} displayMode={true} copyable={true} />
	</div>
</div>

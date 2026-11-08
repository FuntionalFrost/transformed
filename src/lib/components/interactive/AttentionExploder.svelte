<script lang="ts">
	import KatexMath from '../KatexMath.svelte';

	let activeTerm = $state<'Q' | 'K' | 'scale' | 'softmax' | 'V'>('scale');
	let dkDimension = $state(64);
	let selectedCell = $state<{ row: number; col: number }>({ row: 1, col: 0 });

	const tokens = ['def', 'fetch_user', '(', 'id: int'];

	// Pre-calculated representative dot products for code context tokens
	const rawScores = [
		[18.2, 4.1, 2.3, 1.2],
		[22.4, 34.8, 12.1, 28.5],
		[3.2, 8.4, 25.1, 19.3],
		[5.1, 31.2, 14.6, 36.2]
	];

	const formula =
		'\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V';

	let scaleFactor = $derived(1 / Math.sqrt(dkDimension));

	// Compute scaled matrix S = QK^T / sqrt(d_k)
	let scaledScores = $derived.by(() => {
		return rawScores.map((row) => row.map((val) => val * scaleFactor));
	});

	// Compute row-wise softmax P = exp(S - max) / sum(exp(S - max))
	let softmaxMatrix = $derived.by(() => {
		return scaledScores.map((row) => {
			const maxVal = Math.max(...row);
			const exps = row.map((val) => Math.exp(val - maxVal));
			const sumExp = exps.reduce((acc, curr) => acc + curr, 0);
			return exps.map((val) => val / sumExp);
		});
	});

	let currentExp = $derived.by(() => {
		switch (activeTerm) {
			case 'Q':
				return {
					title: 'Query Matrix (Q)',
					latex: 'Q \\in \\mathbb{R}^{N \\times d_k}',
					desc: 'Represents the token currently searching for syntax and semantic dependencies. For instance, the token `id: int` emits a Query asking: "Which function signature or caller parameter scope does this identifier belong to?"'
				};
			case 'K':
				return {
					title: 'Key Matrix (K)',
					latex: 'K \\in \\mathbb{R}^{N \\times d_k}',
					desc: 'Acts as address metadata for all tokens in context. The token `fetch_user` projects high-affinity Key vectors for any arguments defined inside its signature boundaries.'
				};
			case 'scale':
				return {
					title: 'Scaling Factor (1 / √d_k)',
					latex: `\\frac{1}{\\sqrt{d_k}} = \\frac{1}{\\sqrt{${dkDimension}}} \\approx ${scaleFactor.toFixed(3)}`,
					desc: 'As the key dimension d_k increases, the dot products grow proportionally large, pushing softmax into extreme regions where gradients vanish to zero. Dividing by √d_k maintains unit variance across all attention heads.'
				};
			case 'softmax':
				return {
					title: 'Softmax Row-wise Normalization',
					latex: 'P_{ij} = \\frac{e^{S_{ij}}}{\\sum_k e^{S_{ik}}} \\quad \\sum_j P_{ij} = 1.0',
					desc: 'Converts unnormalized affinity scores into a probability distribution over context. In FlashAttention, this is computed via streaming online max-subtraction directly inside ultra-fast SRAM.'
				};
			case 'V':
				return {
					title: 'Value Matrix (V)',
					latex: 'V \\in \\mathbb{R}^{N \\times d_v}',
					desc: 'Carries the lexical and structural representation of each token. The final attention vector is a weighted sum: Output = P · V, pulling relevant repository symbols into the next Transformer layer.'
				};
		}
	});
</script>

<div
	class="tensor-bracket rounded-xl border border-cyan-500/35 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm"
>
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-cyan-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
				Attention Is All You Need (Vaswani et al. 2017)
			</span>
			<h4 class="flex items-center gap-2 text-lg font-bold text-slate-100">
				<span>Scaled Dot-Product Attention Engine</span>
				<span
					class="rounded border border-cyan-500/30 bg-cyan-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300"
					>O(N²) Baseline</span
				>
			</h4>
		</div>
		<div
			class="rounded border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-xs text-cyan-300"
		>
			d_k = {dkDimension} | 1/√d_k ≈ {scaleFactor.toFixed(3)}
		</div>
	</div>

	<!-- Equation Banner with Clickable Terms -->
	<div
		class="attention-grid mt-4 flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-950/80 p-4"
	>
		<KatexMath latex={formula} displayMode={true} copyable={true} />

		<div class="mt-3 flex flex-wrap justify-center gap-2">
			<button
				type="button"
				onclick={() => (activeTerm = 'Q')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {activeTerm === 'Q'
					? 'bg-cyan-500 font-bold text-slate-950 shadow-md shadow-cyan-500/30'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				Query (Q)
			</button>
			<button
				type="button"
				onclick={() => (activeTerm = 'K')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {activeTerm === 'K'
					? 'bg-amber-400 font-bold text-slate-950 shadow-md shadow-amber-500/30'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				Key (K)
			</button>
			<button
				type="button"
				onclick={() => (activeTerm = 'scale')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {activeTerm === 'scale'
					? 'bg-violet-400 font-bold text-slate-950 shadow-md shadow-violet-500/30'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				Scale (1/√d_k)
			</button>
			<button
				type="button"
				onclick={() => (activeTerm = 'softmax')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {activeTerm === 'softmax'
					? 'bg-emerald-400 font-bold text-slate-950 shadow-md shadow-emerald-500/30'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				softmax(·)
			</button>
			<button
				type="button"
				onclick={() => (activeTerm = 'V')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {activeTerm === 'V'
					? 'bg-rose-400 font-bold text-slate-950 shadow-md shadow-rose-500/30'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				Value (V)
			</button>
		</div>
	</div>

	<!-- Interactive Attention Heatmap Matrix (4x4 Context Tokens) -->
	<div class="mt-5 rounded-lg border border-slate-800 bg-slate-950/80 p-4">
		<div class="mb-3 flex items-center justify-between font-mono text-xs text-slate-300">
			<div class="flex items-center gap-2">
				<span class="font-bold text-cyan-400">⚡ INTERACTIVE ATTENTION WEIGHT MATRIX:</span>
				<span class="text-[11px] text-slate-400"
					>(Click any cell to inspect dot product & softmax probability)</span
				>
			</div>
			<div class="text-[11px] text-slate-400">
				Selected: <span class="font-bold text-cyan-300">Q("{tokens[selectedCell.row]}")</span> →
				<span class="font-bold text-amber-300">K("{tokens[selectedCell.col]}")</span>
			</div>
		</div>

		<div class="overflow-x-auto">
			<div class="min-w-[420px]">
				<!-- Key Column Headers -->
				<div class="mb-1.5 grid grid-cols-5 gap-1.5 text-center font-mono text-[11px]">
					<div class="self-center pr-2 text-right text-slate-500">Q \ K</div>
					{#each tokens as kToken (kToken)}
						<div
							class="truncate rounded border border-amber-500/30 bg-amber-500/10 px-1 py-1 font-bold text-amber-300"
						>
							{kToken}
						</div>
					{/each}
				</div>

				<!-- Rows: Query tokens -->
				{#each tokens as qToken, rIdx (qToken)}
					<div class="my-1 grid grid-cols-5 items-center gap-1.5 font-mono text-xs">
						<!-- Query Row Header -->
						<div
							class="truncate rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-right font-bold text-cyan-300"
						>
							{qToken}
						</div>

						<!-- Matrix Cells (Softmax Probability Heatmap) -->
						{#each softmaxMatrix[rIdx] as prob, cIdx (cIdx)}
							{@const isSelected = selectedCell.row === rIdx && selectedCell.col === cIdx}
							<button
								type="button"
								onclick={() => (selectedCell = { row: rIdx, col: cIdx })}
								class="relative rounded border px-1 py-2 text-center text-xs font-bold transition-all {isSelected
									? 'z-10 scale-105 border-cyan-400 shadow-lg ring-2 ring-cyan-400/50'
									: 'border-slate-800 hover:border-slate-600'}"
								style="background-color: rgba(6, 182, 212, {Math.max(0.08, prob * 0.85)});"
							>
								<span class={prob > 0.4 ? 'text-white' : 'text-slate-300'}>
									{(prob * 100).toFixed(1)}%
								</span>
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<!-- Cell Inspection Inspector -->
		<div
			class="mt-3 grid grid-cols-1 gap-2 rounded border border-slate-800/80 bg-slate-900/80 p-3 font-mono text-xs sm:grid-cols-3"
		>
			<div>
				<span class="text-slate-500">Raw Dot Product:</span>
				<span class="ml-1 font-bold text-slate-200"
					>Q · Kᵀ = {rawScores[selectedCell.row][selectedCell.col].toFixed(1)}</span
				>
			</div>
			<div>
				<span class="text-slate-500">Scaled Score (S_ij):</span>
				<span class="ml-1 font-bold text-cyan-300"
					>S = {scaledScores[selectedCell.row][selectedCell.col].toFixed(2)}</span
				>
			</div>
			<div>
				<span class="text-slate-500">Softmax Weight (P_ij):</span>
				<span class="ml-1 font-bold text-emerald-400"
					>P = {(softmaxMatrix[selectedCell.row][selectedCell.col] * 100).toFixed(1)}%</span
				>
			</div>
		</div>
	</div>

	<!-- Interactive Parameter Adjuster -->
	<div
		class="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-3 text-xs text-slate-300"
	>
		<div class="flex items-center gap-3">
			<span class="font-mono text-slate-400">Head Dimension (d_k):</span>
			<div class="flex gap-1.5">
				{#each [32, 64, 128, 256] as d (d)}
					<button
						type="button"
						onclick={() => (dkDimension = d)}
						class="rounded px-2.5 py-0.5 font-mono text-xs transition-colors {dkDimension === d
							? 'bg-cyan-600 font-bold text-white shadow-sm'
							: 'bg-slate-800 text-slate-400 hover:text-slate-200'}"
					>
						{d}
					</button>
				{/each}
			</div>
		</div>
		<div class="font-mono text-[11px] text-slate-400">
			Scaling Factor 1/√{dkDimension} =
			<strong class="text-cyan-300">{scaleFactor.toFixed(3)}</strong>
		</div>
	</div>

	<!-- Detailed Explanation Card -->
	<div class="mt-4 rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-4">
		<div class="mb-2 flex items-center justify-between">
			<span class="text-xs font-bold tracking-wider text-cyan-300 uppercase"
				>{currentExp.title}</span
			>
			<span class="font-mono text-xs text-cyan-400">
				<KatexMath latex={currentExp.latex} copyable={false} />
			</span>
		</div>
		<p class="text-xs leading-relaxed text-slate-300">
			{currentExp.desc}
		</p>
	</div>
</div>

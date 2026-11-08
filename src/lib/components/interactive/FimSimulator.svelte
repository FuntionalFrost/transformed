<script lang="ts">
	import KatexMath from '../KatexMath.svelte';

	let fimMode = $state<'PSM' | 'SPM'>('PSM');
	let prefixCode = $state('def calculate_pass_at_k(n, c, k):');
	let suffixCode = $state('    return 1.0 - (comb(n - c, k) / comb(n, k))');
	let middleCode = $state('    # Sample verification logic\n    if n - c < k:\n        return 1.0');

	const psmFormula =
		'\\mathbf{x}_{\\text{FIM-PSM}} = \\langle\\text{PRE}\\rangle \\; x_{\\text{prefix}} \\; \\langle\\text{SUF}\\rangle \\; x_{\\text{suffix}} \\; \\langle\\text{MID}\\rangle \\; x_{\\text{middle}}';

	const spmFormula =
		'\\mathbf{x}_{\\text{FIM-SPM}} = \\langle\\text{SUF}\\rangle \\; x_{\\text{suffix}} \\; \\langle\\text{PRE}\\rangle \\; x_{\\text{prefix}} \\; \\langle\\text{MID}\\rangle \\; x_{\\text{middle}}';
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
				Bidirectional Infilling Training (Bavarian et al. 2022)
			</span>
			<h4 class="text-lg font-bold text-slate-100">
				FIM: Fill-in-the-Middle Transformation Simulator
			</h4>
		</div>
		<div class="flex items-center gap-1.5">
			<button
				type="button"
				onclick={() => (fimMode = 'PSM')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {fimMode === 'PSM'
					? 'bg-violet-600 font-bold text-white shadow-md'
					: 'bg-slate-800 text-slate-400 hover:text-white'}"
			>
				PSM (Prefix-Suffix-Middle)
			</button>
			<button
				type="button"
				onclick={() => (fimMode = 'SPM')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {fimMode === 'SPM'
					? 'bg-violet-600 font-bold text-white shadow-md'
					: 'bg-slate-800 text-slate-400 hover:text-white'}"
			>
				SPM (Suffix-Prefix-Middle)
			</button>
		</div>
	</div>

	<!-- Interactive IDE Context Infilling Simulator -->
	<div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
		<!-- Left: Code Editor Layout (What the developer sees) -->
		<div class="rounded-lg border border-slate-800 bg-slate-950/80 p-4 font-mono text-xs">
			<div
				class="mb-2 flex items-center justify-between border-b border-slate-800/80 pb-2 text-slate-400"
			>
				<span class="font-bold text-slate-200">Developer Editor State:</span>
				<span class="text-[10px] text-cyan-400">Cursor Active Inside Function Body</span>
			</div>

			<!-- Prefix block -->
			<div class="rounded border border-cyan-500/30 bg-cyan-950/20 p-2.5">
				<div class="mb-1 text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
					Prefix Context (Above Cursor):
				</div>
				<textarea
					bind:value={prefixCode}
					rows="2"
					class="w-full resize-none bg-transparent font-mono text-xs text-cyan-200 focus:outline-none"
				></textarea>
			</div>

			<!-- Middle Infilled Block -->
			<div class="my-2 rounded border border-emerald-500/40 bg-emerald-950/20 p-2.5">
				<div class="mb-1 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
					Infilled Target (Middle Generation):
				</div>
				<textarea
					bind:value={middleCode}
					rows="3"
					class="w-full resize-none bg-transparent font-mono text-xs text-emerald-200 focus:outline-none"
				></textarea>
			</div>

			<!-- Suffix block -->
			<div class="rounded border border-amber-500/30 bg-amber-950/20 p-2.5">
				<div class="mb-1 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
					Suffix Context (Below Cursor):
				</div>
				<textarea
					bind:value={suffixCode}
					rows="2"
					class="w-full resize-none bg-transparent font-mono text-xs text-amber-200 focus:outline-none"
				></textarea>
			</div>
		</div>

		<!-- Right: Transformed FIM Training Token Stream (What the LLM sees) -->
		<div
			class="flex flex-col justify-between rounded-lg border border-violet-500/30 bg-slate-950/80 p-4 font-mono text-xs"
		>
			<div>
				<div
					class="mb-2 flex items-center justify-between border-b border-slate-800/80 pb-2 text-slate-400"
				>
					<span class="font-bold text-violet-300">Model Input Stream ({fimMode}):</span>
					<span class="text-[10px] text-emerald-400">Autoregressive Next-Token Conditioned</span>
				</div>

				<div class="space-y-2 text-xs leading-relaxed">
					{#if fimMode === 'PSM'}
						<div class="rounded border border-slate-800 bg-slate-900 p-2">
							<span class="font-bold text-rose-400">&lt;PRE&gt;</span>
							<span class="text-cyan-300">{prefixCode}</span>
						</div>
						<div class="rounded border border-slate-800 bg-slate-900 p-2">
							<span class="font-bold text-rose-400">&lt;SUF&gt;</span>
							<span class="text-amber-300">{suffixCode}</span>
						</div>
						<div class="rounded border border-emerald-500/40 bg-emerald-950/40 p-2">
							<span class="font-bold text-rose-400">&lt;MID&gt;</span>
							<span class="font-semibold text-emerald-300">{middleCode}</span>
							<span class="ml-1 inline-block h-3 w-1.5 animate-pulse bg-emerald-400"></span>
						</div>
					{:else}
						<div class="rounded border border-slate-800 bg-slate-900 p-2">
							<span class="font-bold text-rose-400">&lt;SUF&gt;</span>
							<span class="text-amber-300">{suffixCode}</span>
						</div>
						<div class="rounded border border-slate-800 bg-slate-900 p-2">
							<span class="font-bold text-rose-400">&lt;PRE&gt;</span>
							<span class="text-cyan-300">{prefixCode}</span>
						</div>
						<div class="rounded border border-emerald-500/40 bg-emerald-950/40 p-2">
							<span class="font-bold text-rose-400">&lt;MID&gt;</span>
							<span class="font-semibold text-emerald-300">{middleCode}</span>
							<span class="ml-1 inline-block h-3 w-1.5 animate-pulse bg-emerald-400"></span>
						</div>
					{/if}
				</div>
			</div>

			<p class="mt-4 text-[11px] leading-relaxed text-slate-400">
				FIM restructures document pretraining so autoregressive decoders condition simultaneously on
				upstream definitions and downstream return statements, unlocking real-time in-line
				completions in modern IDEs.
			</p>
		</div>
	</div>

	<!-- Mathematical Formulation -->
	<div class="mt-4 rounded-lg border border-slate-800 bg-slate-950/80 p-3.5 text-center">
		<KatexMath
			latex={fimMode === 'PSM' ? psmFormula : spmFormula}
			displayMode={true}
			copyable={true}
		/>
	</div>
</div>

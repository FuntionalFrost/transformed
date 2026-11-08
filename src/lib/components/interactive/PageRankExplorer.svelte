<script lang="ts">
	interface GraphNode {
		id: string;
		label: string;
		category: 'seed' | 'direct' | 'transitive' | 'unrelated';
		isQuerySeed: boolean;
		inDegree: number;
		rankScore: number;
	}

	let dampingFactor = $state(0.85); // d

	// Small illustrative repository graph
	const nodes: GraphNode[] = [
		{
			id: 'tokenizer.py',
			label: 'tokenizer.py (Crash Site)',
			category: 'seed',
			isQuerySeed: true,
			inDegree: 4,
			rankScore: 0.38
		},
		{
			id: 'token_types.py',
			label: 'token_types.py (Enum Defs)',
			category: 'direct',
			isQuerySeed: false,
			inDegree: 3,
			rankScore: 0.22
		},
		{
			id: 'parser.py',
			label: 'parser.py (AST Consumer)',
			category: 'direct',
			isQuerySeed: false,
			inDegree: 2,
			rankScore: 0.18
		},
		{
			id: 'lexer_utils.py',
			label: 'lexer_utils.py (Helper)',
			category: 'direct',
			isQuerySeed: false,
			inDegree: 1,
			rankScore: 0.12
		},
		{
			id: 'compiler.py',
			label: 'compiler.py (High-level)',
			category: 'transitive',
			isQuerySeed: false,
			inDegree: 1,
			rankScore: 0.07
		},
		{
			id: 'auth.py',
			label: 'auth.py (Unrelated Module)',
			category: 'unrelated',
			isQuerySeed: false,
			inDegree: 0,
			rankScore: 0.01
		}
	];

	let calculatedRanks = $derived.by(() => {
		const d = dampingFactor;
		return nodes.map((n) => {
			if (n.category === 'seed') {
				const score = (1 - d) * 1.0 + d * 0.35;
				return { ...n, score };
			}
			if (n.category === 'direct') {
				const score = d * (n.inDegree * 0.08);
				return { ...n, score };
			}
			if (n.category === 'transitive') {
				const score = d * 0.06;
				return { ...n, score };
			}
			return { ...n, score: 0.01 };
		});
	});
</script>

<div class="rounded-xl border border-rose-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-rose-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-rose-400"></span>
				Graph Retrieval Engine
			</span>
			<h4 class="text-lg font-bold text-slate-100">
				Personalized PageRank: AST & Call-Graph Context Slicing
			</h4>
		</div>
		<div
			class="rounded border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-xs text-rose-300"
		>
			d = {dampingFactor.toFixed(2)} (Walk Damping)
		</div>
	</div>

	<!-- Controls -->
	<div class="mt-4">
		<div class="mb-1 flex justify-between text-xs text-slate-300">
			<span>Random Walk Damping Factor (d):</span>
			<span class="font-mono font-bold text-rose-400">{dampingFactor.toFixed(2)}</span>
		</div>
		<label for="damping-slider" class="sr-only">Damping Factor Slider</label>
		<input
			id="damping-slider"
			type="range"
			min="0.1"
			max="0.95"
			step="0.05"
			bind:value={dampingFactor}
			class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-rose-400"
		/>
		<div class="mt-0.5 flex justify-between font-mono text-[10px] text-slate-500">
			<span>d = 0.1 (Strict query seed focus)</span>
			<span>d = 0.85 (Standard PageRank)</span>
			<span>d = 0.95 (Deep graph traversal)</span>
		</div>
	</div>

	<!-- Ranked Slices -->
	<div class="mt-5 space-y-2">
		<div class="mb-1 flex justify-between font-mono text-xs text-slate-400">
			<span>Ranked Repository Files</span>
			<span>Stationary Probability (p*)</span>
		</div>
		{#each calculatedRanks as item (item.id)}
			<div
				class="flex items-center justify-between rounded border border-slate-800/80 bg-slate-950/70 p-2.5 transition-colors hover:border-slate-700"
			>
				<div class="flex items-center gap-2">
					<span
						class="h-2 w-2 rounded-full {item.category === 'seed'
							? 'animate-ping bg-rose-500'
							: item.category === 'direct'
								? 'bg-cyan-400'
								: item.category === 'transitive'
									? 'bg-amber-400'
									: 'bg-slate-600'}"
					></span>
					<span class="font-mono text-xs text-slate-200">{item.label}</span>
				</div>
				<div class="flex items-center gap-3">
					<span
						class="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase {item.score > 0.15
							? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
							: 'bg-slate-800 text-slate-400'}"
					>
						{item.score > 0.15 ? 'Included in Context' : 'Pruned (Save Tokens)'}
					</span>
					<span
						class="font-mono text-xs font-bold {item.score > 0.15
							? 'text-emerald-400'
							: 'text-slate-500'}"
					>
						{(item.score * 100).toFixed(1)}%
					</span>
				</div>
			</div>
		{/each}
	</div>

	<p
		class="mt-4 rounded border border-slate-800 bg-slate-950/40 p-3 text-[11px] leading-relaxed text-slate-400"
	>
		<strong class="text-slate-200">AST Graph Topology vs Naive Chunk Embedding:</strong> Naive vector
		similarity searches for text matching and frequently hallucinates irrelevant test files. Personalized
		PageRank uses static AST call-graphs so the agent injects only the essential call site definitions
		and import headers, keeping prompts tight and execution sub-second.
	</p>
</div>

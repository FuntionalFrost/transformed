<script lang="ts">
	// Svelte 5 Runes
	let maskMode = $state<'causal' | 'window' | 'sparse'>('causal');
	let isScanning = $state(false);
	let scanStep = $state(-1);
	let hoveredCell = $state<{ row: number; col: number } | null>(null);

	const TILE_SIZE = 16; // 16x16 WMMA warp tile
	const COL_INDICES = Array.from({ length: TILE_SIZE }, (_, i) => i);

	// Generate baseline simulated logits for the 16x16 tile
	// Simulating semantic affinity between tokens (higher near diagonal, occasional cross-attention spikes)
	function getLogit(row: number, col: number): number {
		const dist = Math.abs(row - col);
		const base = Math.max(0, 12 - dist * 1.4);
		// Deterministic pseudo-random spike for token affinity
		const spike = ((row * 7 + col * 13) % 17) * 0.4;
		return Number((base + spike).toFixed(2));
	}

	function isCellMasked(row: number, col: number, mode: 'causal' | 'window' | 'sparse'): boolean {
		if (mode === 'causal') {
			// Autoregressive causal mask: future tokens (col > row) masked
			return col > row;
		}
		if (mode === 'window') {
			// Local sliding window (window size 4)
			return Math.abs(row - col) > 4;
		}
		if (mode === 'sparse') {
			// Block sparse: global tokens (col 0, 1) or local window (<= 3)
			const isGlobal = col < 2 || row < 2;
			const isLocal = Math.abs(row - col) <= 3;
			return !isGlobal && !isLocal;
		}
		return false;
	}

	// Compute row-wise softmax weights
	let tileMatrix = $derived.by(() => {
		const matrix = [];
		for (let r = 0; r < TILE_SIZE; r++) {
			const rowData = [];
			let maxVal = -Infinity;

			for (let c = 0; c < TILE_SIZE; c++) {
				const masked = isCellMasked(r, c, maskMode);
				const logit = masked ? -10000 : getLogit(r, c);
				if (!masked && logit > maxVal) maxVal = logit;
				rowData.push({ logit, masked });
			}

			// Exponentiate and sum
			let sumExp = 0;
			const exps = rowData.map((cell) => {
				if (cell.masked) return 0;
				const exp = Math.exp(cell.logit - maxVal);
				sumExp += exp;
				return exp;
			});

			// Normalized probabilities
			const rowWeights = rowData.map((cell, c) => {
				const weight = cell.masked || sumExp === 0 ? 0 : exps[c] / sumExp;
				return {
					row: r,
					col: c,
					logit: cell.logit,
					masked: cell.masked,
					weight: Number(weight.toFixed(4))
				};
			});
			matrix.push(rowWeights);
		}
		return matrix;
	});

	// Tile statistics
	let activeTokensCount = $derived.by(() => {
		let count = 0;
		for (let r = 0; r < TILE_SIZE; r++) {
			for (let c = 0; c < TILE_SIZE; c++) {
				if (!isCellMasked(r, c, maskMode)) count++;
			}
		}
		return count;
	});

	let sparsityPercent = $derived(
		Math.round((1 - activeTokensCount / (TILE_SIZE * TILE_SIZE)) * 100)
	);

	function triggerScan() {
		if (isScanning) return;
		isScanning = true;
		scanStep = 0;

		const interval = setInterval(() => {
			scanStep++;
			if (scanStep >= TILE_SIZE + TILE_SIZE) {
				clearInterval(interval);
				setTimeout(() => {
					isScanning = false;
					scanStep = -1;
				}, 400);
			}
		}, 45);
	}

	// Micro-pixel cell color mapper based on attention probability
	function getCellColor(cell: {
		row: number;
		col: number;
		masked: boolean;
		weight: number;
	}): string {
		if (cell.masked) {
			return 'bg-slate-950/80 text-slate-800 border-slate-900/60';
		}
		const w = cell.weight;
		if (w > 0.4)
			return 'bg-amber-400 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.6)] font-bold';
		if (w > 0.2) return 'bg-amber-500/80 text-white';
		if (w > 0.1) return 'bg-cyan-500 text-slate-950 font-bold';
		if (w > 0.05) return 'bg-cyan-600/70 text-cyan-100';
		if (w > 0.02) return 'bg-cyan-900/60 text-cyan-300';
		return 'bg-slate-900 text-slate-500';
	}
</script>

<div
	class="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950/90 p-4 font-mono shadow-2xl backdrop-blur-md"
>
	<!-- Substrate Dither Texture Background -->
	<div class="dither-grid-subtle pointer-events-none absolute inset-0 opacity-40"></div>

	<!-- Top Header Telemetry -->
	<div
		class="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3"
	>
		<div class="flex items-center gap-2">
			<!-- 8-bit Micro Icon -->
			<span
				class="flex h-5 w-5 items-center justify-center rounded border border-cyan-400/40 bg-cyan-950/60 text-[10px] text-cyan-300"
			>
				▦
			</span>
			<div>
				<div class="flex items-center gap-2">
					<span class="text-xs font-black tracking-wider text-white uppercase"
						>16×16 SRAM TILE BITBOARD</span
					>
					<span
						class="rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300"
					>
						WMMA WARP MATRIX
					</span>
				</div>
				<p class="text-[10px] text-slate-400">
					Real-time visualization of NVIDIA Tensor Core register allocation & attention mask
					sparsity
				</p>
			</div>
		</div>

		<!-- Action Controls -->
		<div class="flex flex-wrap items-center gap-1.5">
			<!-- Mask Mode Selectors -->
			<div
				class="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-[10px]"
			>
				<button
					type="button"
					onclick={() => (maskMode = 'causal')}
					class="cursor-pointer rounded px-2 py-0.5 transition-colors {maskMode === 'causal'
						? 'bg-cyan-600 font-bold text-white'
						: 'text-slate-400 hover:text-slate-200'}"
				>
					CAUSAL
				</button>
				<button
					type="button"
					onclick={() => (maskMode = 'window')}
					class="cursor-pointer rounded px-2 py-0.5 transition-colors {maskMode === 'window'
						? 'bg-cyan-600 font-bold text-white'
						: 'text-slate-400 hover:text-slate-200'}"
				>
					SLIDING
				</button>
				<button
					type="button"
					onclick={() => (maskMode = 'sparse')}
					class="cursor-pointer rounded px-2 py-0.5 transition-colors {maskMode === 'sparse'
						? 'bg-cyan-600 font-bold text-white'
						: 'text-slate-400 hover:text-slate-200'}"
				>
					SPARSE
				</button>
			</div>

			<!-- Scan Dispatch Button -->
			<button
				type="button"
				onclick={triggerScan}
				class="cursor-pointer rounded border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-all {isScanning
					? 'animate-pulse border-amber-400 bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
					: 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300 hover:border-cyan-400 hover:text-white'}"
			>
				{isScanning ? '⚡ SWEEPING WARP...' : 'DISPATCH SCAN ⚡'}
			</button>
		</div>
	</div>

	<!-- Main Bitboard Display Grid -->
	<div
		class="relative z-10 mt-4 flex flex-col items-center justify-center gap-4 lg:flex-row lg:items-start"
	>
		<!-- 16x16 Pixel Matrix -->
		<div class="relative rounded-lg border border-slate-800 bg-slate-950 p-2 shadow-inner">
			<!-- Column Headers (Keys 0..15) -->
			<div class="mb-1 flex pl-5 text-[8px] text-slate-500">
				{#each COL_INDICES as c (c)}
					<div class="w-4 text-center sm:w-5">
						{c % 4 === 0 ? c : '·'}
					</div>
				{/each}
			</div>

			<!-- Rows -->
			<div class="flex flex-col gap-0.5">
				{#each tileMatrix as row, r (r)}
					<div class="flex items-center gap-0.5">
						<!-- Row Header (Queries 0..15) -->
						<div class="w-4.5 pr-1 text-right text-[8px] text-slate-500 sm:w-5">
							{r % 4 === 0 ? r : '·'}
						</div>

						<!-- Row Cells -->
						{#each row as cell, c (`${r}-${c}`)}
							{@const isWavefront = isScanning && r + c === scanStep}
							<div
								role="gridcell"
								tabindex="0"
								onmouseenter={() => (hoveredCell = { row: r, col: c })}
								onmouseleave={() => (hoveredCell = null)}
								onfocus={() => (hoveredCell = { row: r, col: c })}
								onblur={() => (hoveredCell = null)}
								class="relative flex h-3.5 w-3.5 cursor-crosshair items-center justify-center rounded-[1px] border text-[7px] transition-all duration-100 sm:h-4.5 sm:w-4.5 {getCellColor(
									cell
								)} {isWavefront
									? 'z-20 scale-125 border-amber-300 bg-amber-300 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,1)]'
									: 'hover:z-10 hover:scale-120 hover:border-cyan-300'}"
								title="[{r}, {c}] {cell.masked ? 'Masked' : `Weight: ${cell.weight}`}"
							>
								{#if cell.masked}
									<span class="opacity-20">·</span>
								{:else if cell.weight > 0.25}
									<span class="text-[6px] font-black">★</span>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>

			<!-- Grid Footer Axis Labels -->
			<div class="mt-2 flex items-center justify-between px-2 text-[9px] text-slate-500">
				<span>◄ Q: ROW TOKENS (0..15)</span>
				<span>K: COL TOKENS (0..15) ►</span>
			</div>
		</div>

		<!-- Live Register Inspector & Bit Metrics -->
		<div class="flex w-full flex-1 flex-col gap-3 lg:max-w-xs">
			<!-- Cell Inspector Card -->
			<div class="rounded-lg border border-slate-800 bg-slate-900/90 p-3 shadow-md">
				<div class="flex items-center justify-between border-b border-slate-800 pb-2">
					<span class="text-[10px] font-bold tracking-wider text-cyan-400 uppercase"
						>PIXEL REGISTER INSPECTOR</span
					>
					<span class="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-400">
						{hoveredCell ? `[${hoveredCell.row}, ${hoveredCell.col}]` : 'HOVER CELL'}
					</span>
				</div>

				{#if hoveredCell}
					{@const activeCell = tileMatrix[hoveredCell.row][hoveredCell.col]}
					<div class="mt-2.5 space-y-1.5 text-[11px]">
						<div class="flex items-center justify-between">
							<span class="text-slate-400">State:</span>
							<span class="font-bold {activeCell.masked ? 'text-rose-400' : 'text-emerald-400'}">
								{activeCell.masked ? 'MASKED (-INF)' : 'ACTIVE IN SRAM'}
							</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-slate-400">Attention Weight ($P_{'{i,j}'}$):</span>
							<span class="font-bold text-cyan-300">{activeCell.weight.toFixed(4)}</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-slate-400">Raw Dot-Product ($S_{'{i,j}'}$):</span>
							<span class="font-mono text-slate-200">{activeCell.logit.toFixed(2)}</span>
						</div>
						<div
							class="flex items-center justify-between border-t border-slate-800/80 pt-1.5 text-[10px]"
						>
							<span class="text-slate-500">Hardware Allocation:</span>
							<span class="text-amber-300"
								>WARP_{Math.floor(hoveredCell.row / 4)} // RF_0x{(
									hoveredCell.row * 16 +
									hoveredCell.col
								)
									.toString(16)
									.toUpperCase()}</span
							>
						</div>
					</div>
				{:else}
					<div class="py-4 text-center text-xs text-slate-500">
						Move your cursor across any cell in the 16×16 tile to inspect attention weights and SRAM
						warp registers.
					</div>
				{/if}
			</div>

			<!-- Hardware Bitboard Telemetry -->
			<div class="grid grid-cols-2 gap-2 text-left">
				<div class="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
					<div class="text-[9px] text-slate-400 uppercase">Active Elements</div>
					<div class="mt-0.5 text-base font-black text-cyan-300">
						{activeTokensCount} <span class="text-[10px] font-normal text-slate-500">/ 256</span>
					</div>
				</div>
				<div class="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
					<div class="text-[9px] text-slate-400 uppercase">Tile Sparsity</div>
					<div class="mt-0.5 text-base font-black text-amber-300">{sparsityPercent}%</div>
				</div>
				<div class="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
					<div class="text-[9px] text-slate-400 uppercase">FP8 SRAM Footprint</div>
					<div class="mt-0.5 text-base font-black text-emerald-300">
						256 <span class="text-[10px] font-normal text-slate-500">Bytes</span>
					</div>
				</div>
				<div class="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
					<div class="text-[9px] text-slate-400 uppercase">Warp Execution</div>
					<div class="mt-0.5 text-base font-black text-violet-300">4 Warps</div>
				</div>
			</div>

			<!-- Heatmap Legend -->
			<div
				class="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/70 px-3 py-2 text-[9px] text-slate-400"
			>
				<span>LOW WT (0.01)</span>
				<div class="flex items-center gap-1">
					<span class="h-2.5 w-2.5 rounded-[1px] border border-slate-800 bg-slate-900"></span>
					<span class="h-2.5 w-2.5 rounded-[1px] bg-cyan-900"></span>
					<span class="h-2.5 w-2.5 rounded-[1px] bg-cyan-600"></span>
					<span class="h-2.5 w-2.5 rounded-[1px] bg-cyan-400"></span>
					<span class="h-2.5 w-2.5 rounded-[1px] bg-amber-400"></span>
				</div>
				<span class="text-amber-400">HIGH FOCUS (&gt;0.4)</span>
			</div>
		</div>
	</div>
</div>

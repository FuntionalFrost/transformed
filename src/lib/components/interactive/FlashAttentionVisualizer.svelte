<script lang="ts">
	import KatexMath from '../KatexMath.svelte';

	let sequenceLength = $state(65536); // 64k tokens (typical multi-file repository context)
	let activeVersion = $state<'flash1' | 'flash2' | 'flash3'>('flash3');

	const onlineSoftmaxFormula =
		'm_{\\text{new}} = \\max(m_{\\text{prev}}, x), \\quad d_{\\text{new}} = d_{\\text{prev}} e^{m_{\\text{prev}} - m_{\\text{new}}} + e^{x - m_{\\text{new}}}';

	const flash2Formula =
		'\\text{Flash-2 Speedup: } \\mathcal{O}\\left(\\frac{N^2 d^2}{M}\\right) \\text{ FLOPs} \\quad \\text{Warp Partitioning } \\implies 225\\text{ TFLOPs/s (73\\% A100 Peak)}';

	const flash3Formula =
		'\\text{Flash-3 (Hopper H100): } \\text{TMA Async} \\parallel \\text{WGMMA} \\parallel \\text{Softmax Overlap} \\implies 740\\text{--}850\\text{ TFLOPs/s (78\\% H100 Peak)}';

	const flash3HadamardFormula =
		'\\tilde{X} = X H_d \\quad \\text{where } H_d = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} H_{d/2} & H_{d/2} \\\\ H_{d/2} & -H_{d/2} \\end{pmatrix} \\quad (\\text{FP8 Outlier Incoherence})';

	// Memory IO in Megabytes:
	// Standard attention reads/writes N x N floats: 4 * N^2 bytes
	let standardIoMB = $derived.by(() => {
		const bytes = 4 * Math.pow(sequenceLength, 2);
		return bytes / (1024 * 1024);
	});

	// FlashAttention reads Q, K, V and writes O: 4 * (4 * N * d) bytes (with d=128)
	// In Flash-3 FP8, bytes per element drop from 2 (FP16/BF16) to 1 byte
	let flashIoMB = $derived.by(() => {
		const elementBytes = activeVersion === 'flash3' ? 1 : 2;
		const bytes = elementBytes * (4 * sequenceLength * 128);
		return bytes / (1024 * 1024);
	});

	let ioReductionFactor = $derived.by(() => {
		if (flashIoMB === 0) return 1;
		return Math.round(standardIoMB / flashIoMB);
	});

	// TFlops throughput comparison
	let throughput = $derived.by(() => {
		if (activeVersion === 'flash3') {
			return {
				tflops: 740,
				peakPercent: '78%',
				speedupVsStandard: '6.8×',
				speedupVsFlash1: '5.9×',
				description:
					'FlashAttention-3 leverages NVIDIA Hopper Tensor Memory Accelerator (TMA) for zero-register async memory transfers, producer-consumer warp specialization, pipelined GEMM-Softmax overlap, and low-precision FP8 with randomized Hadamard outlier suppression.'
			};
		}
		if (activeVersion === 'flash2') {
			return {
				tflops: 225,
				peakPercent: '73%',
				speedupVsStandard: '3.8×',
				speedupVsFlash1: '1.8×',
				description:
					'FlashAttention-2 parallelizes over the sequence dimension in the outer loop, splits work across thread blocks within each SM, and optimizes register layout to maximize Tensor Core utilization.'
			};
		}
		return {
			tflops: 125,
			peakPercent: '42%',
			speedupVsStandard: '2.0×',
			speedupVsFlash1: '1.0×',
			description:
				'FlashAttention-1 introduced IO-aware tiling and online softmax, reducing quadratic HBM traffic to linear O(N) by streaming blocks through on-chip SRAM.'
		};
	});
</script>

<div
	class="tensor-bracket rounded-xl border border-amber-500/35 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm"
>
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
				Hardware IO-Aware Kernel (Dao et al. 2022–2024)
			</span>
			<h4 class="flex items-center gap-2 text-lg font-bold text-slate-100">
				<span>FlashAttention-1, 2 & 3 Tiling & Asynchrony Suite</span>
			</h4>
		</div>
		<div class="flex flex-wrap items-center gap-1.5">
			<button
				type="button"
				onclick={() => (activeVersion = 'flash1')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {activeVersion === 'flash1'
					? 'bg-amber-500 font-bold text-slate-950 shadow-md shadow-amber-500/20'
					: 'bg-slate-800 text-slate-400 hover:text-white'}"
			>
				FlashAttention-1 (2022)
			</button>
			<button
				type="button"
				onclick={() => (activeVersion = 'flash2')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {activeVersion === 'flash2'
					? 'bg-cyan-500 font-bold text-slate-950 shadow-md shadow-cyan-500/20'
					: 'bg-slate-800 text-slate-400 hover:text-white'}"
			>
				FlashAttention-2 (2023)
			</button>
			<button
				type="button"
				onclick={() => (activeVersion = 'flash3')}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {activeVersion === 'flash3'
					? 'bg-gradient-to-r from-emerald-400 to-cyan-400 font-bold text-slate-950 shadow-lg ring-1 shadow-emerald-500/20 ring-emerald-300'
					: 'bg-slate-800 text-emerald-400 hover:text-white'}"
			>
				⚡ FlashAttention-3 (2024 Hopper TMA)
			</button>
		</div>
	</div>

	<!-- Token Sequence Length Slider -->
	<div class="mt-4">
		<div class="mb-1 flex justify-between font-mono text-xs text-slate-300">
			<span>Repository Prompt Context:</span>
			<span class="font-bold text-cyan-400"
				>{sequenceLength.toLocaleString()} tokens ({Math.round(sequenceLength / 1024)}k Context)</span
			>
		</div>
		<label for="seq-length-slider" class="sr-only">Sequence Length Slider</label>
		<input
			id="seq-length-slider"
			type="range"
			min="2048"
			max="131072"
			step="2048"
			bind:value={sequenceLength}
			class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
		/>
		<div class="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
			<span>2k (Attention Is All You Need)</span>
			<span>32k (FlashAttention-1)</span>
			<span>128k (FlashAttention-2 & 3 Monorepos)</span>
		</div>
	</div>

	<!-- Visual Memory Hierarchy: SRAM vs HBM -->
	<div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
		<!-- Standard Attention (HBM Bound) -->
		<div class="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-xs font-bold tracking-wider text-rose-400 uppercase"
					>Standard Attention (PyTorch baseline)</span
				>
				<span
					class="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300"
					>O(N²) Quadratic Memory IO</span
				>
			</div>
			<div
				class="space-y-1.5 rounded border border-slate-800/80 bg-slate-900/90 p-3 font-mono text-xs"
			>
				<div class="flex justify-between">
					<span class="text-slate-400">Total HBM Memory Traffic:</span>
					<span class="font-bold text-rose-400">
						{standardIoMB > 1024
							? `${(standardIoMB / 1024).toFixed(1)} GB`
							: `${standardIoMB.toFixed(0)} MB`}
					</span>
				</div>
				<div class="flex justify-between text-[11px]">
					<span class="text-slate-400">GPU Memory Bus:</span>
					<span class="text-slate-300">HBM3 ~2.0 TB/s (Hopper)</span>
				</div>
				<div class="flex justify-between text-[11px]">
					<span class="text-slate-400">Execution Regime:</span>
					<span class="font-bold text-rose-400">Memory Bandwidth Bound (Stalled)</span>
				</div>
			</div>
			<p class="mt-3 text-[11px] leading-relaxed text-slate-400">
				Standard attention materializes the entire {sequenceLength.toLocaleString()} × {sequenceLength.toLocaleString()}
				attention matrix in GPU HBM, exhausting bandwidth and throwing out-of-memory errors on multi-file
				agent prompts.
			</p>
		</div>

		<!-- FlashAttention (IO-Aware SRAM Tiling) -->
		<div
			class="rounded-lg border {activeVersion === 'flash3'
				? 'border-emerald-500/50 bg-emerald-950/20'
				: activeVersion === 'flash2'
					? 'border-cyan-500/40 bg-cyan-950/20'
					: 'border-amber-500/40 bg-amber-950/20'} p-4 transition-colors"
		>
			<div class="mb-2 flex items-center justify-between">
				<span
					class="text-xs font-bold tracking-wider {activeVersion === 'flash3'
						? 'text-emerald-300'
						: activeVersion === 'flash2'
							? 'text-cyan-300'
							: 'text-amber-300'} uppercase"
					>{activeVersion === 'flash3'
						? 'FlashAttention-3 Asynchronous Engine'
						: activeVersion === 'flash2'
							? 'FlashAttention-2 Engine'
							: 'FlashAttention-1 Kernel'}</span
				>
				<span
					class="rounded {activeVersion === 'flash3'
						? 'bg-emerald-500/20 text-emerald-300'
						: activeVersion === 'flash2'
							? 'bg-cyan-500/20 text-cyan-300'
							: 'bg-amber-500/20 text-amber-300'} px-2 py-0.5 font-mono text-[10px] font-bold"
					>{activeVersion === 'flash3'
						? 'TMA Async + FP8 Overlap'
						: 'O(N) Linear SRAM Tiling'}</span
				>
			</div>
			<div
				class="space-y-1.5 rounded border border-slate-800/80 bg-slate-900/90 p-3 font-mono text-xs"
			>
				<div class="flex justify-between">
					<span class="text-slate-400">Total HBM Memory Traffic:</span>
					<span
						class="font-bold {activeVersion === 'flash3'
							? 'text-emerald-400'
							: activeVersion === 'flash2'
								? 'text-cyan-400'
								: 'text-amber-400'}"
					>
						{flashIoMB > 1024
							? `${(flashIoMB / 1024).toFixed(2)} GB`
							: `${flashIoMB.toFixed(1)} MB`}
						<span class="ml-1 text-emerald-400">({ioReductionFactor}× less IO)</span>
					</span>
				</div>
				<div class="flex justify-between text-[11px]">
					<span class="text-slate-400">On-Chip SRAM Bandwidth:</span>
					<span class="text-slate-300"
						>{activeVersion === 'flash3'
							? '~33.5 TB/s (Hopper H100 SRAM)'
							: '~19.0 TB/s (Ampere A100 SRAM)'}</span
					>
				</div>
				<div class="flex justify-between text-[11px]">
					<span class="text-slate-400">Compute Utilization:</span>
					<span
						class="font-bold {activeVersion === 'flash3'
							? 'text-emerald-300'
							: activeVersion === 'flash2'
								? 'text-cyan-300'
								: 'text-amber-300'}"
					>
						{throughput.tflops} TFLOPs/s ({throughput.peakPercent}
						{activeVersion === 'flash3' ? 'H100' : 'A100'} Peak)
					</span>
				</div>
			</div>
			<p class="mt-3 text-[11px] leading-relaxed text-slate-300">
				{throughput.description}
			</p>
		</div>
	</div>

	<!-- FlashAttention-3 Hopper Architectural Pillars -->
	{#if activeVersion === 'flash3'}
		<div class="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
			<div class="mb-3 flex items-center justify-between">
				<span
					class="flex items-center gap-2 font-mono text-xs font-bold text-emerald-300 uppercase"
				>
					<span class="h-2 w-2 rounded-full bg-emerald-400"></span>
					FlashAttention-3 Asynchronous Hardware Primitives (Hopper GH100)
				</span>
				<span class="font-mono text-[10px] text-slate-400">Shah et al. (Jul 2024)</span>
			</div>
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div class="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
					<div class="font-mono text-xs font-bold text-cyan-300">1. Hardware TMA Unit</div>
					<p class="mt-1 text-[11px] text-slate-300">
						Tensor Memory Accelerator copies 5D tiles directly between HBM and Shared Memory without
						allocating SM register files or thread instructions.
					</p>
				</div>
				<div class="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
					<div class="font-mono text-xs font-bold text-emerald-300">2. Warp Specialization</div>
					<p class="mt-1 text-[11px] text-slate-300">
						1 Producer Warp Group continuously stages memory tiles while 2 Consumer Warp Groups
						issue WGMMA matrix multiplies and softmax concurrently.
					</p>
				</div>
				<div class="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
					<div class="font-mono text-xs font-bold text-amber-300">3. Softmax-GEMM Overlap</div>
					<p class="mt-1 text-[11px] text-slate-300">
						Interleaves the softmax computation of block (j) with the tensor core GEMM of block
						(j+1), completely hiding the exponential latency.
					</p>
				</div>
			</div>
			<div class="mt-3 border-t border-slate-800/80 pt-2 text-center">
				<div class="mb-1 font-mono text-[10px] text-slate-400">
					FP8 Incoherent Processing (Outlier suppression via randomized Hadamard transform):
				</div>
				<KatexMath latex={flash3HadamardFormula} displayMode={true} copyable={true} />
			</div>
		</div>
	{/if}

	<!-- Online Softmax Mathematical Derivation -->
	<div class="mt-4 rounded-lg border border-slate-800 bg-slate-950/80 p-3.5">
		<div class="mb-1 flex items-center justify-between font-mono text-[11px] text-slate-400">
			<span class="font-bold text-amber-400"
				>⚡ ONLINE SOFTMAX TILE RESCALING (Exact Numerical Equivalence):</span
			>
			<span class="text-slate-500">Milakov & Gimelshein (2018) + Dao et al. (2022–2024)</span>
		</div>
		<div class="overflow-x-auto py-1 text-center">
			<KatexMath latex={onlineSoftmaxFormula} displayMode={true} copyable={true} />
		</div>
		{#if activeVersion === 'flash2'}
			<div
				class="mt-2 border-t border-slate-800/80 pt-2 text-center font-mono text-xs text-cyan-300"
			>
				<KatexMath latex={flash2Formula} displayMode={true} copyable={true} />
			</div>
		{:else if activeVersion === 'flash3'}
			<div
				class="mt-2 border-t border-slate-800/80 pt-2 text-center font-mono text-xs text-emerald-300"
			>
				<KatexMath latex={flash3Formula} displayMode={true} copyable={true} />
			</div>
		{/if}
	</div>
</div>

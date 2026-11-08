<script lang="ts">
	type PrecisionType =
		'FP32' | 'BF16' | 'FP8_E4M3' | 'FP8_E5M2' | 'FP4_NVFP4' | 'RDNA4_WMMA' | 'GGUF_Q4KM';

	let activePrecision = $state<PrecisionType>('GGUF_Q4KM');
	let modelParamBillion = $state(70); // 70B coding agent

	interface FormatDetail {
		name: string;
		bits: number;
		bytesPerParam: number;
		sign: number;
		exp: number;
		mantissa: number;
		dynamicRange: string;
		useCase: string;
		hardware: string;
		tier: 'Datacenter' | 'Standard' | 'Client / Local Workstation';
	}

	const formats: Record<PrecisionType, FormatDetail> = {
		FP32: {
			name: 'Single Precision (FP32)',
			bits: 32,
			bytesPerParam: 4,
			sign: 1,
			exp: 8,
			mantissa: 23,
			dynamicRange: '~10^-38 to 10^38',
			useCase:
				'Historical baseline, reference weight initialization, and non-quantized accumulators.',
			hardware: 'Standard FP32 ALUs / CUDA Cores',
			tier: 'Standard'
		},
		BF16: {
			name: 'Brain Floating Point (BF16)',
			bits: 16,
			bytesPerParam: 2,
			sign: 1,
			exp: 8,
			mantissa: 7,
			dynamicRange: '~10^-38 to 10^38',
			useCase:
				'Modern pretraining standard. Preserves FP32 dynamic range, completely preventing gradient underflow without loss scaling.',
			hardware: 'Ampere, Hopper, TPU v2-v5, CDNA 2/3',
			tier: 'Standard'
		},
		FP8_E4M3: {
			name: 'FP8 (E4M3 Format)',
			bits: 8,
			bytesPerParam: 1,
			sign: 1,
			exp: 4,
			mantissa: 3,
			dynamicRange: '[-448, 448]',
			useCase:
				'Inference weights and activations. Higher precision preserves token logit rankings for code generation.',
			hardware: 'Hopper (H100/H200), Ada Lovelace, RDNA 4 WMMA',
			tier: 'Datacenter'
		},
		FP8_E5M2: {
			name: 'FP8 (E5M2 Format)',
			bits: 8,
			bytesPerParam: 1,
			sign: 1,
			exp: 5,
			mantissa: 2,
			dynamicRange: '~10^-14 to 57344',
			useCase:
				'Backward pass gradients during fine-tuning. Matches FP16 exponent width to handle gradient surges.',
			hardware: 'Hopper, Blackwell & RDNA 4 Tensor/AI Cores',
			tier: 'Datacenter'
		},
		FP4_NVFP4: {
			name: 'NVFP4 / MXFP4 Microscaling (Blackwell)',
			bits: 4,
			bytesPerParam: 0.5,
			sign: 1,
			exp: 2,
			mantissa: 1,
			dynamicRange: 'Micro-scaled per 16/32 element block with E8M0 scale vector',
			useCase:
				'2024–2025 NVIDIA Blackwell 2nd Gen Transformer Engine. Cuts a 70B coding model to 35 GB, enabling high-throughput multi-agent execution on a single B200 GPU at 20 PFLOPS compute.',
			hardware: 'NVIDIA Blackwell (B200 / GB200 NVL72)',
			tier: 'Datacenter'
		},
		RDNA4_WMMA: {
			name: 'AMD RDNA 4 WMMA (Navi 4x 2nd Gen AI Units)',
			bits: 8,
			bytesPerParam: 1,
			sign: 1,
			exp: 4,
			mantissa: 3,
			dynamicRange: 'Native FP8 (E4M3/E5M2) & INT4 matrix execution',
			useCase:
				'Local client agent execution. Double-rate Wave Matrix Multiply-Accumulate (WMMA) instructions power on-device 7B–14B coding agents (Qwen2.5-Coder) at >100 tokens/sec via ROCm 6.',
			hardware: 'AMD RDNA 4 (Navi 4x) & CDNA 3 (MI300X)',
			tier: 'Client / Local Workstation'
		},
		GGUF_Q4KM: {
			name: 'GGUF Q4_K_M (llama.cpp / Ollama / LM Studio)',
			bits: 4.5,
			bytesPerParam: 0.56,
			sign: 1,
			exp: 2,
			mantissa: 2,
			dynamicRange: 'Block-quantized with 6-bit scales per 256 weights',
			useCase:
				'The universal open-source quantization standard powering llama.cpp, Ollama, and LM Studio. Compresses a 70B coding agent into ~39 GB, enabling local multi-agent debugging on MacBook M-series unified memory and consumer workstations with zero cloud API token costs and air-gapped data privacy.',
			hardware: 'llama.cpp, Ollama, LM Studio (Apple Silicon Metal, CPU AVX-512, CUDA, Vulkan)',
			tier: 'Client / Local Workstation'
		}
	};

	let current = $derived(formats[activePrecision]);

	let weightVramGB = $derived.by(() => {
		return modelParamBillion * current.bytesPerParam;
	});

	let num80GBGpusNeeded = $derived.by(() => {
		// Minimum 80GB GPUs just for weights + 20% buffer
		return Math.max(1, Math.ceil((weightVramGB * 1.25) / 80));
	});

	const presetModels = [
		{ name: 'Qwen-Coder / DeepSeek 7B', params: 7 },
		{ name: 'Codex / StarCoder 15B', params: 15 },
		{ name: 'CodeLlama 34B', params: 34 },
		{ name: 'Llama-3 / Qwen 70B', params: 70 },
		{ name: 'DeepSeek-V3 / R1 (671B MoE / 37B active)', params: 671 }
	];
</script>

<div class="rounded-xl border border-emerald-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-emerald-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
				Hardware & Precision Deep Dive (Blackwell & RDNA 4 Era)
			</span>
			<h4 class="text-lg font-bold text-slate-100">
				Numerical Precision: Bit Layouts, Microscaling & VRAM Footprint
			</h4>
		</div>
		<div class="flex flex-wrap gap-1.5">
			{#each ['FP32', 'BF16', 'FP8_E4M3', 'FP8_E5M2', 'FP4_NVFP4', 'RDNA4_WMMA', 'GGUF_Q4KM'] as PrecisionType[] as fmt (fmt)}
				<button
					type="button"
					onclick={() => (activePrecision = fmt)}
					class="rounded px-2.5 py-1 font-mono text-xs transition-colors {activePrecision === fmt
						? 'border border-emerald-500/50 bg-emerald-500/20 font-bold text-emerald-300'
						: 'bg-slate-800/80 text-slate-400 hover:text-slate-200'}"
				>
					{#if fmt === 'FP4_NVFP4'}
						⚡ Blackwell NVFP4
					{:else if fmt === 'RDNA4_WMMA'}
						🚀 RDNA 4 WMMA
					{:else if fmt === 'GGUF_Q4KM'}
						📦 GGUF (llama.cpp / Ollama)
					{:else}
						{fmt.replace('_', ' ')}
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Bit Layout Visualizer -->
	<div class="mt-4 rounded-lg border border-slate-800/80 bg-slate-950/70 p-4">
		<div class="mb-2 flex items-center justify-between text-xs">
			<div class="flex items-center gap-2">
				<span class="font-bold text-slate-200">{current.name}</span>
				<span
					class="rounded px-2 py-0.5 text-[10px] font-semibold {current.tier === 'Datacenter'
						? 'bg-emerald-500/15 text-emerald-300'
						: current.tier === 'Client / Local Workstation'
							? 'bg-amber-500/15 text-amber-300'
							: 'bg-slate-700/50 text-slate-300'}"
				>
					{current.tier}
				</span>
			</div>
			<span class="font-mono text-emerald-400"
				>{current.bits} bits ({current.bytesPerParam} byte{current.bytesPerParam === 1
					? ''
					: 's'}/param)</span
			>
		</div>

		<!-- Bit visual bar -->
		<div
			class="flex h-8 w-full overflow-hidden rounded border border-slate-700/60 text-center font-mono text-[11px] font-bold"
		>
			<!-- Sign bit -->
			<div
				class="flex items-center justify-center bg-rose-500/80 text-white"
				style="width: {(1 / current.bits) * 100}%"
				title="Sign Bit (1 bit)"
			>
				S
			</div>
			<!-- Exponent bits -->
			<div
				class="flex items-center justify-center bg-amber-500/80 text-white"
				style="width: {(current.exp / current.bits) * 100}%"
				title="Exponent ({current.exp} bits)"
			>
				Exp ({current.exp}b)
			</div>
			<!-- Mantissa bits -->
			<div
				class="flex items-center justify-center bg-cyan-600/80 text-white"
				style="width: {(current.mantissa / current.bits) * 100}%"
				title="Mantissa ({current.mantissa} bits)"
			>
				Mantissa ({current.mantissa}b)
			</div>
		</div>

		<div
			class="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate-400"
		>
			<span class="flex items-center gap-1.5"
				><span class="h-2 w-2 rounded-full bg-rose-500"></span> Sign (1b)</span
			>
			<span class="flex items-center gap-1.5"
				><span class="h-2 w-2 rounded-full bg-amber-500"></span> Exponent Range ({current.exp}b)</span
			>
			<span class="flex items-center gap-1.5"
				><span class="h-2 w-2 rounded-full bg-cyan-600"></span> Mantissa Precision ({current.mantissa}b)</span
			>
			<span class="text-slate-400"
				>Range: <span class="text-slate-200">{current.dynamicRange}</span></span
			>
		</div>
	</div>

	<!-- Hardware Microarchitecture Deep Dive Triple Comparison (Blackwell vs RDNA 4 vs llama.cpp / Ollama) -->
	<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
		<div class="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5">
			<div class="flex items-center justify-between font-mono text-xs">
				<span class="font-bold text-emerald-300">NVIDIA Blackwell (B200 / GB200)</span>
				<span class="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300"
					>Datacenter Exascale</span
				>
			</div>
			<ul class="mt-2 space-y-1 text-[11px] text-slate-300">
				<li>
					• <strong>2nd Gen Transformer Engine:</strong> Native NVFP4 microscaling (20 PFLOPS FP4 / GPU).
				</li>
				<li>
					• <strong>Dual-Die Packaging:</strong> 10 TB/s NV-HBI inter-die coherency across 208B transistors.
				</li>
				<li>
					• <strong>NVLink-5:</strong> 1.8 TB/s bidirectional bandwidth, 72-GPU all-to-all NVL72 rack
					domain.
				</li>
			</ul>
		</div>

		<div class="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3.5">
			<div class="flex items-center justify-between font-mono text-xs">
				<span class="font-bold text-amber-300">AMD RDNA 4 (Navi 4x)</span>
				<span class="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300"
					>Client Agent Silicon</span
				>
			</div>
			<ul class="mt-2 space-y-1 text-[11px] text-slate-300">
				<li>
					• <strong>2nd Gen AI Accelerators:</strong> Double-rate Wave Matrix Multiply-Accumulate (WMMA).
				</li>
				<li>
					• <strong>Native FP8 & INT4:</strong> Runs 7B–14B coding agents locally at >100 tokens/sec.
				</li>
				<li>
					• <strong>Unified ROCm 6:</strong> Same hipBLASLt & FlashAttention stack on consumer workstations.
				</li>
			</ul>
		</div>

		<div class="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3.5">
			<div class="flex items-center justify-between font-mono text-xs">
				<span class="font-bold text-cyan-300">llama.cpp, Ollama & LM Studio</span>
				<span class="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300"
					>Local Agent Loop</span
				>
			</div>
			<ul class="mt-2 space-y-1 text-[11px] text-slate-300">
				<li>
					• <strong>GGUF k-quants:</strong> Block-level quantization with zero-copy mmap instant loading.
				</li>
				<li>
					• <strong>Apple Metal & AVX-512:</strong> Pure C++ runtime running on Mac unified memory and
					CPUs.
				</li>
				<li>
					• <strong>OpenAI Localhost APIs:</strong> localhost:11434 / 1234 drives Aider, Cline & Continue
					with zero token cost.
				</li>
			</ul>
		</div>
	</div>

	<!-- Model Memory Impact Calculator -->
	<div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div>
			<div class="mb-2 text-xs font-medium text-slate-300">
				Target Model Architecture: <span class="font-mono font-bold text-emerald-400"
					>{modelParamBillion}B parameters</span
				>
			</div>
			<div class="mb-2 flex flex-wrap gap-1.5">
				{#each presetModels as model (model.name)}
					<button
						type="button"
						onclick={() => (modelParamBillion = model.params)}
						class="rounded px-2 py-0.5 text-xs transition-colors {modelParamBillion === model.params
							? 'bg-emerald-600 font-semibold text-white'
							: 'bg-slate-800 text-slate-400 hover:text-slate-200'}"
					>
						{model.name}
					</button>
				{/each}
			</div>
			<label for="model-param-slider" class="sr-only">Model Parameter Slider</label>
			<input
				id="model-param-slider"
				type="range"
				min="7"
				max="671"
				step="1"
				bind:value={modelParamBillion}
				class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400"
			/>
		</div>

		<!-- Result Box -->
		<div
			class="flex flex-col justify-between rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5"
		>
			<div class="flex items-start justify-between">
				<div>
					<div class="text-[11px] text-slate-400">Weight Storage in VRAM:</div>
					<div class="font-mono text-2xl font-bold text-emerald-300">
						{weightVramGB.toFixed(1)} GB
					</div>
				</div>
				<div class="text-right">
					<div class="text-[11px] text-slate-400">Min 80GB GPUs:</div>
					<div class="font-mono text-xl font-bold text-slate-100">{num80GBGpusNeeded}x GPU</div>
				</div>
			</div>
			<p class="mt-2 font-mono text-[11px] text-slate-400">
				Hardware Target: <span class="text-slate-200">{current.hardware}</span>
			</p>
		</div>
	</div>

	<!-- Insight Callout -->
	<div class="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-300">
		<strong class="text-emerald-400">Agent Economics:</strong>
		{current.useCase}
	</div>
</div>

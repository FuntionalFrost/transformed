<script lang="ts">
	import KatexMath from '../KatexMath.svelte';

	let posM = $state(12); // Query token position
	let posN = $state(8); // Key token position
	let baseTheta = $state(10000); // Base theta (10k standard, 500k for RoPE scaling)

	const ropeFormula =
		'\\langle R_{\\Theta, m} q_m, R_{\\Theta, n} k_n \\rangle = g(q_m, k_n, m - n)';

	const matrixFormula =
		'R_{\\theta, m} = \\begin{pmatrix} \\cos(m\\theta) & -\\sin(m\\theta) \\\\ \\sin(m\\theta) & \\cos(m\\theta) \\end{pmatrix}';

	let relativeDist = $derived(posM - posN);

	// Angle for lowest frequency channel (d=0)
	let theta0 = $derived(1 / Math.pow(baseTheta, 0 / 64));
	let angleM = $derived((posM * theta0) % (2 * Math.PI));
	let angleN = $derived((posN * theta0) % (2 * Math.PI));
	let angleDiff = $derived(((posM - posN) * theta0) % (2 * Math.PI));

	// Theoretical attention decay: cos(delta * theta) attenuated by distance
	let relativeScore = $derived.by(() => {
		const raw = Math.cos(relativeDist * 0.15) * Math.exp(-Math.abs(relativeDist) * 0.03);
		return Math.max(-1, Math.min(1, raw));
	});

	let scorePercent = $derived(Math.round(((relativeScore + 1) / 2) * 100));
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
				Relative Position Encoding (Su et al. 2021)
			</span>
			<h4 class="text-lg font-bold text-slate-100">RoPE: Complex Vector Rotation & Invariance</h4>
		</div>
		<div class="flex items-center gap-2">
			<span class="font-mono text-xs text-slate-400">Base Θ:</span>
			<button
				type="button"
				onclick={() => (baseTheta = 10000)}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {baseTheta === 10000
					? 'bg-cyan-500 font-bold text-slate-950'
					: 'bg-slate-800 text-slate-400 hover:text-white'}"
			>
				10k (Standard)
			</button>
			<button
				type="button"
				onclick={() => (baseTheta = 500000)}
				class="rounded px-2.5 py-1 font-mono text-xs transition-colors {baseTheta === 500000
					? 'bg-cyan-500 font-bold text-slate-950'
					: 'bg-slate-800 text-slate-400 hover:text-white'}"
			>
				500k (Long Context)
			</button>
		</div>
	</div>

	<!-- Position Controls -->
	<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div>
			<div class="mb-1 flex justify-between font-mono text-xs text-slate-300">
				<span>Query Position (m):</span>
				<span class="font-bold text-cyan-400">Token index #{posM}</span>
			</div>
			<label for="pos-m-slider" class="sr-only">Query Position Slider</label>
			<input
				id="pos-m-slider"
				type="range"
				min="0"
				max="64"
				step="1"
				bind:value={posM}
				class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
			/>
		</div>

		<div>
			<div class="mb-1 flex justify-between font-mono text-xs text-slate-300">
				<span>Key Position (n):</span>
				<span class="font-bold text-emerald-400">Token index #{posN}</span>
			</div>
			<label for="pos-n-slider" class="sr-only">Key Position Slider</label>
			<input
				id="pos-n-slider"
				type="range"
				min="0"
				max="64"
				step="1"
				bind:value={posN}
				class="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-400"
			/>
		</div>
	</div>

	<!-- Rotation Visualization Cards -->
	<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
		<!-- Query Rotation Vector -->
		<div class="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-3.5 text-center">
			<div class="font-mono text-xs font-bold text-cyan-300">Query Rotation (R_θ,m)</div>
			<div class="mt-2 font-mono text-2xl font-black text-white">
				{(angleM * (180 / Math.PI)).toFixed(1)}°
			</div>
			<div class="mt-1 font-mono text-[11px] text-slate-400">Rotated by m · θ_i</div>
		</div>

		<!-- Key Rotation Vector -->
		<div class="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-center">
			<div class="font-mono text-xs font-bold text-emerald-300">Key Rotation (R_θ,n)</div>
			<div class="mt-2 font-mono text-2xl font-black text-white">
				{(angleN * (180 / Math.PI)).toFixed(1)}°
			</div>
			<div class="mt-1 font-mono text-[11px] text-slate-400">Rotated by n · θ_i</div>
		</div>

		<!-- Relative Shift Invariance -->
		<div class="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3.5 text-center">
			<div class="font-mono text-xs font-bold text-amber-300">Relative Delta (m - n)</div>
			<div
				class="mt-2 font-mono text-2xl font-black {relativeDist >= 0
					? 'text-cyan-300'
					: 'text-rose-400'}"
			>
				{relativeDist > 0 ? `+${relativeDist}` : relativeDist} tokens
			</div>
			<div class="mt-1 font-mono text-[11px] text-slate-400">
				ΔAngle = {(angleDiff * (180 / Math.PI)).toFixed(1)}°
			</div>
		</div>
	</div>

	<!-- Relative Affinity Bar -->
	<div class="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3.5">
		<div class="flex items-center justify-between font-mono text-xs">
			<span class="text-slate-400">Pairwise Relative Kernel Salience:</span>
			<span class="font-bold text-cyan-300"
				>{scorePercent}% (affinity factor: {relativeScore.toFixed(3)})</span
			>
		</div>
		<div class="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
			<div
				class="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
				style="width: {scorePercent}%"
			></div>
		</div>
		<div class="mt-1.5 flex justify-between font-mono text-[10px] text-slate-500">
			<span>Remote Tokens (Decayed Salience)</span>
			<span>Local Syntax Coupling (Maximum Relevance)</span>
		</div>
	</div>

	<!-- Mathematical Proof Banner -->
	<div class="mt-4 rounded-lg border border-slate-800 bg-slate-950/80 p-3.5 text-center">
		<div class="mb-1 font-mono text-[11px] text-slate-400">
			RoPE 2D Rotation Matrix & Inner Product Invariance Property:
		</div>
		<div class="grid grid-cols-1 gap-2 overflow-x-auto py-1 md:grid-cols-2">
			<KatexMath latex={matrixFormula} displayMode={true} copyable={true} />
			<KatexMath latex={ropeFormula} displayMode={true} copyable={true} />
		</div>
		<div class="mt-1 font-mono text-[10px] text-slate-500">
			Dot products between rotated queries and keys depend strictly on relative token displacement
			(m - n), enabling models to traverse massive codebases without position degradation.
		</div>
	</div>
</div>

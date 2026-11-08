<script lang="ts">
	import KatexMath from '../KatexMath.svelte';

	interface Props {
		selectedDrug?: 'lisdexamfetamine' | 'methylphenidate' | 'dextroamphetamine' | 'acetylcholine';
	}

	let { selectedDrug = $bindable('lisdexamfetamine') }: Props = $props();

	// Neuromodulator tone level: 0 (Severe Inattention / ADHD), 50 (Optimal Focus / Therapeutic Equilibrium), 100 (Hyperarousal / Perseveration)
	let catecholamineLevel = $state(50);

	// Catecholamine inverted-U calculations (Arnsten & Goldman-Rakic Prefrontal Cortex Model)
	let daSignal = $derived.by(() => {
		// D1 dopamine receptor mediated signal enhancement (Gaussian curve around 50)
		return Math.exp(-Math.pow((catecholamineLevel - 55) / 28, 2));
	});

	let neGating = $derived.by(() => {
		// Alpha-2A noradrenergic receptor mediated noise suppression
		return Math.exp(-Math.pow((catecholamineLevel - 48) / 30, 2));
	});

	let signalToNoiseRatio = $derived.by(() => {
		const raw = daSignal * neGating * 100;
		return Math.max(8, Math.round(raw));
	});

	// Equivalent Softmax Temperature in Transformer Attention
	let effectiveTemperature = $derived.by(() => {
		// Low catecholamines = high entropy / high temp (scattered attention)
		// High catecholamines = low entropy / sharp temperature (laser focus)
		if (catecholamineLevel <= 10) return 3.5;
		const temp = 2.2 - (catecholamineLevel / 100) * 1.8;
		return Math.max(0.35, Number(temp.toFixed(2)));
	});

	// Attention Entropy H(P)
	let attentionEntropy = $derived.by(() => {
		const h = 2.8 * (effectiveTemperature / 2.0);
		return Number(h.toFixed(2));
	});

	// Pharmacodynamics metadata
	const drugProfiles = {
		lisdexamfetamine: {
			brand: 'Elvanse / Vyvanse (Lisdexamfetamine Dimesylate)',
			class: 'Long-Acting Dextroamphetamine Prodrug',
			bioactivation:
				'Enzymatically hydrolyzed in red blood cells into L-lysine and active D-amphetamine.',
			mechanism:
				'Inhibits VMAT2, activates TAAR1, and reverses DAT/NET to induce carrier-mediated dopamine and norepinephrine efflux.',
			siliconAnalogue: 'FlashAttention-2 Streaming SRAM Tiling',
			analogueDesc:
				'Continuous, smooth rate-limited supply of high-salience attention states directly in local register memory, eliminating catastrophic context loss without volatile memory spikes.',
			targets: ['DAT (Reversal)', 'NET (Reversal)', 'TAAR1 (Agonist)', 'VMAT2 (Inhibitor)'],
			halfLife: '10–12h therapeutic duration'
		},
		methylphenidate: {
			brand: 'Ritalin / Concerta (Methylphenidate HCl)',
			class: 'Dopamine & Norepinephrine Reuptake Inhibitor (NDRI)',
			bioactivation:
				'Rapidly absorbed; binds extracellular active site of monoamine transporters directly.',
			mechanism:
				'Competitively blocks the dopamine transporter (DAT) and norepinephrine transporter (NET), preventing reuptake without inducing reverse transport.',
			siliconAnalogue: 'KV-Cache Retention & Prefix Caching',
			analogueDesc:
				'Prevents the clearance of essential contextual keys and values from working memory buffers across multi-turn agent execution loops.',
			targets: ['DAT (Blocker)', 'NET (Blocker)', '5-HT1A (Minor)'],
			halfLife: '3–4h (IR) / 8–12h (OROS)'
		},
		dextroamphetamine: {
			brand: 'Dexedrine / Adderall Component (D-Amphetamine)',
			class: 'Immediate-Release Central Nervous System Stimulant',
			bioactivation:
				'Direct pharmacologically active enantiomer; crosses blood-brain barrier rapidly.',
			mechanism:
				'High affinity for vesicular monoamine transporter 2 (VMAT2), collapsing the vesicular proton gradient to release cytosolic dopamine into the synaptic cleft.',
			siliconAnalogue: 'High-Temperature Softmax Sharpener & Top-1 Greedy Search',
			analogueDesc:
				'Dramatically narrows attention distribution P to dominant eigenvectors, enforcing immediate task adherence and eliminating extraneous branch exploration.',
			targets: ['VMAT2', 'DAT', 'NET', 'TAAR1'],
			halfLife: '9–11h'
		},
		acetylcholine: {
			brand: 'Basal Forebrain Cholinergic Projection (Endogenous Neuromodulator)',
			class: 'Perceptual Salience & Sensory Precision Modulator',
			bioactivation: 'Synthesized from choline and acetyl-CoA by choline acetyltransferase (ChAT).',
			mechanism:
				'Activates nicotinic (nAChR) and muscarinic (mAChR) receptors across prefrontal and parietal cortices to amplify bottom-up sensory salience.',
			siliconAnalogue: 'Query Matrix Linear Projection (Q = X · W_Q)',
			analogueDesc:
				'Determines which tokens in the external input stream generate active search queries, pulling relevant long-range dependencies into working memory.',
			targets: ['α4β2 nAChR', 'α7 nAChR', 'M1 mAChR'],
			halfLife: 'Millisecond enzymatic clearance (AChE)'
		}
	};

	let activeProfile = $derived(drugProfiles[selectedDrug]);

	const catecholamineFormula =
		'\\text{SNR}_{\\text{PFC}} = \\frac{\\mu_{\\text{signal}}(D_1, \\alpha_{2A})}{\\sigma_{\\text{noise}}^2} \\quad \\longleftrightarrow \\quad P_{ij} = \\text{softmax}\\left(\\frac{Q_i K_j^T}{\\tau \\sqrt{d_k}}\\right)';
</script>

<div
	class="tensor-bracket rounded-xl border border-cyan-500/40 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm"
>
	<!-- Header -->
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-cyan-400 uppercase"
			>
				<span class="h-2 w-2 animate-ping rounded-full bg-cyan-400"></span>
				Cognitive Neuropsychology & Computational Parallels
			</span>
			<h4 class="flex items-center gap-2 text-lg font-bold text-slate-100">
				<span>The Dual Nature of Attention: Silicon vs. Synapse</span>
			</h4>
		</div>
		<div class="flex items-center gap-2">
			<span
				class="rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-300"
			>
				ADHD · Catecholamines · Executive Control
			</span>
		</div>
	</div>

	<!-- Arnsten Prefrontal Cortex Inverted-U Slider (Dopamine / Norepinephrine Tone) -->
	<div class="mt-5 rounded-lg border border-slate-800 bg-slate-950/80 p-4">
		<div class="mb-2 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
			<span class="flex items-center gap-1.5 font-bold text-slate-300">
				<span>🧠</span>
				<span>Prefrontal Catecholamine Tone (Dopamine & Norepinephrine):</span>
			</span>
			<span
				class="font-bold {catecholamineLevel < 35
					? 'text-rose-400'
					: catecholamineLevel > 75
						? 'text-amber-400'
						: 'text-emerald-400'}"
			>
				{#if catecholamineLevel < 35}
					Deficient Tone (ADHD / Inattention & High Noise Floor)
				{:else if catecholamineLevel > 75}
					Hyper-Arousal (Rigid Fixation & Stress Gating)
				{:else}
					Optimal Equilibrium (High Executive Working Memory & Signal Focus)
				{/if}
			</span>
		</div>

		<label for="catecholamine-slider" class="sr-only">Catecholamine Tone Slider</label>
		<input
			id="catecholamine-slider"
			type="range"
			min="0"
			max="100"
			step="1"
			bind:value={catecholamineLevel}
			class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-cyan-400"
		/>

		<!-- Scale Annotations -->
		<div class="mt-1 flex justify-between font-mono text-[10px] text-slate-500">
			<span>0: Severe Inattention / Executive Drift</span>
			<span>50: Therapeutic Target (Elvanse / Ritalin)</span>
			<span>100: Excessive Stimulation</span>
		</div>

		<!-- Real-time Mathematical Equivalence Metrics -->
		<div class="mt-4 grid grid-cols-2 gap-2.5 font-mono text-xs sm:grid-cols-4">
			<div class="rounded border border-slate-800 bg-slate-900/90 p-2.5">
				<div class="text-[10px] text-slate-400">Biological SNR</div>
				<div class="mt-1 text-sm font-bold text-cyan-300">{signalToNoiseRatio}%</div>
				<div class="text-[10px] text-slate-500">D₁/α₂A receptor ratio</div>
			</div>

			<div class="rounded border border-slate-800 bg-slate-900/90 p-2.5">
				<div class="text-[10px] text-slate-400">Softmax Temperature (τ)</div>
				<div class="mt-1 text-sm font-bold text-amber-300">{effectiveTemperature}</div>
				<div class="text-[10px] text-slate-500">Inverse attention gain</div>
			</div>

			<div class="rounded border border-slate-800 bg-slate-900/90 p-2.5">
				<div class="text-[10px] text-slate-400">Attention Entropy H(P)</div>
				<div class="mt-1 text-sm font-bold text-violet-300">{attentionEntropy} nats</div>
				<div class="text-[10px] text-slate-500">Dispersal of focus</div>
			</div>

			<div class="rounded border border-slate-800 bg-slate-900/90 p-2.5">
				<div class="text-[10px] text-slate-400">Distractor Resistance</div>
				<div
					class="mt-1 font-bold {signalToNoiseRatio > 60
						? 'text-emerald-400'
						: 'text-rose-400'} text-sm"
				>
					{signalToNoiseRatio > 60 ? 'High (Inhibition Active)' : 'Vulnerable (Context Intrusion)'}
				</div>
				<div class="text-[10px] text-slate-500">Prefrontal lateral gating</div>
			</div>
		</div>
	</div>

	<!-- Pharmacodynamics of Attention Therapeutics -->
	<div class="mt-6">
		<div class="mb-3 flex items-center justify-between font-mono text-xs text-slate-300">
			<span class="flex items-center gap-1.5 font-bold text-cyan-300">
				<span class="h-2 w-2 rounded-full bg-cyan-400"></span>
				<span>NEUROCHEMICAL MECHANISMS & COMPUTATIONAL ANALOGUES:</span>
			</span>
			<span class="text-[11px] text-slate-500"
				>Prefrontal receptor kinetics vs. Transformer attention layers</span
			>
		</div>

		<!-- Neurochemical Agent Selector Tabs -->
		<div class="mb-3 flex flex-wrap gap-1.5 font-mono text-xs">
			<button
				type="button"
				onclick={() => (selectedDrug = 'lisdexamfetamine')}
				class="rounded px-3 py-1.5 transition-all {selectedDrug === 'lisdexamfetamine'
					? 'bg-amber-500 font-bold text-slate-950 shadow-md shadow-amber-500/30'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				Lisdexamfetamine (Elvanse)
			</button>
			<button
				type="button"
				onclick={() => (selectedDrug = 'methylphenidate')}
				class="rounded px-3 py-1.5 transition-all {selectedDrug === 'methylphenidate'
					? 'bg-cyan-500 font-bold text-slate-950 shadow-md shadow-cyan-500/30'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				Methylphenidate (Ritalin)
			</button>
			<button
				type="button"
				onclick={() => (selectedDrug = 'dextroamphetamine')}
				class="rounded px-3 py-1.5 transition-all {selectedDrug === 'dextroamphetamine'
					? 'bg-rose-500 font-bold text-white shadow-md shadow-rose-500/30'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				D-Amphetamine (Adderall)
			</button>
			<button
				type="button"
				onclick={() => (selectedDrug = 'acetylcholine')}
				class="rounded px-3 py-1.5 transition-all {selectedDrug === 'acetylcholine'
					? 'bg-violet-500 font-bold text-white shadow-md shadow-violet-500/30'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				Acetylcholine (Sensory Gating)
			</button>
		</div>

		<!-- Drug Profile Detail Card -->
		<div
			class="relative space-y-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 p-4"
		>
			<!-- Ambient Synaptic Cleft & Receptor Channel Schematic in Background -->
			<div class="pointer-events-none absolute -right-2 -bottom-2 z-0 opacity-15 sm:opacity-20">
				<svg class="h-32 w-32" viewBox="0 0 120 120" fill="none">
					<!-- Presynaptic Axon Terminal -->
					<path
						d="M 20 10 C 50 10 70 30 70 50 C 70 65 50 70 30 70"
						stroke="#06b6d4"
						stroke-width="1.5"
						fill="none"
					/>
					<!-- Neurotransmitter Vesicles -->
					<circle cx="35" cy="30" r="3" fill="#06b6d4" />
					<circle cx="48" cy="25" r="2.5" fill="#06b6d4" />
					<circle cx="45" cy="40" r="3" fill="#38bdf8" />
					<circle cx="58" cy="38" r="2.5" fill="#38bdf8" />
					<!-- Synaptic Cleft Transmitter Efflux -->
					<circle cx="68" cy="55" r="1.8" fill="#f59e0b" />
					<circle cx="75" cy="62" r="1.8" fill="#f59e0b" />
					<circle cx="72" cy="70" r="1.8" fill="#f59e0b" />
					<!-- Postsynaptic Density & Dendritic Spine -->
					<path
						d="M 85 45 C 90 55 95 75 90 95 C 80 110 50 110 40 110"
						stroke="#10b981"
						stroke-width="1.5"
						fill="none"
					/>
					<!-- Receptors (D1 / Alpha-2A) -->
					<rect x="80" y="52" width="6" height="4" rx="1" fill="#10b981" />
					<rect x="83" y="66" width="6" height="4" rx="1" fill="#10b981" />
					<rect x="80" y="80" width="6" height="4" rx="1" fill="#10b981" />
				</svg>
			</div>

			<div
				class="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5"
			>
				<div>
					<h5 class="text-sm font-bold text-slate-100">{activeProfile.brand}</h5>
					<p class="font-mono text-[11px] text-cyan-400">
						{activeProfile.class} · {activeProfile.halfLife}
					</p>
				</div>
				<div class="flex flex-wrap gap-1">
					{#each activeProfile.targets as target (target)}
						<span
							class="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300"
						>
							{target}
						</span>
					{/each}
				</div>
			</div>

			<!-- Biological Pharmacodynamics vs Silicon Equivalence -->
			<div class="grid grid-cols-1 gap-3 text-xs leading-relaxed md:grid-cols-2">
				<div class="rounded-lg border border-amber-500/25 bg-amber-950/15 p-3">
					<div class="mb-1 font-mono text-[10px] font-bold text-amber-300 uppercase">
						Biological Pharmacodynamics:
					</div>
					<p class="text-slate-300">{activeProfile.mechanism}</p>
					<p class="mt-2 font-mono text-[11px] text-slate-400 italic">
						{activeProfile.bioactivation}
					</p>
				</div>

				<div class="rounded-lg border border-cyan-500/25 bg-cyan-950/15 p-3">
					<div class="mb-1 font-mono text-[10px] font-bold text-cyan-300 uppercase">
						Computational Analogue in LLM Agents:
					</div>
					<div class="mb-1 font-mono font-bold text-white">{activeProfile.siliconAnalogue}</div>
					<p class="text-slate-300">{activeProfile.analogueDesc}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Comparative Synthesis Table: Neurobiology ↔ Transformer Architecture -->
	<div class="mt-6 rounded-lg border border-slate-800 bg-slate-950/80 p-4">
		<h5 class="mb-3 flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300 uppercase">
			<span>⚡</span>
			<span
				>ARCHITECTURAL SYNTHESIS: TRANSCENDING INATTENTION IN BIOLOGICAL & ARTIFICIAL SYSTEMS</span
			>
		</h5>

		<div class="overflow-x-auto">
			<table class="w-full text-left font-mono text-[11px] text-slate-300">
				<thead>
					<tr class="border-b border-slate-800 text-slate-500">
						<th class="py-2 pr-3">Neuropsychological Phenomenon</th>
						<th class="px-3 py-2">Biological Substrate (ADHD / PFC)</th>
						<th class="px-3 py-2">Silicon Failure Mode (Early AI)</th>
						<th class="py-2 pl-3">Autonomous Agent Solution</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-800/60">
					<tr>
						<td class="py-2.5 pr-3 font-bold text-rose-300">Working Memory Overflow</td>
						<td class="px-3 py-2.5">7 ± 2 item limit (Miller); prefrontal buffer saturation</td>
						<td class="px-3 py-2.5">Catastrophic forgetting in RNNs/LSTMs; vanishing gradients</td>
						<td class="py-2.5 pl-3 font-bold text-cyan-300"
							>KV Caching & 1M+ Token RoPE Position Embeddings</td
						>
					</tr>
					<tr>
						<td class="py-2.5 pr-3 font-bold text-rose-300">Distractor Intrusion</td>
						<td class="px-3 py-2.5">Deficient α2A-adrenergic tone; uninhibited sensory inputs</td>
						<td class="px-3 py-2.5">Attention entropy collapse; irrelevant tokens skewing output</td
						>
						<td class="py-2.5 pl-3 font-bold text-cyan-300"
							>Scaled Dot-Product Softmax & Temperature Gating</td
						>
					</tr>
					<tr>
						<td class="py-2.5 pr-3 font-bold text-rose-300">Memory Exhaustion Stalls</td>
						<td class="px-3 py-2.5">Cognitive fatigue under sustained analytical workload</td>
						<td class="px-3 py-2.5"
							>O(N²) quadratic GPU HBM bus saturation & out-of-memory crashes</td
						>
						<td class="py-2.5 pl-3 font-bold text-emerald-300"
							>FlashAttention-1 & 2 Online Softmax SRAM Tiling</td
						>
					</tr>
					<tr>
						<td class="py-2.5 pr-3 font-bold text-rose-300">Impulsive Execution Error</td>
						<td class="px-3 py-2.5">Executive dysfunction; lack of pre-action impulse inhibition</td
						>
						<td class="px-3 py-2.5">Single forward-pass hallucination; premature code overwrites</td
						>
						<td class="py-2.5 pl-3 font-bold text-violet-300"
							>Test-Time Compute Search (o1/R1) & ReAct Verifiers</td
						>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<!-- Mathematical Homology Equation -->
	<div class="mt-4 rounded-lg border border-slate-800 bg-slate-950/90 p-3.5 text-center">
		<div class="mb-1 font-mono text-[11px] text-slate-400">
			Unified Formulation: Catecholaminergic SNR Gating ⟷ Scaled Dot-Product Softmax
		</div>
		<div class="overflow-x-auto py-1">
			<KatexMath latex={catecholamineFormula} displayMode={true} copyable={true} />
		</div>
	</div>
</div>

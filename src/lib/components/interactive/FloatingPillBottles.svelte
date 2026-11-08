<script lang="ts">
	interface Props {
		onSelectDrug?: (
			drug: 'lisdexamfetamine' | 'methylphenidate' | 'dextroamphetamine' | 'acetylcholine'
		) => void;
	}

	let { onSelectDrug }: Props = $props();

	interface BottleData {
		id: string;
		drugKey: 'lisdexamfetamine' | 'methylphenidate' | 'dextroamphetamine' | 'acetylcholine';
		brandName: string;
		genericName: string;
		strength: string;
		rxNumber: string;
		chemicalFormula: string;
		indication: string;
		siliconAnalogue: string;
		accentColor: string;
		animationClass: string;
		rotationDeg: number;
	}

	const bottles: BottleData[] = [
		{
			id: 'elvanse',
			drugKey: 'lisdexamfetamine',
			brandName: 'ELVANSE®',
			genericName: 'Lisdexamfetamine Dimesylate',
			strength: '50 mg',
			rxNumber: 'RX-77492-CTX',
			chemicalFormula: 'C₁₅H₂₅N₃O₃',
			indication: 'ADHD Prefrontal Desynchrony & Context Drift',
			siliconAnalogue: 'Rate-Limited SRAM Tiling (FlashAttention)',
			accentColor: '#06b6d4',
			animationClass: 'animate-float-1',
			rotationDeg: -5
		},
		{
			id: 'adderall',
			drugKey: 'dextroamphetamine',
			brandName: 'ADDERALL XR®',
			genericName: 'Mixed Amphetamine Salts',
			strength: '25 mg',
			rxNumber: 'RX-49102-MTP',
			chemicalFormula: 'C₉H₁₃N',
			indication: 'Low Signal-to-Noise & Multi-Branch Distraction',
			siliconAnalogue: 'Multi-Token Lookahead & Softmax Sharpener',
			accentColor: '#f59e0b',
			animationClass: 'animate-float-2',
			rotationDeg: 6
		},
		{
			id: 'ritalin',
			drugKey: 'methylphenidate',
			brandName: 'RITALIN® / CONCERTA',
			genericName: 'Methylphenidate HCl',
			strength: '20 mg',
			rxNumber: 'RX-83210-KVC',
			chemicalFormula: 'C₁₄H₁₉NO₂',
			indication: 'Working Memory Decay & Rapid Context Eviction',
			siliconAnalogue: 'DAT/NET Blockade ⟷ Persistent KV-Cache',
			accentColor: '#ec4899',
			animationClass: 'animate-float-3',
			rotationDeg: 4
		},
		{
			id: 'dexedrine',
			drugKey: 'dextroamphetamine',
			brandName: 'DEXEDRINE®',
			genericName: 'D-Amphetamine Sulfate',
			strength: '15 mg',
			rxNumber: 'RX-12093-OPT',
			chemicalFormula: 'C₉H₁₃N · ½H₂SO₄',
			indication: 'Executive Fatigue & Inverted-U Sub-Optimal Tone',
			siliconAnalogue: 'VMAT2 Cytosolic Release ⟷ Greedy Next-Token Focus',
			accentColor: '#10b981',
			animationClass: 'animate-float-4',
			rotationDeg: -6
		}
	];

	function handleBottleClick(bottle: BottleData) {
		if (onSelectDrug) {
			onSelectDrug(bottle.drugKey);
		}
	}
</script>

<!-- Shared Reusable SVG Definitions for Classic Prescription Bottles -->
<svg class="sr-only" aria-hidden="true">
	<defs>
		<!-- White Safety Cap Gradient (Crisp child-resistant ribbed cap with 3D cylindrical lighting) -->
		<linearGradient id="whiteCapGrad" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0%" stop-color="#cbd5e1" />
			<stop offset="15%" stop-color="#f8fafc" />
			<stop offset="40%" stop-color="#ffffff" />
			<stop offset="70%" stop-color="#f1f5f9" />
			<stop offset="90%" stop-color="#e2e8f0" />
			<stop offset="100%" stop-color="#94a3b8" />
		</linearGradient>

		<!-- Pure Translucent Golden-Amber Cylinder Gradient (Exact match to sunny pharmacy vial photo) -->
		<linearGradient id="amberBodyGrad" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0%" stop-color="#d97706" stop-opacity="0.88" />
			<stop offset="8%" stop-color="#f59e0b" stop-opacity="0.78" />
			<stop offset="25%" stop-color="#fbbf24" stop-opacity="0.68" />
			<stop offset="50%" stop-color="#fef08a" stop-opacity="0.62" />
			<stop offset="75%" stop-color="#fbbf24" stop-opacity="0.72" />
			<stop offset="92%" stop-color="#f59e0b" stop-opacity="0.82" />
			<stop offset="100%" stop-color="#b45309" stop-opacity="0.92" />
		</linearGradient>

		<!-- Gloss Specular Highlight Stripe -->
		<linearGradient id="glassGloss" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0%" stop-color="#ffffff" stop-opacity="0.75" />
			<stop offset="40%" stop-color="#ffffff" stop-opacity="0.3" />
			<stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
		</linearGradient>

		<!-- Yellow Oblong Tablet / Caplet Gradient (Exact match to caplets in reference photo) -->
		<linearGradient id="yellowTabletGrad" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#fef08a" />
			<stop offset="35%" stop-color="#fde047" />
			<stop offset="70%" stop-color="#facc15" />
			<stop offset="100%" stop-color="#ca8a04" />
		</linearGradient>

		<!-- Red/Magenta Dome Gradient (Iconic 💊 Emoji Half) -->
		<linearGradient id="capsuleRedGrad" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#fb7185" />
			<stop offset="25%" stop-color="#f43f5e" />
			<stop offset="65%" stop-color="#e11d48" />
			<stop offset="100%" stop-color="#9f1239" />
		</linearGradient>

		<!-- Peach/Cream Dome Gradient (Iconic 💊 Emoji Half) -->
		<linearGradient id="capsulePeachGrad" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#fef3c7" />
			<stop offset="30%" stop-color="#fed7aa" />
			<stop offset="70%" stop-color="#fdba74" />
			<stop offset="100%" stop-color="#ea580c" stop-opacity="0.75" />
		</linearGradient>

		<!-- 3D Emoji Capsule Drop Shadow Filter -->
		<filter id="capsuleShadow" x="-20%" y="-20%" width="140%" height="140%">
			<feDropShadow dx="0" dy="1.4" stdDeviation="1" flood-color="#450a0a" flood-opacity="0.45" />
		</filter>

		<!-- Soft Tablet Drop Shadow Filter -->
		<filter id="tabletShadow" x="-20%" y="-20%" width="140%" height="140%">
			<feDropShadow dx="0" dy="1.5" stdDeviation="1" flood-color="#78350f" flood-opacity="0.4" />
		</filter>
	</defs>
</svg>

<!-- Snippet for Rendering a High-Fidelity Classic Prescription Bottle (Pure Translucent Amber Glass) -->
{#snippet prescriptionBottle(scale = 1, showPillEmoji = true)}
	<div
		class="relative flex flex-col items-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] filter"
		style="transform: scale({scale});"
	>
		<svg
			class="h-44 w-20"
			viewBox="0 0 100 220"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<!-- Amber Cylinder Body (Translucent Plastic) -->
			<rect
				x="13"
				y="33"
				width="74"
				height="174"
				rx="10"
				fill="url(#amberBodyGrad)"
				stroke="#d97706"
				stroke-width="1.2"
			/>

			<!-- Pure Translucent Golden Amber Interior with Light Refraction (Sunny Pharmacy Vial) -->
			<ellipse cx="50" cy="195" rx="29" ry="7.5" fill="#fef08a" opacity="0.48" />
			<ellipse cx="50" cy="120" rx="24" ry="48" fill="#fef08a" opacity="0.22" />
			<ellipse cx="50" cy="65" rx="26" ry="12" fill="#fef08a" opacity="0.18" />

			<!-- Specular Light Reflection Streaks (Gloss Finish) -->
			<rect x="17" y="34" width="6" height="169" rx="3" fill="url(#glassGloss)" opacity="0.75" />
			<rect x="76" y="34" width="3.5" height="169" rx="1.5" fill="#ffffff" opacity="0.3" />

			<!-- Base Rim Curve & Bottom Punt Concave Contour -->
			<path
				d="M 22 203 Q 50 207 78 203"
				stroke="#a16207"
				stroke-width="1.5"
				fill="none"
				opacity="0.7"
			/>
			<path
				d="M 26 198 Q 50 193 74 198"
				stroke="#ca8a04"
				stroke-width="1.2"
				fill="none"
				opacity="0.45"
			/>

			<!-- White Push-Down & Turn Safety Cap with Fine Vertical Ribbing -->
			<!-- Overhanging Bottom Locking Lip -->
			<rect
				x="7"
				y="27"
				width="86"
				height="7"
				rx="2"
				fill="url(#whiteCapGrad)"
				stroke="#94a3b8"
				stroke-width="0.8"
			/>
			<!-- Ribbed Cylindrical Barrel -->
			<rect
				x="8"
				y="8"
				width="84"
				height="20"
				fill="url(#whiteCapGrad)"
				stroke="#94a3b8"
				stroke-width="0.8"
			/>
			<!-- Closely-spaced Clean Vertical Ridges -->
			{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] as idx (idx)}
				<line
					x1={12.5 + idx * 3.8}
					y1="9"
					x2={12.5 + idx * 3.8}
					y2="27"
					stroke="#94a3b8"
					stroke-width="1.1"
					opacity="0.8"
				/>
			{/each}
			<!-- Flat Smooth Top Disc Rim -->
			<rect
				x="7"
				y="5"
				width="86"
				height="5"
				rx="2.5"
				fill="#ffffff"
				stroke="#94a3b8"
				stroke-width="0.8"
			/>
		</svg>

		{#if showPillEmoji}
			<!-- Floating Standard Pill Emoji 💊 Beside Bottle -->
			<div
				class="pointer-events-none absolute -right-4 bottom-3 text-2xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] filter"
			>
				💊
			</div>
		{/if}
	</div>
{/snippet}

<!-- Hero Ambient Flanking Bottles (Placed directly in the Hero negative space flanking the title) -->
<div
	class="pointer-events-none absolute top-8 -left-8 -z-10 hidden opacity-50 lg:block xl:-left-24"
	aria-hidden="true"
>
	<div class="animate-float-1">
		{@render prescriptionBottle(0.92, true)}
	</div>
</div>

<div
	class="pointer-events-none absolute top-8 -right-8 -z-10 hidden opacity-50 lg:block xl:-right-24"
	aria-hidden="true"
>
	<div class="animate-float-2">
		{@render prescriptionBottle(0.92, true)}
	</div>
</div>

<!-- In-Page Responsive Neuro Dispensary Shelf (Relative z-10, Cleanly Anchored) -->
<div
	class="relative z-10 mx-auto mt-6 max-w-4xl overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-4 shadow-2xl backdrop-blur-md"
>
	<!-- Header Bar -->
	<div class="flex items-center gap-2 border-b border-slate-800/80 pb-3">
		<span class="text-xl">💊</span>
		<h3 class="font-mono text-sm font-bold tracking-wider text-amber-300 uppercase">
			Neuro-Pharmacology Dispensary & Attention Therapeutics
		</h3>
	</div>

	<!-- Interactive Shelf of Classic Prescription Bottles -->
	<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each bottles as bottle (bottle.id)}
			<button
				type="button"
				onclick={() => handleBottleClick(bottle)}
				class="group relative flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:bg-slate-900/90 hover:shadow-xl"
			>
				<!-- Mini SVG Prescription Bottle Matching Reference Image -->
				<div class="relative mb-3 flex flex-col items-center">
					<svg
						class="h-20 w-11 drop-shadow-md"
						viewBox="0 0 100 220"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<!-- Amber Body -->
						<rect
							x="13"
							y="33"
							width="74"
							height="174"
							rx="10"
							fill="url(#amberBodyGrad)"
							stroke="#d97706"
							stroke-width="1.5"
						/>
						<!-- Pure Translucent Golden Amber Interior with Light Refraction -->
						<ellipse cx="50" cy="195" rx="28" ry="7" fill="#fef08a" opacity="0.45" />
						<ellipse cx="50" cy="120" rx="22" ry="40" fill="#fef08a" opacity="0.2" />
						<!-- Gloss Highlights -->
						<rect
							x="17"
							y="34"
							width="6"
							height="169"
							rx="3"
							fill="url(#glassGloss)"
							opacity="0.75"
						/>
						<!-- White Cap with Ribbing -->
						<rect
							x="7"
							y="27"
							width="86"
							height="7"
							rx="2"
							fill="url(#whiteCapGrad)"
							stroke="#94a3b8"
							stroke-width="0.8"
						/>
						<rect
							x="8"
							y="8"
							width="84"
							height="20"
							fill="url(#whiteCapGrad)"
							stroke="#94a3b8"
							stroke-width="0.8"
						/>
						{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as idx (idx)}
							<line
								x1={13 + idx * 7.6}
								y1="9"
								x2={13 + idx * 7.6}
								y2="27"
								stroke="#94a3b8"
								stroke-width="1.3"
								opacity="0.85"
							/>
						{/each}
						<rect
							x="7"
							y="5"
							width="86"
							height="5"
							rx="2.5"
							fill="#ffffff"
							stroke="#94a3b8"
							stroke-width="0.8"
						/>
					</svg>

					<!-- Floating Standard Pill Emoji 💊 -->
					<div class="absolute -right-3 bottom-1 text-lg drop-shadow-md filter">💊</div>
				</div>

				<!-- Text Information -->
				<div class="font-mono text-xs font-bold" style="color: {bottle.accentColor};">
					{bottle.brandName}
				</div>
				<div class="mt-0.5 font-mono text-[10px] text-slate-300">
					{bottle.strength}
				</div>
				<div class="mt-1 line-clamp-2 text-[10px] leading-tight text-slate-400">
					{bottle.indication}
				</div>

				<div
					class="mt-2.5 rounded bg-slate-950/80 px-2 py-0.5 font-mono text-[9px] text-cyan-400 transition-colors group-hover:bg-cyan-950 group-hover:text-cyan-200"
				>
					Calibrate Neuro Lab →
				</div>
			</button>
		{/each}
	</div>
</div>

<style>
	/* Background floating physics animations */
	@keyframes float1 {
		0%,
		100% {
			transform: translateY(0px) rotate(-5deg);
		}
		50% {
			transform: translateY(-18px) rotate(-1deg);
		}
	}

	@keyframes float2 {
		0%,
		100% {
			transform: translateY(0px) rotate(6deg);
		}
		50% {
			transform: translateY(-22px) rotate(9deg);
		}
	}

	@keyframes float3 {
		0%,
		100% {
			transform: translateY(0px) rotate(4deg);
		}
		50% {
			transform: translateY(-16px) rotate(0deg);
		}
	}

	@keyframes float4 {
		0%,
		100% {
			transform: translateY(0px) rotate(-6deg);
		}
		50% {
			transform: translateY(-20px) rotate(-9deg);
		}
	}

	:global(.animate-float-1) {
		animation: float1 8s ease-in-out infinite;
		will-change: transform;
		transform: translateZ(0);
	}

	:global(.animate-float-2) {
		animation: float2 9.5s ease-in-out infinite;
		will-change: transform;
		transform: translateZ(0);
	}

	:global(.animate-float-3) {
		animation: float3 7.5s ease-in-out infinite;
		will-change: transform;
		transform: translateZ(0);
	}

	:global(.animate-float-4) {
		animation: float4 10s ease-in-out infinite;
		will-change: transform;
		transform: translateZ(0);
	}

	/* Respect user motion preferences */
	@media (prefers-reduced-motion: reduce) {
		:global(.animate-float-1),
		:global(.animate-float-2),
		:global(.animate-float-3),
		:global(.animate-float-4) {
			animation: none !important;
		}
	}
</style>

<script lang="ts">
	interface Props {
		isSurging?: boolean;
		onTriggerSurge?: () => void;
	}

	let { isSurging = false, onTriggerSurge }: Props = $props();
</script>

<!-- Silicon Interconnect Bus: High-Bandwidth Memory & Compute Conduits distributing forward pass tensors -->
<button
	type="button"
	onclick={() => onTriggerSurge?.()}
	class="group relative -my-1 block h-16 w-full cursor-pointer overflow-visible border-0 bg-transparent p-0 text-left outline-none"
	title="Click to simulate tensor core forward pass dispatch"
>
	<svg
		class="h-full w-full overflow-visible transition-transform duration-300 group-hover:scale-[1.002]"
		viewBox="0 0 1000 60"
		fill="none"
		preserveAspectRatio="none"
	>
		<defs>
			<!-- Cohesive Technical Glow Filters -->
			<filter id="busCyanGlow" x="-20%" y="-100%" width="140%" height="300%">
				<feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#06b6d4" flood-opacity="0.8" />
			</filter>
			<filter id="busAmberGlow" x="-20%" y="-100%" width="140%" height="300%">
				<feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#f59e0b" flood-opacity="0.8" />
			</filter>
			<filter id="busEmeraldGlow" x="-20%" y="-100%" width="140%" height="300%">
				<feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#10b981" flood-opacity="0.8" />
			</filter>
			<filter id="busVioletGlow" x="-20%" y="-100%" width="140%" height="300%">
				<feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#8b5cf6" flood-opacity="0.8" />
			</filter>

			<!-- Gradients for subtle data packet transmission -->
			<linearGradient id="traceGradCyan" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#06b6d4" stop-opacity="0.95" />
				<stop offset="100%" stop-color="#22d3ee" stop-opacity="0.6" />
			</linearGradient>
			<linearGradient id="traceGradAmber" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#f59e0b" stop-opacity="0.95" />
				<stop offset="100%" stop-color="#fbbf24" stop-opacity="0.6" />
			</linearGradient>
			<linearGradient id="traceGradEmerald" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#10b981" stop-opacity="0.95" />
				<stop offset="100%" stop-color="#34d399" stop-opacity="0.6" />
			</linearGradient>
			<linearGradient id="traceGradViolet" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.95" />
				<stop offset="100%" stop-color="#a78bfa" stop-opacity="0.6" />
			</linearGradient>
		</defs>

		<!-- Substrate Silicon Grid & Dormant Ground Traces -->
		<g stroke-linecap="round" stroke-linejoin="round" opacity="0.35">
			<!-- Channel 0: Attention Context (Center of Card 1 = x:120) -->
			<path d="M 440 0 L 440 20 L 120 20 L 120 60" stroke="#0e7490" stroke-width="1.4" />
			<!-- Channel 1: SRAM Tiling (Center of Card 2 = x:373) -->
			<path d="M 470 0 L 470 32 L 373 32 L 373 60" stroke="#b45309" stroke-width="1.4" />
			<!-- Central Main Transmission Trunk (Continues downward to timeline spine = x:500) -->
			<path d="M 500 0 L 500 60" stroke="#0284c7" stroke-width="1.8" stroke-dasharray="3 3" />
			<!-- Channel 2: Tensor Core ALU (Center of Card 3 = x:627) -->
			<path d="M 530 0 L 530 32 L 627 32 L 627 60" stroke="#047857" stroke-width="1.4" />
			<!-- Channel 3: MLA Latent Vector (Center of Card 4 = x:880) -->
			<path d="M 560 0 L 560 20 L 880 20 L 880 60" stroke="#6d28d9" stroke-width="1.4" />
		</g>

		<!-- Active High-Bandwidth Data Streams (Photonic Pulse Offsets on GPU Compositor) -->
		<g
			stroke-linecap="round"
			stroke-linejoin="round"
			class={isSurging ? 'brightness-150 saturate-150' : ''}
		>
			<!-- Channel 0 Active Pulse (Cyan) -->
			<path
				d="M 440 0 L 440 20 L 120 20 L 120 60"
				stroke="url(#traceGradCyan)"
				stroke-width={isSurging ? '2.4' : '1.8'}
				stroke-dasharray="14 42"
				class="bus-stream-0"
				filter="url(#busCyanGlow)"
			/>
			<!-- Channel 1 Active Pulse (Amber) -->
			<path
				d="M 470 0 L 470 32 L 373 32 L 373 60"
				stroke="url(#traceGradAmber)"
				stroke-width={isSurging ? '2.4' : '1.8'}
				stroke-dasharray="14 36"
				class="bus-stream-1"
				filter="url(#busAmberGlow)"
			/>
			<!-- Central Spine Core Trunk Stream (Sky) -->
			<path
				d="M 500 0 L 500 60"
				stroke="#38bdf8"
				stroke-width={isSurging ? '2.8' : '2'}
				stroke-dasharray="16 32"
				class="bus-stream-trunk"
			/>
			<!-- Channel 2 Active Pulse (Emerald) -->
			<path
				d="M 530 0 L 530 32 L 627 32 L 627 60"
				stroke="url(#traceGradEmerald)"
				stroke-width={isSurging ? '2.4' : '1.8'}
				stroke-dasharray="14 36"
				class="bus-stream-2"
				filter="url(#busEmeraldGlow)"
			/>
			<!-- Channel 3 Active Pulse (Violet) -->
			<path
				d="M 560 0 L 560 20 L 880 20 L 880 60"
				stroke="url(#traceGradViolet)"
				stroke-width={isSurging ? '2.4' : '1.8'}
				stroke-dasharray="14 42"
				class="bus-stream-3"
				filter="url(#busVioletGlow)"
			/>
		</g>

		<!-- High-Precision Silicon Vias & Solder Terminals (Single Source of Truth) -->
		<g>
			<!-- Top Origin Terminals Mating with Operator Card Base -->
			<!-- Cyan Egress Terminal -->
			<rect
				x="434"
				y="-1"
				width="12"
				height="4"
				rx="2"
				fill="#06b6d4"
				class={isSurging ? 'drop-shadow-[0_0_8px_#06b6d4] filter' : ''}
			/>
			<!-- Amber Egress Terminal -->
			<rect
				x="464"
				y="-1"
				width="12"
				height="4"
				rx="2"
				fill="#f59e0b"
				class={isSurging ? 'drop-shadow-[0_0_8px_#f59e0b] filter' : ''}
			/>
			<!-- Central Sky Via -->
			<rect
				x="493"
				y="-1"
				width="14"
				height="5"
				rx="2.5"
				fill="#38bdf8"
				class="animate-pulse drop-shadow-[0_0_10px_#38bdf8] filter"
			/>
			<!-- Emerald Egress Terminal -->
			<rect
				x="524"
				y="-1"
				width="12"
				height="4"
				rx="2"
				fill="#10b981"
				class={isSurging ? 'drop-shadow-[0_0_8px_#10b981] filter' : ''}
			/>
			<!-- Violet Egress Terminal -->
			<rect
				x="554"
				y="-1"
				width="12"
				height="4"
				rx="2"
				fill="#8b5cf6"
				class={isSurging ? 'drop-shadow-[0_0_8px_#8b5cf6] filter' : ''}
			/>

			<!-- Micro-Via Corner Turn Anchors -->
			<circle cx="440" cy="20" r="1.8" fill="#06b6d4" />
			<circle cx="470" cy="32" r="1.8" fill="#f59e0b" />
			<circle cx="530" cy="32" r="1.8" fill="#10b981" />
			<circle cx="560" cy="20" r="1.8" fill="#8b5cf6" />

			<circle cx="120" cy="20" r="1.8" fill="#06b6d4" />
			<circle cx="373" cy="32" r="1.8" fill="#f59e0b" />
			<circle cx="627" cy="32" r="1.8" fill="#10b981" />
			<circle cx="880" cy="20" r="1.8" fill="#8b5cf6" />

			<!-- Bottom Destination Terminals Mating with Top Border of 4 Cards -->
			<!-- Card 1 Terminal (Cyan) -->
			<circle
				cx="120"
				cy="58"
				r="3.5"
				stroke="#22d3ee"
				stroke-width="1.2"
				fill="#06b6d4"
				class="drop-shadow-[0_0_6px_#06b6d4] filter"
			/>
			<!-- Card 2 Terminal (Amber) -->
			<circle
				cx="373"
				cy="58"
				r="3.5"
				stroke="#fbbf24"
				stroke-width="1.2"
				fill="#f59e0b"
				class="drop-shadow-[0_0_6px_#f59e0b] filter"
			/>
			<!-- Central Trunk Terminal (Sky) -->
			<circle
				cx="500"
				cy="58"
				r="4"
				stroke="#38bdf8"
				stroke-width="1.5"
				fill="#0284c7"
				class="animate-pulse drop-shadow-[0_0_8px_#38bdf8] filter"
			/>
			<!-- Card 3 Terminal (Emerald) -->
			<circle
				cx="627"
				cy="58"
				r="3.5"
				stroke="#34d399"
				stroke-width="1.2"
				fill="#10b981"
				class="drop-shadow-[0_0_6px_#10b981] filter"
			/>
			<!-- Card 4 Terminal (Violet) -->
			<circle
				cx="880"
				cy="58"
				r="3.5"
				stroke="#c084fc"
				stroke-width="1.2"
				fill="#8b5cf6"
				class="drop-shadow-[0_0_6px_#8b5cf6] filter"
			/>
		</g>
	</svg>
</button>

<style>
	/* Micro-Architecture Bus Streaming Animations (100% GPU Compositor) */
	@keyframes busFlow {
		0% {
			stroke-dashoffset: 0;
		}
		100% {
			stroke-dashoffset: -120;
		}
	}

	@keyframes busTrunkFlow {
		0% {
			stroke-dashoffset: 0;
		}
		100% {
			stroke-dashoffset: -96;
		}
	}

	.bus-stream-0 {
		animation: busFlow 2.8s linear infinite;
		will-change: stroke-dashoffset;
	}

	.bus-stream-1 {
		animation: busFlow 2.4s linear infinite;
		will-change: stroke-dashoffset;
	}

	.bus-stream-2 {
		animation: busFlow 2.6s linear infinite;
		will-change: stroke-dashoffset;
	}

	.bus-stream-3 {
		animation: busFlow 3s linear infinite;
		will-change: stroke-dashoffset;
	}

	.bus-stream-trunk {
		animation: busTrunkFlow 1.8s linear infinite;
		will-change: stroke-dashoffset;
	}

	@media (prefers-reduced-motion: reduce) {
		.bus-stream-0,
		.bus-stream-1,
		.bus-stream-2,
		.bus-stream-3,
		.bus-stream-trunk {
			animation: none !important;
			stroke-dashoffset: 0 !important;
		}
	}
</style>

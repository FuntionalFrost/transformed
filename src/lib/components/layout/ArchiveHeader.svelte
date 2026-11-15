<script lang="ts">
	let {
		viewMode = $bindable('timeline'),
		onSwitchViewMode
	}: {
		viewMode: 'timeline' | 'grid' | 'lab';
		onSwitchViewMode: (mode: 'timeline' | 'grid' | 'lab') => void;
	} = $props();
</script>

<header class="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
	<!-- Optical Bus Photonic Gradient Edge -->
	<div
		class="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent"
	></div>
	<div
		class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-6"
	>
		<div class="flex items-center gap-2 sm:gap-3">
			<div
				class="group relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cyan-500/40 bg-linear-to-br from-slate-900 via-slate-950 to-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/20 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] sm:h-9 sm:w-9"
			>
				<!-- Micro-chip corner fiducials -->
				<div class="pointer-events-none absolute inset-0 opacity-40">
					<span class="absolute top-0.5 left-0.5 h-1 w-1 border-t border-l border-cyan-400"></span>
					<span class="absolute top-0.5 right-0.5 h-1 w-1 border-t border-r border-cyan-400"></span>
					<span class="absolute bottom-0.5 left-0.5 h-1 w-1 border-b border-l border-cyan-400"
					></span>
					<span class="absolute right-0.5 bottom-0.5 h-1 w-1 border-r border-b border-cyan-400"
					></span>
				</div>

				<!-- Bespoke Attention Archive Logo Mark: Architectural 'A' with Quantum Attention Crossbar -->
				<svg
					class="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-105 sm:h-5 sm:w-5"
					viewBox="0 0 32 32"
					fill="none"
					aria-label="Attention Archive Logo"
				>
					<defs>
						<linearGradient id="logoArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stop-color="#22d3ee" />
							<stop offset="60%" stop-color="#38bdf8" />
							<stop offset="100%" stop-color="#f59e0b" />
						</linearGradient>
						<filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
							<feGaussianBlur stdDeviation="1" result="blur" />
							<feComposite in="SourceGraphic" in2="blur" operator="over" />
						</filter>
					</defs>
					<!-- Silicon Die Substrate / Alignment Grid -->
					<rect
						x="3"
						y="3"
						width="26"
						height="26"
						rx="4"
						stroke="#0891b2"
						stroke-width="1"
						stroke-dasharray="2 2"
						opacity="0.35"
					/>
					<!-- I/O Die Pin Notches -->
					<line
						x1="2"
						y1="16"
						x2="4.5"
						y2="16"
						stroke="#22d3ee"
						stroke-width="1.5"
						stroke-linecap="round"
						opacity="0.7"
					/>
					<line
						x1="27.5"
						y1="16"
						x2="30"
						y2="16"
						stroke="#22d3ee"
						stroke-width="1.5"
						stroke-linecap="round"
						opacity="0.7"
					/>
					<line
						x1="16"
						y1="2"
						x2="16"
						y2="4.5"
						stroke="#22d3ee"
						stroke-width="1.5"
						stroke-linecap="round"
						opacity="0.7"
					/>
					<line
						x1="16"
						y1="27.5"
						x2="16"
						y2="30"
						stroke="#22d3ee"
						stroke-width="1.5"
						stroke-linecap="round"
						opacity="0.7"
					/>
					<!-- Architectural 'A' Struts -->
					<path
						d="M8.5 24.5L16 6.5L23.5 24.5"
						stroke="url(#logoArchGrad)"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<!-- Attention Matrix Crossbar Bridge -->
					<path
						d="M11 18.5H21"
						stroke="#38bdf8"
						stroke-width="2"
						stroke-linecap="round"
						opacity="0.9"
					/>
					<!-- Illuminated Quantum Core Focal Dot -->
					<circle cx="16" cy="18.5" r="2.2" fill="#f59e0b" filter="url(#logoGlow)" />
					<!-- Apex Vertex Focus Point -->
					<circle cx="16" cy="6.5" r="1.4" fill="#22d3ee" />
				</svg>
			</div>
			<div>
				<span
					class="flex items-center gap-1.5 text-xs font-black tracking-wider text-white uppercase sm:gap-2 sm:text-base"
				>
					<span class="whitespace-nowrap">Attention Archive</span>
					<span
						class="xs:inline-flex hidden rounded-full border border-cyan-400/50 bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-cyan-300 sm:px-2 sm:text-[10px]"
					>
						2017 → 2026
					</span>
				</span>
				<p class="hidden font-mono text-[10px] text-slate-400 sm:flex sm:items-center sm:gap-1.5">
					<span class="text-slate-300">TRANSFORMERS (2017)</span>
					<span class="text-cyan-500/70">➔</span>
					<span class="text-amber-300/90">FLASHATTENTION (2022–24)</span>
					<span class="text-cyan-500/70">➔</span>
					<span class="text-violet-300/90">BLACKWELL / RDNA 4 (2026)</span>
				</p>
			</div>
		</div>

		<!-- Actions: View Mode Toggles & GitHub Link -->
		<div class="flex items-center gap-1.5 sm:gap-2">
			<!-- View Mode Toggles -->
			<div
				class="flex items-center gap-0.5 rounded-lg border border-slate-800 bg-slate-900/90 p-0.5 sm:gap-1 sm:p-1"
			>
				<button
					type="button"
					onclick={() => onSwitchViewMode('timeline')}
					aria-pressed={viewMode === 'timeline'}
					class="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] transition-colors sm:gap-1.5 sm:px-3 sm:text-xs {viewMode ===
					'timeline'
						? 'bg-cyan-600 font-bold text-white shadow-sm'
						: 'text-slate-400 hover:text-slate-200'}"
				>
					<svg
						class="h-3.5 w-3.5 shrink-0 opacity-80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="3" y1="12" x2="21" y2="12" />
						<polyline points="17 8 21 12 17 16" />
						<circle cx="7" cy="12" r="2" fill="currentColor" />
						<circle cx="12" cy="12" r="2" fill="currentColor" />
					</svg>
					<span class="hidden sm:inline">Timeline Flow</span>
					<span class="sm:hidden">Timeline</span>
				</button>
				<button
					type="button"
					onclick={() => onSwitchViewMode('grid')}
					aria-pressed={viewMode === 'grid'}
					class="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] transition-colors sm:gap-1.5 sm:px-3 sm:text-xs {viewMode ===
					'grid'
						? 'bg-cyan-600 font-bold text-white shadow-sm'
						: 'text-slate-400 hover:text-slate-200'}"
				>
					<svg
						class="h-3.5 w-3.5 shrink-0 opacity-80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="3" y="3" width="7" height="7" rx="1" />
						<rect x="14" y="3" width="7" height="7" rx="1" />
						<rect x="14" y="14" width="7" height="7" rx="1" />
						<rect x="3" y="14" width="7" height="7" rx="1" />
					</svg>
					<span class="hidden sm:inline">Matrix Grid</span>
					<span class="sm:hidden">Grid</span>
				</button>
				<button
					type="button"
					onclick={() => onSwitchViewMode('lab')}
					aria-pressed={viewMode === 'lab'}
					class="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] transition-colors sm:gap-1.5 sm:px-3 sm:text-xs {viewMode ===
					'lab'
						? 'bg-cyan-600 font-bold text-white shadow-sm'
						: 'text-slate-400 hover:text-slate-200'}"
				>
					<svg
						class="h-3.5 w-3.5 shrink-0 opacity-80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
					</svg>
					<span class="hidden sm:inline">Simulator Lab</span>
					<span class="sm:hidden">Lab</span>
				</button>
			</div>

			<!-- GitHub Source Link -->
			<a
				href="https://github.com/FuntionalFrost/transformed"
				target="_blank"
				rel="noreferrer"
				class="group flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/90 text-slate-400 transition-colors hover:border-slate-700 hover:text-white sm:h-8 sm:w-8"
				title="View source on GitHub"
				aria-label="View source on GitHub"
			>
				<svg
					class="h-4 w-4 transition-transform group-hover:scale-105"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
					/>
				</svg>
			</a>
		</div>
	</div>
</header>

<script lang="ts">
	import katex from 'katex';

	interface Props {
		latex: string;
		displayMode?: boolean;
		class?: string;
		copyable?: boolean;
	}

	let { latex, displayMode = false, class: className = '', copyable = false }: Props = $props();

	let copied = $state(false);

	let renderedHtml = $derived.by(() => {
		try {
			return katex.renderToString(latex, {
				displayMode,
				throwOnError: false,
				strict: false
			});
		} catch (err) {
			console.error('KaTeX rendering error:', err);
			return `<code class="text-rose-400 font-mono text-xs">${latex}</code>`;
		}
	});

	async function copyLatex(e: MouseEvent) {
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(latex);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 1800);
		} catch (err) {
			console.error('Failed to copy', err);
		}
	}
</script>

{#if displayMode}
	<div class="katex-math-wrapper group relative my-0.5 w-full max-w-full text-center {className}">
		<div
			class="katex-scroll-container w-full max-w-full [scrollbar-width:thin] overflow-x-auto overflow-y-hidden px-1 py-1"
		>
			<div class="inline-block min-w-full text-center align-middle">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html renderedHtml}
			</div>
		</div>

		{#if copyable}
			<button
				type="button"
				onclick={copyLatex}
				class="absolute top-0 right-1 shrink-0 rounded border border-slate-700/80 bg-slate-900/95 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-300 opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-200"
				title="Copy LaTeX"
			>
				{copied ? 'Copied!' : 'TeX'}
			</button>
		{/if}
	</div>
{:else}
	<span class="group relative inline-flex items-center {className}">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html renderedHtml}

		{#if copyable}
			<button
				type="button"
				onclick={copyLatex}
				class="py-0.2 ml-1.5 shrink-0 rounded border border-slate-700/80 bg-slate-900/90 px-1 font-mono text-[8px] text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:border-cyan-400 hover:text-cyan-200"
				title="Copy LaTeX"
			>
				{copied ? 'Copied!' : 'TeX'}
			</button>
		{/if}
	</span>
{/if}

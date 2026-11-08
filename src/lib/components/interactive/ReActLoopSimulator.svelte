<script lang="ts">
	import { Terminal, AiThought, AiToolCall } from 'yaxa-svelte';
	import KatexMath from '../KatexMath.svelte';

	interface TrajectoryStep {
		index: number;
		phase: 'observation' | 'thought' | 'action';
		title: string;
		symbol: string;
		tag: string;
		codeOrText: string;
		explanation: string;
	}

	const steps: TrajectoryStep[] = [
		{
			index: 0,
			phase: 'observation',
			symbol: 'o_0',
			title: 'Initial Environment Observation',
			tag: 'Issue Context',
			codeOrText: `[SWE-bench Issue #4021]
Exception: IndexError: string index out of range in tokenizer.tokenize()
Reproduction: Calling tokenize("hello world   ") raises IndexError when trailing whitespace is stripped.`,
			explanation:
				'The agent context window ingests the issue description, directory structure, and AST call-graph.'
		},
		{
			index: 1,
			phase: 'thought',
			symbol: 't_1',
			title: 'Hypothesis & Action Planning',
			tag: 'Reasoning Trace',
			codeOrText: `Thought: I need to reproduce this failure first. I will run pytest on tests/test_tokenizer.py to verify current behavior before modifying any source code.`,
			explanation: 'The model plans tool usage rather than blindly guessing a file edit.'
		},
		{
			index: 2,
			phase: 'action',
			symbol: 'a_1',
			title: 'Tool Execution: Bash Sandbox',
			tag: 'Terminal Action',
			codeOrText: `run_command(cmd="pytest tests/test_tokenizer.py -k test_trailing")`,
			explanation: 'Invokes external bash environment inside isolated micro-VM.'
		},
		{
			index: 3,
			phase: 'observation',
			symbol: 'o_1',
			title: 'Sandbox Stdout / Stderr',
			tag: 'Execution Feedback',
			codeOrText: `FAILED tests/test_tokenizer.py::test_trailing_whitespace - IndexError: string index out of range
File "src/tokenizer.py", line 84, in tokenize:
    return buffer[end_idx]`,
			explanation:
				'Compiler/test runner output returns exit code 1 and exact traceback to the agent context.'
		},
		{
			index: 4,
			phase: 'thought',
			symbol: 't_2',
			title: 'Root Cause Diagnosis & Patch Design',
			tag: 'Reasoning Trace',
			codeOrText: `Thought: Line 84 accesses buffer[end_idx] without checking if end_idx >= 0. When trailing whitespace is stripped, end_idx can become -1. I will apply a targeted search-and-replace block to add an explicit bounds check.`,
			explanation: 'Agent pinpoints minimal deterministic edit without rewriting the full file.'
		},
		{
			index: 5,
			phase: 'action',
			symbol: 'a_2',
			title: 'Deterministic Edit Primitive',
			tag: 'Editor Action',
			codeOrText: `str_replace(
  path="src/tokenizer.py",
  old_str="return buffer[end_idx]",
  new_str="if end_idx < 0:\n    return None\nreturn buffer[end_idx]"
)`,
			explanation: 'Exact string replacement anchors prevent line truncation or comment deletion.'
		},
		{
			index: 6,
			phase: 'observation',
			symbol: 'o_2',
			title: 'Editor Confirmation & Diff',
			tag: 'Diff Feedback',
			codeOrText: `File src/tokenizer.py modified successfully:
@@ -83,2 +83,4 @@
-    return buffer[end_idx]
+    if end_idx < 0:
+        return None
+    return buffer[end_idx]`,
			explanation: 'Editor returns structured hunk delta confirming clean AST modification.'
		},
		{
			index: 7,
			phase: 'thought',
			symbol: 't_3',
			title: 'Verification Step Planning',
			tag: 'Reasoning Trace',
			codeOrText: `Thought: The patch is applied. Now I must run the full test suite to confirm the fix works and no regressions were introduced in other tokenizer modes.`,
			explanation: 'Self-correction check verifying safety before declaring completion.'
		},
		{
			index: 8,
			phase: 'action',
			symbol: 'a_3',
			title: 'Regression Test Execution',
			tag: 'Terminal Action',
			codeOrText: `run_command(cmd="pytest tests/")`,
			explanation: 'Runs full test battery in sandbox.'
		},
		{
			index: 9,
			phase: 'observation',
			symbol: 'o_3',
			title: 'Verification Success',
			tag: 'Execution Feedback',
			codeOrText: `================ 42 passed in 0.38s ================
Process exited with code 0.`,
			explanation: 'Deterministic verifier passes with zero errors.'
		},
		{
			index: 10,
			phase: 'thought',
			symbol: 't_4',
			title: 'Terminal Objective Met',
			tag: 'Loop Termination',
			codeOrText: `Thought: All 42 unit tests passed. Issue #4021 is resolved. Task complete.`,
			explanation: 'The agent exits loop and returns verified patch to user.'
		}
	];

	let currentStepIdx = $state(0);

	let currentStep = $derived(steps[currentStepIdx]);
</script>

<div class="rounded-xl border border-rose-500/30 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
		<div>
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-rose-400 uppercase"
			>
				<span class="h-2 w-2 animate-pulse rounded-full bg-rose-400"></span>
				Interactive Control Loop
			</span>
			<h4 class="text-lg font-bold text-slate-100">
				The ReAct Feedback Cycle (SWE-bench Simulation)
			</h4>
		</div>
		<div class="flex items-center gap-2">
			<button
				type="button"
				disabled={currentStepIdx === 0}
				onclick={() => {
					if (currentStepIdx > 0) currentStepIdx--;
				}}
				class="rounded bg-slate-800 px-2.5 py-1 font-mono text-xs text-slate-300 hover:text-white disabled:opacity-30"
			>
				◀ Prev Turn
			</button>
			<span
				class="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-1 font-mono text-xs text-rose-300"
			>
				Step {currentStepIdx + 1} / {steps.length}
			</span>
			<button
				type="button"
				disabled={currentStepIdx === steps.length - 1}
				onclick={() => {
					if (currentStepIdx < steps.length - 1) currentStepIdx++;
				}}
				class="rounded bg-rose-600 px-2.5 py-1 font-mono text-xs text-white hover:bg-rose-500 disabled:opacity-30"
			>
				Next Turn ▶
			</button>
		</div>
	</div>

	<!-- Step Navigation Rail -->
	<div class="mt-4 flex gap-1 overflow-x-auto pb-2">
		{#each steps as s, i (s.index)}
			<button
				type="button"
				onclick={() => (currentStepIdx = i)}
				class="flex-shrink-0 rounded px-2.5 py-1 font-mono text-xs transition-all {currentStepIdx ===
				i
					? 'bg-rose-500 font-bold text-white shadow-md shadow-rose-500/30'
					: s.phase === 'thought'
						? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
						: s.phase === 'action'
							? 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
							: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
			>
				<KatexMath latex={s.symbol} />
			</button>
		{/each}
	</div>

	<!-- Active Step Presentation using Yaxa AI & Terminal Components -->
	<div class="mt-4">
		{#if currentStep.phase === 'thought'}
			<AiThought
				title={`${currentStep.symbol}: ${currentStep.title}`}
				open={true}
				running={currentStepIdx < steps.length - 1}
				steps={[currentStep.tag, currentStep.explanation]}
			>
				<div
					class="border-t border-neutral-800 bg-slate-950/80 p-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-amber-200/90"
				>
					{currentStep.codeOrText}
				</div>
			</AiThought>
		{:else if currentStep.phase === 'action' && currentStep.tag === 'Editor Action'}
			<AiToolCall
				name="str_replace"
				status="success"
				open={true}
				args={{
					path: 'src/tokenizer.py',
					old_str: 'return buffer[end_idx]',
					new_str: 'if end_idx < 0:\n    return None\nreturn buffer[end_idx]'
				}}
				result="Hunk @@ -83,2 +83,4 @@ applied successfully. Zero syntax errors."
			>
				<p
					class="border-t border-neutral-800 bg-slate-950/60 p-2.5 font-mono text-[11px] text-slate-400"
				>
					↳ {currentStep.explanation}
				</p>
			</AiToolCall>
		{:else if currentStep.phase === 'action'}
			<Terminal
				title={`Sandbox Terminal [${currentStep.symbol}]`}
				lines={[
					{ prompt: 'agent@microvm:~/repo$', command: currentStep.codeOrText },
					{ comment: `↳ ${currentStep.explanation}` }
				]}
				copyable={true}
			/>
		{:else}
			<Terminal
				title={`Environment Observation [${currentStep.symbol}]`}
				lines={[{ output: currentStep.codeOrText }, { comment: `↳ ${currentStep.explanation}` }]}
				copyable={true}
			/>
		{/if}
	</div>
</div>

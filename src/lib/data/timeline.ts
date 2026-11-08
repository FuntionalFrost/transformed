import type { CategoryId, CategoryInfo, Milestone } from '../types';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
	architecture: {
		id: 'architecture',
		label: 'Sequence & Attention Architecture',
		shortLabel: 'Context Layer',
		color: 'cyan',
		badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
		glowClass: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
		borderClass: 'border-cyan-500/40 hover:border-cyan-400',
		iconName: 'Cpu',
		description:
			'Transformers, rotary embeddings, latent multi-head attention, and multi-token prediction.'
	},
	hardware: {
		id: 'hardware',
		label: 'Hardware & Numerical Precision',
		shortLabel: 'Hardware',
		color: 'emerald',
		badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
		glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
		borderClass: 'border-emerald-500/40 hover:border-emerald-400',
		iconName: 'Zap',
		description:
			'Tensor Cores (Volta to Blackwell), AMD RDNA 4 WMMA, NVFP4 microscaling, FlashAttention 1-3 TMA async, and serving engines.'
	},
	scaling: {
		id: 'scaling',
		label: 'Empirical & Test-Time Scaling',
		shortLabel: 'Scaling',
		color: 'amber',
		badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
		glowClass: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
		borderClass: 'border-amber-500/40 hover:border-amber-400',
		iconName: 'TrendingUp',
		description:
			'Chinchilla compute optimality, inference search scaling laws, MCTS, and Process Reward Models.'
	},
	training: {
		id: 'training',
		label: 'Training Paradigms & Verifiable RL',
		shortLabel: 'Training & RL',
		color: 'violet',
		badgeClass: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
		glowClass: 'shadow-[0_0_25px_rgba(139,92,246,0.25)]',
		borderClass: 'border-violet-500/40 hover:border-violet-400',
		iconName: 'GitPullRequest',
		description:
			'Causal LM on code, pass@k metrics, Fill-in-the-Middle (FIM), and critic-free GRPO.'
	},
	'agent-loop': {
		id: 'agent-loop',
		label: 'Agent Control Loops & Sandboxes',
		shortLabel: 'Agent Loops',
		color: 'rose',
		badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
		glowClass: 'shadow-[0_0_25px_rgba(244,63,94,0.25)]',
		borderClass: 'border-rose-500/40 hover:border-rose-400',
		iconName: 'Terminal',
		description:
			'The ReAct cycle, deterministic AST patching, Model Context Protocol (MCP), and micro-VMs.'
	}
};

export const TIMELINE_MILESTONES: Milestone[] = [
	{
		id: 'transformer-2017',
		year: 2017,
		period: 'Jun 2017',
		title: 'Scaled Dot-Product Attention & The Transformer',
		subtitle:
			'Replacing sequential recurrent bottlenecks with parallelizable global receptive fields',
		category: 'architecture',
		authors: 'Vaswani et al. (Google Brain / Google Research)',
		paperTitle: 'Attention Is All You Need',
		paperRef: 'arXiv:1706.03762',
		tags: ['Self-Attention', 'Softmax Scaling', 'O(N) vs O(1) Path', 'Volta Tensor Cores'],
		summary:
			'Prior to the Transformer, recurrent networks processed code sequentially in O(N) steps, suffering catastrophic vanishing gradients over long syntax trees. Attention introduced parallel constant-path global resolution across all tokens.',
		equations: [
			{
				label: 'Scaled Dot-Product Attention',
				latex:
					'\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
				displayMode: true,
				terms: [
					{
						symbol: 'Q, K',
						name: 'Queries & Keys',
						explanation:
							'Representations in R^{N x d_k} encoding token search demands and semantic address tags.'
					},
					{
						symbol: 'V',
						name: 'Values',
						explanation:
							'Token representations in R^{N x d_v} weighted by calculated pairwise relevance.'
					},
					{
						symbol: '1 / \\sqrt{d_k}',
						name: 'Variance Stabilizer',
						explanation:
							'Prevents dot products from exploding for large d_k, which pushes softmax into vanishing gradient saturation regions.'
					}
				]
			},
			{
				label: 'Hardware GEMM Acceleration (NVIDIA Volta)',
				latex: 'D = A \\times B + C \\quad (\\text{Tensor Cores Matrix MAC})',
				displayMode: true,
				terms: [
					{
						symbol: 'A, B',
						name: 'Input Matrix Tiles',
						explanation:
							'Small 16x16x16 tiles processed in parallel within a single warp instruction.'
					},
					{
						symbol: 'C, D',
						name: 'Accumulator & Output',
						explanation:
							'Delivers orders-of-magnitude higher TFLOPS than thread-by-thread CUDA cores.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Recurrent Networks (RNN/LSTM) requiring O(N) sequential propagation steps',
			to: 'All-to-all attention matrix with O(1) path length between any two program tokens',
			mechanism:
				'Pairwise query-key dot products normalized by dimension scaling, parallelized on hardware matrix units.'
		},
		impactOnCodingAgents: [
			'Resolves remote variable definitions, function declarations, and cross-file imports across hundreds of code lines.',
			'Enables concurrent matrix operations on newly introduced GPU Tensor Cores, paving the way for multi-billion parameter code bases.'
		],
		technicalDeepDive:
			'Programming languages have strict syntactical dependencies where a closing bracket or return type must resolve against a token hundreds of positions prior. In recurrent architectures, backpropagation through time suffered from decaying gradients. Self-attention provides direct O(1) paths between arbitrary tokens regardless of distance.',
		interactiveToolId: 'attention',
		metrics: [
			{ label: 'Max Path Length', value: 'O(1)', delta: 'down from O(N)' },
			{ label: 'Layer Complexity', value: 'O(N^2 * d)', delta: 'parallelizable' }
		]
	},
	{
		id: 'rope-2021',
		year: 2021,
		period: 'Apr 2021',
		title: 'Rotary Position Embedding (RoPE)',
		subtitle: 'Encoding relative token distances through complex coordinate rotations',
		category: 'architecture',
		authors: 'Su et al.',
		paperTitle: 'RoFormer: Enhanced Transformer with Rotary Position Embedding',
		paperRef: 'arXiv:2104.09864',
		tags: [
			'Relative Positional Encoding',
			'Complex Orthogonal Rotation',
			'Context Expansion',
			'AST Preservation'
		],
		summary:
			'Sinusoidal and absolute position embeddings degraded when context windows were stretched beyond pretraining bounds. RoPE injects relative positional distance directly into inner products through rotation matrices.',
		equations: [
			{
				label: 'Block-Diagonal Rotation Matrix',
				latex:
					'R_{\\Theta, m}^d = \\text{diag}\\left( R_{\\theta_1, m}, \\dots, R_{\\theta_{d/2}, m} \\right)',
				displayMode: true,
				terms: [
					{
						symbol: 'm',
						name: 'Token Index',
						explanation: 'Absolute sequence index of the query or key token.'
					},
					{
						symbol: 'R_{\\theta_i, m}',
						name: '2D Rotation',
						explanation:
							'2x2 orthogonal matrix rotating the token representation by angle m * \\theta_i.'
					}
				]
			},
			{
				label: 'Inner-Product Relative Distance Invariant',
				latex: '\\langle R_{\\Theta, m}^d q_m, R_{\\Theta, n}^d k_n \\rangle = g(q_m, k_n, m - n)',
				displayMode: true,
				terms: [
					{
						symbol: 'm - n',
						name: 'Relative Offset',
						explanation:
							'The dot product depends purely on relative distance, enabling smooth extrapolation to 128k+ tokens.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Additive absolute positional embeddings (fixed vocabulary coordinates)',
			to: 'Multiplicative complex rotations preserving relative distance invariants under translation',
			mechanism:
				'Applying block-diagonal 2D rotation matrices to query and key vectors before dot-product evaluation.'
		},
		impactOnCodingAgents: [
			'Preserves strict indentation, syntax scopes, and token ordering over context spans of hundreds of thousands of tokens.',
			'Allows coding agents to digest entire multi-file repositories, compiler logs, and deep stack traces without positional blur.'
		],
		technicalDeepDive:
			'In source code, semantic validity hinges on relative distances (e.g. an identifier inside a block is relative to its enclosing scope header). RoPE ensures that attention score between token at index m and token at index n is an explicit function of (m - n), maintaining decay properties as relative separation increases.',
		interactiveToolId: 'rope',
		metrics: [
			{ label: 'Positional Window', value: '128k - 1M+', delta: 'extrapolatable' },
			{ label: 'Inner Product Decay', value: 'Bounded', delta: 'preserves lexical order' }
		]
	},
	{
		id: 'codex-passk-2021',
		year: 2021,
		period: 'Jul 2021',
		title: 'Causal LM on Code & Functional pass@k Metric',
		subtitle: 'Shifting evaluation from cosmetic n-gram similarity to executable correctness',
		category: 'training',
		authors: 'Chen et al. (OpenAI Codex) & Li et al. (StarCoder)',
		paperTitle: 'Evaluating Large Language Models Trained on Code',
		paperRef: 'arXiv:2107.03374',
		tags: ['Codex', 'HumanEval', 'pass@k', 'Causal LM', 'Unit Testing'],
		summary:
			'Early language models were scored with BLEU or ROUGE metrics that failed completely on code (a single inverted boolean or comma breaks execution while scoring 99% BLEU). Codex established functional execution correctness via unit tests.',
		equations: [
			{
				label: 'Causal Language Modeling Objective on Code',
				latex:
					'\\mathcal{L}_{\\text{CLM}}(\\theta) = -\\sum_{t=1}^T \\log P(x_t \\mid x_{<t}; \\theta)',
				displayMode: true,
				terms: [
					{
						symbol: 'x_t',
						name: 'Code Token',
						explanation: 'Next token in the source file conditioned on preceding code context.'
					}
				]
			},
			{
				label: 'Unbiased pass@k Estimator',
				latex:
					'\\text{pass}@k = \\mathbb{E}_{\\text{problems}} \\left[ 1 - \\frac{\\binom{n - c}{k}}{\\binom{n}{k}} \\right]',
				displayMode: true,
				terms: [
					{
						symbol: 'n',
						name: 'Total Samples',
						explanation: 'Total candidate solution completions generated per prompt (n >= k).'
					},
					{
						symbol: 'c',
						name: 'Passing Samples',
						explanation: 'Count of candidates that pass 100% of the deterministic test assertions.'
					},
					{
						symbol: 'k',
						name: 'Budget Parameter',
						explanation:
							'Evaluates probability that at least one of k selected samples passes tests.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Cosmetic text-overlap scoring (BLEU, ROUGE, chrF) on code snippets',
			to: 'Functional execution harnesses running sandboxed Python test suites',
			mechanism:
				'Generating n independent candidates per problem and calculating unbiased combinatorial probability of correctness.'
		},
		impactOnCodingAgents: [
			'Aligned pretraining and fine-tuning with runnable, syntactically sound programs rather than superficial syntactic imitation.',
			'Established HumanEval and later SWE-bench as the ground-truth benchmarks for autonomous software engineering capability.'
		],
		technicalDeepDive:
			'A code generation model cannot be evaluated like natural language translation because code has a razor-thin margin of error: missing a colon or misnaming a variable causes a syntax error. The pass@k formulation calculates the exact mathematical probability that at least one of k code solutions will pass all unit tests without needing to draw all subsets.',
		interactiveToolId: 'passk',
		metrics: [
			{ label: 'Evaluation Paradigm', value: 'Unit Tests', delta: 'replaces BLEU' },
			{ label: 'Codex HumanEval pass@1', value: '28.8%', delta: 'baseline established' }
		]
	},
	{
		id: 'bf16-ampere-2021',
		year: 2021,
		period: '2021',
		title: 'Hardware Numerical Standardization: BF16 Precision',
		subtitle: 'Eliminating underflow/overflow during multi-trillion token code pretraining',
		category: 'hardware',
		authors: 'NVIDIA (Ampere Architecture) & Google Cloud TPU',
		tags: ['BF16', 'Bfloat16', 'Dynamic Range', 'Ampere Tensor Cores', 'FP32 Exponent'],
		summary:
			'Standard FP16 possessed only 5 exponent bits, causing frequent gradient underflows and requiring brittle dynamic loss scaling during code pre-training. BF16 matched FP32’s 8-bit dynamic range, enabling stable pretraining on sparse syntax.',
		equations: [
			{
				label: 'Brain Floating Point 16 Bit Specification',
				latex:
					'x_{\\text{BF16}} = (-1)^s \\cdot 2^{e - 127} \\cdot \\left(1 + \\frac{m}{128}\\right)',
				displayMode: true,
				terms: [
					{
						symbol: '8 \\text{ exponent bits}',
						name: 'Wide Dynamic Range',
						explanation:
							'Matches FP32 exponent width, accommodating exponents from 10^{-38} to 10^{38}.'
					},
					{
						symbol: '7 \\text{ mantissa bits}',
						name: 'Reduced Precision',
						explanation:
							'Halves storage and doubles compute density while preserving stable gradient updates.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'FP16 training with complex loss scalers and sudden vanishing gradients',
			to: 'BF16 hardware-native mixed precision across all training clusters',
			mechanism:
				'Preserving the 8-bit exponent field of FP32 while truncating mantissa bits to fit within 16-bit register space.'
		},
		impactOnCodingAgents: [
			'Enabled uninterrupted pretraining runs on heterogeneous code corpuses (C++, Python, SQL, Rust, Bash).',
			'Doubled memory bandwidth utilization compared to FP32, making 10B+ to 70B+ parameter checkpoints standard.'
		],
		technicalDeepDive:
			'Code datasets present extreme token frequency distributions—rare symbols, unique identifier hash names, and deep indentation tabs create high activation variances. BF16 prevents gradient explosions without loss scaling adjustments.',
		interactiveToolId: 'precision',
		metrics: [
			{ label: 'Exponent Range', value: '8 bits', delta: 'identical to FP32' },
			{ label: 'Memory Savings', value: '50%', delta: 'vs FP32 baseline' }
		]
	},
	{
		id: 'chinchilla-2022',
		year: 2022,
		period: 'Mar 2022',
		title: 'Chinchilla Compute-Optimal Scaling Laws',
		subtitle: 'Deriving power-law trade-offs between parameters and training tokens',
		category: 'scaling',
		authors: 'Hoffmann et al. (DeepMind) & Kaplan et al. (OpenAI)',
		paperTitle: 'Training Compute-Optimal Large Language Models',
		paperRef: 'arXiv:2203.15556',
		tags: ['Scaling Laws', 'Compute Budget', 'Tokens vs Parameters', 'Pretraining Density'],
		summary:
			'Kaplan et al. (2020) suggested scaling model size faster than data. Hoffmann et al. demonstrated that parameters (N) and training tokens (D) must scale in equal proportion under a given compute budget, unlocking dense, high-capability models.',
		equations: [
			{
				label: 'Compute-Optimal Loss Power Law',
				latex: 'L(N, D) = E + \\frac{A}{N^\\alpha} + \\frac{B}{D^\\beta}',
				displayMode: true,
				terms: [
					{
						symbol: 'N',
						name: 'Model Parameters',
						explanation: 'Total active learnable weights in the neural network.'
					},
					{
						symbol: 'D',
						name: 'Training Tokens',
						explanation: 'Volume of diverse code and text tokens consumed during pre-training.'
					},
					{
						symbol: 'E, A, B',
						name: 'Empirical Constants',
						explanation: 'Asymptotic irreducible entropy loss E, and power coefficients A and B.'
					},
					{
						symbol: '\\alpha \\approx 0.34, \\beta \\approx 0.28',
						name: 'Scaling Exponents',
						explanation: 'Demonstrates near-equal balance between token volume and parameter count.'
					}
				]
			},
			{
				label: 'FLOPs Constraint Budget',
				latex:
					'C \\approx 6ND \\implies N \\propto C^{a}, \\quad D \\propto C^{b} \\quad (a \\approx 0.5, b \\approx 0.5)',
				displayMode: true,
				terms: [
					{
						symbol: 'C',
						name: 'Compute Budget',
						explanation: 'Total floating point operations allocated to pre-training.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Under-trained giant models (e.g. 175B parameters trained on only 300B tokens)',
			to: 'Dense, compute-optimal models (e.g. 7B-70B parameters trained on 2T-15T+ tokens)',
			mechanism: 'Balancing gradient steps across parameter growth and massive token ingestion.'
		},
		impactOnCodingAgents: [
			'Models like StarCoder, CodeLlama, and Qwen-Coder were trained on trillions of lines of public code, git commits, and docs.',
			'Delivered high reasoning density in 7B–34B models that could be served locally or cheaply in agent developer environments.'
		],
		technicalDeepDive:
			'Before Chinchilla, models were undertrained relative to their capacity. Hoffmann et al. proved that for optimal downstream task performance at inference, every doubling of model parameters requires an equal doubling of dataset tokens. For code, this catalyzed sweeping internet crawls of GitHub, GitLab, and documentation sites.',
		interactiveToolId: 'chinchilla',
		metrics: [
			{ label: 'Token/Param Ratio', value: '~20 : 1', delta: 'up from 1.7 : 1' },
			{ label: 'Inference Efficiency', value: '4x faster', delta: 'smaller parameter footprints' }
		]
	},
	{
		id: 'flashattention-2022',
		year: 2022,
		period: 'Jun 2022',
		title: 'FlashAttention: IO-Aware Exact Attention Optimization',
		subtitle: 'Eliminating quadratic HBM read/write bottlenecks via SRAM tiling and online softmax',
		category: 'hardware',
		authors: 'Dao et al. (Stanford University)',
		paperTitle: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
		paperRef: 'arXiv:2205.14135',
		tags: ['FlashAttention', 'IO-Aware', 'SRAM Tiling', 'Online Softmax', 'Memory Bandwidth'],
		summary:
			'Standard attention materializes an N x N score matrix in slow GPU High-Bandwidth Memory (HBM), incurring O(N^2) memory transfers. FlashAttention tiles computation inside fast on-chip SRAM using online softmax to achieve O(N) memory traffic.',
		equations: [
			{
				label: 'Online Softmax Incremental Normalization',
				latex:
					'\\begin{aligned} m_{\\text{new}} &= \\max(m_{\\text{prev}}, x) \\\\[3pt] d_{\\text{new}} &= d_{\\text{prev}} e^{m_{\\text{prev}} - m_{\\text{new}}} + e^{x - m_{\\text{new}}} \\end{aligned}',
				displayMode: true,
				terms: [
					{
						symbol: 'm_{\\text{prev}}, m_{\\text{new}}',
						name: 'Running Maximum',
						explanation: 'Maintains running numerical stability scalar per row across tiled blocks.'
					},
					{
						symbol: 'd_{\\text{prev}}, d_{\\text{new}}',
						name: 'Running Normalizer',
						explanation:
							'Dynamically rescales previous partial sums when a larger maximum is encountered.'
					},
					{
						symbol: 'x',
						name: 'New Block Scores',
						explanation: 'Scores computed directly inside on-chip SRAM without spilling to HBM.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Materializing intermediate N x N attention matrices in slow GPU HBM memory (O(N^2) memory traffic)',
			to: 'Tiling Q, K, V blocks directly in ultra-fast on-chip SRAM registers with online softmax (O(N) memory traffic)',
			mechanism:
				'Fusing attention layers into a single custom CUDA kernel with backward pass recomputation.'
		},
		impactOnCodingAgents: [
			'Made long-context agent prompts (containing full file trees, ASTs, and pytest logs) economically feasible.',
			'Expanded sequence lengths from 2k/4k tokens to 32k tokens without explosive VRAM out-of-memory crashes.'
		],
		technicalDeepDive:
			'GPU computation is bound by memory access speed (HBM bandwidth: ~1.5–3 TB/s) rather than raw arithmetic capacity (SRAM: ~19 TB/s). FlashAttention avoids storing intermediate attention matrices by computing the softmax normalization in a single streaming pass using block updates.',
		interactiveToolId: 'flash',
		metrics: [
			{ label: 'HBM IO Complexity', value: 'O(N)', delta: 'down from O(N^2)' },
			{ label: 'Speedup', value: '2x - 4x', delta: 'zero approximation error' }
		]
	},
	{
		id: 'fim-2022',
		year: 2022,
		period: 'Jul 2022',
		title: 'Fill-in-the-Middle (FIM) Pre-Training',
		subtitle: 'Enabling bidirectional infilling and in-editor refactoring in autoregressive models',
		category: 'training',
		authors: 'Bavarian et al. (OpenAI)',
		paperTitle: 'Efficient Training of Language Models to Fill in the Middle',
		paperRef: 'arXiv:2207.14255',
		tags: ['Infilling', 'FIM', 'Prefix-Suffix-Middle', 'In-Line Copilot', 'Refactoring'],
		summary:
			'Standard autoregressive models can only generate code downwards from top to bottom. FIM reorganizes pretraining code documents into prefix, suffix, and middle segments, teaching the model to predict code between existing boundaries.',
		equations: [
			{
				label: 'FIM Permutation Data Transformation',
				latex:
					'x_{\\text{FIM}} = \\langle\\text{PRE}\\rangle x_{\\text{pre}} \\langle\\text{SUF}\\rangle x_{\\text{suf}} \\langle\\text{MID}\\rangle x_{\\text{mid}}',
				displayMode: true,
				terms: [
					{
						symbol: '\\langle \\text{PRE} \\rangle, \\langle \\text{SUF} \\rangle',
						name: 'Boundary Markers',
						explanation:
							'Special delimiter tokens separating the existing code context above and below the cursor.'
					},
					{
						symbol: 'x_{\\text{middle}}',
						name: 'Target Infill Block',
						explanation:
							'The missing function body, edit patch, or statement to be synthesized autoregressively.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Unidirectional left-to-right code generation unable to condition on following context',
			to: 'Arbitrary middle synthesis conditioned on both preceding file headers and trailing call sites',
			mechanism:
				'Randomly cutting documents during pre-training and appending the middle slice after prefix and suffix tokens.'
		},
		impactOnCodingAgents: [
			'Powers real-time in-editor code completions, cursor prediction, and contextual type signature implementations.',
			'Forms the backbone of targeted code refactoring where an agent edits a function inside an existing 1,000-line script.'
		],
		technicalDeepDive:
			'Software engineering rarely starts from a blank file; programmers work inside existing files where downstream call sites and class definitions provide crucial type and signature hints. By training models on prefix-suffix-middle permutations with zero extra compute overhead, models naturally learn bidirectional conditioning.',
		interactiveToolId: 'fim',
		metrics: [
			{ label: 'Infilling Capability', value: 'Native', delta: 'without dual encoders' },
			{ label: 'Pre-training Compute Overhead', value: '0%', delta: 'data permutation only' }
		]
	},
	{
		id: 'react-2022',
		year: 2022,
		period: 'Oct 2022',
		title: 'The ReAct Pattern: Reasoning + Acting',
		subtitle:
			'Establishing the closed-loop agent control cycle across thoughts, tools, and observations',
		category: 'agent-loop',
		authors: 'Yao et al. (Princeton / Google Research)',
		paperTitle: 'ReAct: Synergizing Reasoning and Acting in Language Models',
		paperRef: 'arXiv:2210.03629',
		tags: ['ReAct', 'Agent Loop', 'Tool Calling', 'Observation Feedback', 'Closed-Loop Control'],
		summary:
			'An LLM acting in isolation is prone to hallucinations and stale knowledge. ReAct introduced an interleaved execution trajectory where the model generates a verbal Thought, executes an Action in an external environment, and receives an Observation.',
		equations: [
			{
				label: 'Interleaved Agent Trajectory',
				latex: '\\tau = (o_0, t_1, a_1, o_1, \\dots, t_n, a_n, o_n)',
				displayMode: true,
				terms: [
					{
						symbol: 'o_t \\in \\mathcal{O}',
						name: 'Observations',
						explanation:
							'External environment feedback: compiler errors, git diff outputs, pytest exit codes, directory trees.'
					},
					{
						symbol: 't_t \\in \\mathcal{T}',
						name: 'Thoughts',
						explanation:
							'Internal chain-of-thought hypotheses, root-cause analyses, and sanity checks.'
					},
					{
						symbol: 'a_t \\in \\mathcal{A}',
						name: 'Actions',
						explanation:
							'Executable tool commands: invoking bash, writing file patches, grep queries, LSP symbol searches.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Static single-turn text completion without environment awareness',
			to: 'Dynamic multi-step feedback loop iterating until external assertions are satisfied',
			mechanism:
				'Prompting and fine-tuning the model to interleave reasoning traces with structured tool call payloads.'
		},
		impactOnCodingAgents: [
			'Allowed coding assistants to execute bash commands, inspect compiler tracebacks, and self-correct buggy code.',
			'Spawned modern autonomous agent harnesses including AutoGPT, SWE-agent, Aider, and Claude Code.'
		],
		technicalDeepDive:
			'By maintaining an explicit state of thoughts and actions, the agent breaks complex repository fixes into verifiable milestones: find file -> inspect line -> form hypothesis -> edit -> run test -> observe failure -> fix typo -> test pass.',
		interactiveToolId: 'react',
		metrics: [
			{ label: 'Control Loop', value: 'Closed-Loop', delta: 'replaces open-loop gen' },
			{ label: 'Hallucination Reduction', value: '>50%', delta: 'grounded in tool stdout' }
		]
	},
	{
		id: 'rlhf-verifiable-2022',
		year: 2022,
		period: 'Dec 2022',
		title: 'RLHF & Verifiable Automated Code Rewards',
		subtitle: 'Augmenting human preference modeling with objective compiler and test suite rewards',
		category: 'training',
		authors: 'Schulman et al. (PPO) & Code Alignment Researchers',
		paperTitle: 'Proximal Policy Optimization Algorithms & Verifiable Code Rewards',
		paperRef: 'arXiv:1707.06347',
		tags: ['PPO', 'RLHF', 'Verifiable Rewards', 'Compiler Feedback', 'Unit Test Assertions'],
		summary:
			'While general conversational LLMs require subjective human preference reward models, coding agents can be aligned using objective, binary ground truth from compilers, linters, and unit test runners.',
		equations: [
			{
				label: 'Standard PPO with Reference Policy Regularizer',
				latex:
					'\\max_{\\theta} \\mathbb{E}_{(x, y)} \\left[ R(x, y) - \\beta \\, \\mathbb{D}_{\\text{KL}}\\left(\\pi_\\theta(y \\mid x) \\,\\parallel\\, \\pi_{\\text{ref}}(y \\mid x)\\right) \\right]',
				displayMode: true,
				terms: [
					{
						symbol: 'R(x, y)',
						name: 'Reward Signal',
						explanation: 'Scalar feedback evaluating the generated code output y for task input x.'
					},
					{
						symbol: '\\beta \\, \\mathbb{D}_{\\text{KL}}',
						name: 'KL Penalty',
						explanation:
							'Prevents policy collapse and degeneration away from pre-trained language capabilities.'
					}
				]
			},
			{
				label: 'Verifiable Multi-Objective Code Reward Function',
				latex:
					'R_{\\text{code}}(x, y) = \\alpha_1 \\cdot \\mathbb{I}(\\text{Compiles}) + \\alpha_2 \\cdot \\frac{\\text{Tests Passed}}{\\text{Total Tests}} - \\alpha_3 \\cdot \\text{LinterErrors}',
				displayMode: true,
				terms: [
					{
						symbol: '\\mathbb{I}(\\text{Compiles})',
						name: 'Syntax Indicator',
						explanation:
							'Binary reward: 1 if code builds/parses without syntax errors, 0 otherwise.'
					},
					{
						symbol: '\\alpha_2 \\cdot \\frac{\\text{Passed}}{\\text{Total}}',
						name: 'Fractional Test Score',
						explanation:
							'Continuous gradient rewarding incremental progress across edge-case suites.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Subjective human ratings prone to superficial bias (e.g. favoring nicely commented broken code)',
			to: 'Deterministic execution metrics enforcing zero compilation errors and high test pass rates',
			mechanism:
				'Piping code execution returns from sandboxed runners directly into policy gradient reward estimators.'
		},
		impactOnCodingAgents: [
			'Directly penalized hallucinated API calls, type mismatches, and broken import statements.',
			'Trained models to favor robust edge-case handling over purely cosmetic styling.'
		],
		technicalDeepDive:
			'Unlike creative writing where quality is ambiguous, programming provides crisp ground truth: either the test suite returns exit code 0 or it fails. Verifiable rewards harness this deterministic feedback to guide gradient ascent.',
		interactiveToolId: 'grpo',
		metrics: [
			{ label: 'Reward Precision', value: '100% Deterministic', delta: 'no human rater variance' },
			{ label: 'Compilation Rate', value: '>95%', delta: 'after RL alignment' }
		]
	},
	{
		id: 'llama-cpp-2023',
		year: 2023,
		period: 'Mar 2023',
		title: 'The Local Inference Revolution: llama.cpp & GGUF Quantization',
		subtitle:
			'Pure C/C++ inference, 4-bit k-quants, and unified memory acceleration across consumer CPUs and Apple Silicon',
		category: 'hardware',
		authors: 'Georgi Gerganov & Open-Source Contributors',
		paperTitle: "llama.cpp: Port of Facebook's LLaMA Model in C/C++ & GGUF Specification",
		paperRef: 'GitHub: ggerganov/llama.cpp',
		tags: [
			'llama.cpp',
			'GGUF',
			'GGML',
			'k-quants',
			'Apple Metal',
			'AVX-512',
			'Local Inference',
			'mmap Zero-Copy'
		],
		summary:
			'Prior to March 2023, deploying LLMs required heavyweight Python runtimes, PyTorch, CUDA, and high-end enterprise NVIDIA GPUs. Georgi Gerganov authored llama.cpp in pure C/C++ with zero dependencies. Introducing block-level k-quantization (GGUF: Q4_K_M, Q5_K_M) and hardware SIMD intrinsics (AVX2, AVX-512, Apple Silicon Metal Performance Shaders), it allowed consumer laptops and unified memory Macs to execute state-of-the-art coding models locally at conversational speeds.',
		equations: [
			{
				label: 'Block Quantization & Dequantization with Scale Factor',
				latex: 'w_i = d \\cdot q_i + m, \\quad q_i \\in \\{-8, \\dots, 7\\}',
				displayMode: true,
				terms: [
					{
						symbol: 'd',
						name: 'Block Scale Factor (16-bit FP16)',
						explanation:
							'Shared scaling factor calculated for each 32-parameter block to map 4-bit integer values back into real float magnitudes.'
					},
					{
						symbol: 'q_i',
						name: '4-bit Quantized Integer',
						explanation:
							'Discrete nibble representation packing two model parameters into a single byte of memory.'
					},
					{
						symbol: 'm',
						name: 'Asymmetric Offset',
						explanation:
							'Block minimum offset shifting the quantization grid to preserve zero points and eliminate bias drift.'
					}
				]
			},
			{
				label: 'K-Quants Importance Matrix Minimization (imatrix)',
				latex:
					'\\mathcal{L}_{\\text{quant}} = \\sum_{j=1}^{D} H_{jj} \\cdot \\left( W_j - \\tilde{W}_j \\right)^2',
				displayMode: true,
				terms: [
					{
						symbol: 'H_{jj}',
						name: 'Hessian Importance Diagonal',
						explanation:
							'Approximated from activation tensors on coding calibration datasets; protects critical attention projection weights from aggressive quantization.'
					},
					{
						symbol: 'W_j - \\tilde{W}_j',
						name: 'Parameter Discretization Error',
						explanation:
							'Difference between original FP16 weights and discrete k-quant values (Q4_K_M).'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Bulky Python/PyTorch inference stacks strictly tethered to expensive datacenter GPUs via CUDA',
			to: 'Lightweight, single-binary C/C++ tensor runtime executing on consumer CPUs, unified memory APUs, and mobile silicon',
			mechanism:
				'Handwritten SIMD vector kernels, 256-element block quantization (GGUF), and memory-mapped model files (mmap) for instant zero-copy loading.'
		},
		impactOnCodingAgents: [
			'Enabled developers to run local coding assistants on standard laptops without cloud subscriptions or network latency.',
			'Democratized privacy-sensitive enterprise coding: proprietary codebases could now be refactored locally with zero data egress.',
			'Became the universal foundational C/C++ inference runtime powering Ollama, LM Studio, Jan, and local IDE extensions.'
		],
		technicalDeepDive:
			'Programming models like CodeLlama and DeepSeek-Coder contain millions of zero or near-zero weight deltas. llama.cpp utilizes k-quants, which dynamically assign varying bit depths across layers: sensitive attention head projections receive 5 or 6 bits while feed-forward matrices use 4 bits. With zero-copy memory mapping (`mmap`), a 34B code model loads into system RAM in fractions of a second, and Apple Silicon unified memory delivers up to 400 GB/s bandwidth for continuous token generation without a dedicated GPU.',
		interactiveToolId: 'precision',
		metrics: [
			{ label: 'Memory Reduction', value: '-75%', delta: 'FP16 to 4-bit GGUF' },
			{ label: 'Loading Latency', value: 'Instant', delta: 'via zero-copy mmap' }
		]
	},
	{
		id: 'flashattention2-2023',
		year: 2023,
		period: 'Jul 2023',
		title: 'FlashAttention-2 & Kernel Fusion',
		subtitle: 'Achieving 73% of theoretical peak GPU throughput via sequence-query outer loops',
		category: 'hardware',
		authors: 'Tri Dao',
		paperTitle: 'FlashAttention-2: Faster Attention with Better Work Partitioning and Parallelism',
		paperRef: 'arXiv:2307.08691',
		tags: ['FlashAttention-2', 'Work Partitioning', 'Split-KV', 'Peak TFLOPS', 'CUDA Optimization'],
		summary:
			'FlashAttention-1 still left significant GPU compute cycles on the table due to non-local atomic reductions. FlashAttention-2 reorganized the outer loop to parallelize over sequence queries and introduced Split-KV across thread blocks.',
		equations: [
			{
				label: 'Loop Re-ordering & Query Parallelism',
				latex: 'O_i = \\text{softmax}\\left(\\frac{Q_i K^T}{\\sqrt{d_k}}\\right) V',
				displayMode: true,
				terms: [
					{
						symbol: 'Split-KV',
						name: 'Key-Value Parallelism',
						explanation:
							'Distributes sequence length across multiple thread blocks even with batch size = 1.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Outer loop over keys/values requiring synchronization across thread blocks',
			to: 'Outer loop over queries eliminating inter-thread block atomics and maximizing warp occupancy',
			mechanism:
				'Better tensor core register allocation and dynamic work partitioning across streaming multiprocessors.'
		},
		impactOnCodingAgents: [
			'Doubled the execution speed of FlashAttention-1, hitting up to 225 TFLOPS on A100 GPUs.',
			'Made interactive IDE agent loops responsive, dropping multi-file context processing times to low single-digit seconds.'
		],
		technicalDeepDive:
			'FlashAttention-2 addressed thread idling during small batch single-user interactions. By partitioning the sequence dimension over CUDA thread blocks (Split-KV), it saturates all streaming multiprocessors even during single-developer agent turns.',
		interactiveToolId: 'flash',
		metrics: [
			{ label: 'A100 Peak Utilization', value: '73%', delta: '2x faster than FlashAttn-1' },
			{ label: 'Max Context Feasible', value: '64k - 128k', delta: 'at interactive speeds' }
		]
	},
	{
		id: 'ollama-lmstudio-2023',
		year: 2023,
		period: 'Aug 2023',
		title: 'Local Agent Tooling: Ollama, LM Studio & Air-Gapped Coding Daemons',
		subtitle:
			'Containerizing local models with Modelfiles, OpenAI-compatible local APIs, and zero-cost private agentic loops',
		category: 'agent-loop',
		authors: 'Jeffrey Morgan (Ollama), LM Studio Team & Local Agent Ecosystem',
		paperTitle: 'Ollama & LM Studio: Standardizing Local LLM Infrastructure for Developer Tooling',
		paperRef: 'Ollama Open Source / LM Studio Runtime',
		tags: [
			'Ollama',
			'LM Studio',
			'Modelfile',
			'Localhost API',
			'Air-Gapped Agents',
			'Zero Egress',
			'Continue.dev / Aider'
		],
		summary:
			'While llama.cpp provided the raw C++ engine, integrating local models into developer IDEs was hindered by complex CLI flags and process management. Ollama packaged models into Docker-style "Modelfiles" with an automated background daemon and an OpenAI-compatible HTTP server (localhost:11434), while LM Studio provided an intuitive graphical workbench with GPU VRAM layer offload controls (localhost:1234). This created the connective tissue that allowed autonomous coding tools (Aider, Cline, Continue.dev, OpenHands) to drive local agentic loops at zero API cost.',
		equations: [
			{
				label: 'GPU Layer Offloading Memory Split',
				latex:
					'V_{\\text{VRAM}} \\ge \\frac{N_{\\text{offload}}}{N_{\\text{layers}}} V_{\\text{model}} + V_{\\text{KV}}',
				displayMode: true,
				terms: [
					{
						symbol: 'N_{\\text{gpu\\_layers}}',
						name: 'Offloaded Transformer Layers',
						explanation:
							'Number of layers shifted into fast GPU VRAM in LM Studio / Ollama to maximize token generation rate.'
					},
					{
						symbol: 'V_{\\text{KV\\_cache}}',
						name: 'KV Cache VRAM Buffer',
						explanation:
							'Active context buffer reserved in VRAM to allow interactive code context processing without memory exhaustion.'
					}
				]
			},
			{
				label: 'Local Agent Loop Network Elimination',
				latex:
					'\\text{Latency}_{\\text{step}} = \\frac{T_{\\text{prefill}}}{R_{\\text{prefill}}} + \\frac{T_{\\text{gen}}}{R_{\\text{decode}}} + \\tau_{\\text{IPC}} \\quad (\\tau_{\\text{net}} = 0)',
				displayMode: true,
				terms: [
					{
						symbol: '\\tau_{\\text{net}} = 0',
						name: 'Zero Network Round-Trip Time',
						explanation:
							'Localhost loopback socket IPC eliminates TLS handshakes, cloud queue delays, and API rate limits, ensuring instant agent reactions.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Manual CLI flag management, fragmented weight downloads, and brittle Python wrapper servers',
			to: 'Unified local background daemons with automated GPU layer offloading, Modelfile versioning, and OpenAI-standard REST endpoints',
			mechanism:
				'Automated hardware capability detection (Metal/CUDA/ROCm), dynamic VRAM budgeting, and standardized JSON streaming over localhost.'
		},
		impactOnCodingAgents: [
			'Enabled coding tools (Aider, Continue, OpenHands) to run autonomous multi-turn bug-fixing cycles with zero API token bills.',
			'Empowered financial, healthcare, and enterprise software engineering teams to deploy autonomous coding agents on internal air-gapped codebases.',
			'Allowed seamless hot-swapping between lightweight 7B syntax completion models and deep 32B/70B reasoning models depending on agent task complexity.'
		],
		technicalDeepDive:
			'Autonomous software engineering tools rely on continuous loops: editing lines, running test suites, parsing errors, and re-prompting the model. Running this against cloud APIs can incur hundreds of dollars per complex task and sends proprietary source code over public networks. Ollama and LM Studio standardized the local endpoint: developers type `ollama run qwen2.5-coder` or open LM Studio, and IDE plugins immediately bind to `http://localhost:11434/v1` or `http://localhost:1234/v1`, executing full multi-turn coding agent trajectories with zero marginal cost.',
		interactiveToolId: 'react',
		metrics: [
			{ label: 'Token API Bill', value: '$0.00 / mo', delta: '100% Free Local' },
			{ label: 'Localhost RTT', value: '<1 ms', delta: 'Zero cloud latency' }
		]
	},
	{
		id: 'deterministic-patching-2023',
		year: 2023,
		period: 'Nov 2023',
		title: 'Deterministic Patching, Edit Primitives & AST Skeleton Maps',
		subtitle:
			'Replacing full-file hallucination with surgical string search-and-replace & unified diffs',
		category: 'agent-loop',
		authors: 'Aider, SWE-bench Team, Tree-sitter Developers',
		tags: [
			'AST Maps',
			'Tree-sitter',
			'Search/Replace',
			'Unified Diff',
			'git apply',
			'Prefix Caching'
		],
		summary:
			'Early agents attempted to regenerate entire files for a 2-line fix, often introducing subtle syntax deletions or truncations. Production agent harnesses pivoted to targeted diffs, AST skeletons, and GPU KV prefix caching.',
		equations: [
			{
				label: 'Turn Step Complexity with KV Caching',
				latex: 'T_{\\text{turn}} = O(N^2) \\;\\longrightarrow\\; O(N)',
				displayMode: true,
				terms: [
					{
						symbol: 'Resident KV',
						name: 'Key-Value Tensor Cache',
						explanation:
							'Pre-computed attention state of past repository turns preserved in GPU memory.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Emitting entire 1,000-line source files to modify a single line (high hallucination & latency)',
			to: 'Surgical search-and-replace blocks and unified git diffs validated by AST parsers',
			mechanism:
				'Constructing lightweight tree-sitter symbol maps to fit repositories into context, applying git apply hooks.'
		},
		impactOnCodingAgents: [
			'Reduced token output requirements per edit by 90%, preventing model truncation and context degradation.',
			'Allowed SWE-bench benchmarks to run reliably by evaluating real git commits against upstream repositories.'
		],
		technicalDeepDive:
			'A file modification in production code must preserve unrelated comments, formatting, and imports. Surgical edit primitives anchor the modification to unique surrounding code lines. Tree-sitter generates lightweight AST outlines (class signatures, function defs) so the agent navigates the repo without reading every byte.',
		interactiveToolId: 'react',
		metrics: [
			{ label: 'Token Consumption per Edit', value: '-85%', delta: 'surgical patches' },
			{ label: 'Patch Application Success', value: '>92%', delta: 'up from 45%' }
		]
	},
	{
		id: 'fp8-tensorrt-2024',
		year: 2024,
		period: 'Early 2024',
		title: 'FP8 Precision & Low-Latency Serving Engines (TensorRT-LLM)',
		subtitle: 'In-flight continuous batching, paged KV caching, and kernel fusion',
		category: 'hardware',
		authors: 'NVIDIA (Hopper Architecture / TensorRT-LLM)',
		tags: ['FP8', 'E4M3', 'E5M2', 'TensorRT-LLM', 'In-Flight Batching', 'Paged Attention'],
		summary:
			'Hopper H100 hardware introduced native FP8 Tensor Cores. TensorRT-LLM combined FP8 quantization with in-flight continuous batching and virtual-memory style paged KV caches to maximize serving density.',
		equations: [
			{
				label: 'Dual FP8 Numerical Precision Formats',
				latex:
					'x_{\\text{FP8}} = (-1)^s \\cdot 2^{e - \\text{bias}} \\cdot \\left(1 + \\frac{m}{2^M}\\right)',
				displayMode: true,
				terms: [
					{
						symbol: 'E4M3',
						name: '4 Exponent, 3 Mantissa',
						explanation:
							'Offers optimal signal-to-noise ratio for inference weight quantization without perplexity drop.'
					},
					{
						symbol: 'E5M2',
						name: '5 Exponent, 2 Mantissa',
						explanation: 'Matches FP16 dynamic range to prevent gradient vanishing in fine-tuning.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Static batching and 16-bit weight storage requiring multi-GPU node clusters for 70B models',
			to: 'Single-GPU 8-bit serving with dynamic token-level continuous batching and zero-fragmentation paged memory',
			mechanism:
				'Quantizing weights to 1 byte per parameter while managing KV cache blocks like operating system memory pages.'
		},
		impactOnCodingAgents: [
			'Cut the GPU infrastructure cost of running iterative agent loops by 50% to 75%.',
			'Enabled sub-second Time to First Token (TTFT) even when loading massive multi-file context prompts.'
		],
		technicalDeepDive:
			'Coding agents make unpredictable requests: one turn reads a 50k token log, while the next generates a 10 token bash command. In-flight continuous batching interleaves prefill and decode phases dynamically without stalling the pipeline.',
		interactiveToolId: 'precision',
		metrics: [
			{ label: 'Param Memory Footprint', value: '1 Byte / Param', delta: 'half of BF16' },
			{ label: 'Throughput', value: '2.5x higher', delta: 'on H100 clusters' }
		]
	},
	{
		id: 'mla-2024',
		year: 2024,
		period: 'May 2024',
		title: 'Multi-Head Latent Attention (MLA) & Context Economy',
		subtitle:
			'Compressing KV cache by 85–93% via low-rank latent vector projection with decoupled RoPE',
		category: 'architecture',
		authors: 'DeepSeek AI (DeepSeek-V2 / DeepSeek-V3)',
		paperTitle:
			'DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model',
		paperRef: 'arXiv:2405.04434',
		tags: ['MLA', 'Low-Rank Compression', 'KV Cache', 'Decoupled RoPE', 'Million Token Context'],
		summary:
			'In standard MHA or GQA, KV cache memory scales linearly with context length and concurrent turns, quickly exceeding GPU VRAM. MLA compresses Keys and Values into a single low-rank latent vector c_t^{KV}, decoupling position signals.',
		equations: [
			{
				label: 'KV Latent Compression & Reconstruction',
				latex:
					'\\begin{aligned} \\mathbf{c}_t^{KV} &= W^{DKV} \\mathbf{h}_t \\\\[3pt] \\mathbf{k}_{t, i}^C &= W^{UK}_i \\mathbf{c}_t^{KV}, \\quad \\mathbf{v}_{t, i}^C = W^{UV}_i \\mathbf{c}_t^{KV} \\end{aligned}',
				displayMode: true,
				terms: [
					{
						symbol: '\\mathbf{c}_t^{KV} \\in \\mathbb{R}^{d_c}',
						name: 'Latent KV Vector',
						explanation: 'Compressed token state cached during generation (d_c << n_h * d_h).'
					},
					{
						symbol: 'W^{DKV}, W^{UK}, W^{UV}',
						name: 'Down/Up Projections',
						explanation:
							'Learned low-rank matrix transforms that project down for storage and up for attention.'
					}
				]
			},
			{
				label: 'Decoupled Positional Key and Final Query-Key Attention',
				latex:
					'q_{t, i}^T k_{j, i} = \\left( [W^{UQ}_i \\mathbf{c}_t^Q]^T [W^{UK}_i \\mathbf{c}_j^{KV}] \\right) + \\left( [\\text{RoPE}(W^{QR}_i \\mathbf{c}_t^Q)]^T \\mathbf{k}_j^R \\right)',
				displayMode: true,
				terms: [
					{
						symbol: '\\mathbf{k}_j^R = \\text{RoPE}(W^{KR} \\mathbf{h}_j)',
						name: 'Decoupled RoPE Key',
						explanation:
							'Low-dimensional positional vector kept separate so rotation operations do not break down-projection cache invariance.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Caching full multi-head Key and Value tensors for all layers (huge VRAM footprint stalling long-context agents)',
			to: 'Caching a compact low-rank latent vector with matrix absorption into query projections during inference',
			mechanism:
				'Factoring Key-Value projections into low-rank matrices and evaluating position-free and position-aware components.'
		},
		impactOnCodingAgents: [
			'Compresses the per-token KV cache memory footprint by 80% to 90% compared to standard Multi-Head Attention.',
			'Allows persistent agent daemons to keep entire codebases and session histories resident in GPU memory without cache evictions.'
		],
		technicalDeepDive:
			'When serving a coding agent with 128k context, KV cache memory often dwarfs model weights. MLA preserves the modeling expressiveness of full multi-head attention while caching only a fraction of the data. During generation, up-projection weights W^{UK} can be absorbed directly into the query projection W^{UQ}, eliminating the need to ever materialize full keys in memory.',
		interactiveToolId: 'mla',
		metrics: [
			{ label: 'KV Cache Footprint', value: '-85% to -93%', delta: 'vs MHA baseline' },
			{ label: 'Concurrent Agent Sessions', value: '5x - 8x', delta: 'per GPU' }
		]
	},
	{
		id: 'flashattention3-2024',
		year: 2024,
		period: 'Jul 2024',
		title: 'FlashAttention-3: Asynchrony, TMA & Low-Precision FP8 Overlap',
		subtitle:
			'Unlocking 750–850 TFLOPs/s on Hopper H100 via Tensor Memory Accelerator, warp specialization, and incoherent processing',
		category: 'hardware',
		authors: 'Shah, Bikshandi, Zhang, Thakkar, Ramani, Dao (Stanford / Together AI / Princeton)',
		paperTitle: 'FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-Precision',
		paperRef: 'arXiv:2407.08608',
		tags: [
			'FlashAttention-3',
			'Hopper TMA',
			'WGMMA',
			'Warp Specialization',
			'FP8 Attention',
			'Hadamard Transform',
			'Software Pipelining'
		],
		summary:
			'While FlashAttention-2 maximized Tensor Core utilization on Ampere, Hopper introduced dedicated hardware units: the Tensor Memory Accelerator (TMA) for zero-register async memory copies, and asynchronous Warp-Group Matrix Multiply (WGMMA). FlashAttention-3 rearchitects attention around producer-consumer warp specialization, overlaps GEMM and softmax across iterations, and introduces randomized Hadamard incoherent processing to maintain exact FP8 numerical precision.',
		equations: [
			{
				label: 'Asynchronous Software Pipelined Softmax-GEMM',
				latex:
					'\\text{TMA}(K_j, V_j) \\longrightarrow \\text{WGMMA}(Q_i K_j^T) \\parallel \\text{softmax}(S_{ij})',
				displayMode: true,
				terms: [
					{
						symbol: '\\text{TMA.load.async}',
						name: 'Tensor Memory Accelerator',
						explanation:
							'Hardware engine executing multidimensional tensor tile transfers directly from HBM to Shared Memory bypassing SM registers.'
					},
					{
						symbol: '\\text{wgmma.async} \\parallel \\text{softmax}',
						name: 'Softmax-GEMM Overlap',
						explanation:
							'Consumer warp groups interleave exponential normalization of block j-1 with matrix multiplication of block j to hide latency.'
					}
				]
			},
			{
				label: 'FP8 Incoherent Outlier Suppression via Hadamard Transform',
				latex:
					'\\tilde{X} = X H_d, \\quad H_d = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} H_{d/2} & H_{d/2} \\\\ H_{d/2} & -H_{d/2} \\end{pmatrix}',
				displayMode: true,
				terms: [
					{
						symbol: 'H_d',
						name: 'Orthogonal Hadamard Matrix',
						explanation:
							'Rotates activations across hidden dimensions, dissipating extreme token outlier values into uniform distributions suitable for FP8 dynamic range without quantization loss.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Synchronous warp execution in FlashAttention-2 where threads stall on shared memory barriers and register-allocated tile loads',
			to: 'Decoupled asynchronous execution with 1 Producer Warp Group and 2 Consumer Warp Groups overlapping TMA loads, WGMMA multiplies, and softmax',
			mechanism:
				'Hopper hardware transaction barriers (mbarrier) coordinate data readiness across warp groups without CPU or SM polling.'
		},
		impactOnCodingAgents: [
			'Doubles context processing speed on H100 clusters, enabling sub-second repository-scale prefill across 128k token AST contexts.',
			'Enables native FP8 KV-cache and attention matrix arithmetic with zero degradation in code generation accuracy on pass@k benchmarks.',
			'Dramatically reduces per-token inference latency during interactive multi-turn agent debugging cycles.'
		],
		technicalDeepDive:
			'On NVIDIA Hopper GH100 GPUs, arithmetic throughput reached 1000 TFLOPS FP16/FP8, making standard kernel dispatch and register transfers severe bottlenecks. FlashAttention-3 introduces producer-consumer warp specialization: one warp group only issues TMA loads from HBM to Shared Memory, while two warp groups compute WGMMA and online softmax in parallel. By rotating token vectors with a fast Walsh-Hadamard transform, FlashAttention-3 cures the activation outlier pathology that historically degraded FP8 attention, delivering 740 to 850 TFLOPs/s (75–80% of theoretical H100 peak compute).',
		interactiveToolId: 'flash',
		metrics: [
			{ label: 'Hopper H100 Throughput', value: '740–850 TFLOPs', delta: '1.5x–2.0x vs FA-2' },
			{ label: 'Peak Hardware Efficiency', value: '78% Peak', delta: 'Highest on GH100' }
		]
	},
	{
		id: 'mtp-2024',
		year: 2024,
		period: 'Aug 2024',
		title: 'Multi-Token Prediction (MTP)',
		subtitle: 'Enforcing long-range syntax tree lookahead and zero-overhead speculative decoding',
		category: 'training',
		authors: 'Gloeckle et al. (Meta) & DeepSeek AI',
		paperTitle: 'Better & Faster Large Language Models via Multi-token Prediction',
		paperRef: 'arXiv:2404.19737',
		tags: ['MTP', 'Speculative Decoding', 'Lookahead', 'AST Awareness', 'Inference Acceleration'],
		summary:
			'Standard next-token prediction causes models to overfit to localized tokens rather than overall syntax trees. MTP trains K parallel prediction heads to forecast K future tokens, providing algorithmic lookahead and 2–3x speculative decoding speedups.',
		equations: [
			{
				label: 'Multi-Token Prediction Training Loss',
				latex:
					'\\mathcal{L}_{\\text{MTP}} = -\\frac{1}{T} \\sum_{t=1}^T \\sum_{k=1}^K \\lambda_k \\log P\\left(x_{t+k} \\mid \\mathbf{h}_t^{(k)}; \\theta\\right)',
				displayMode: true,
				terms: [
					{
						symbol: 'K',
						name: 'Lookahead Depth',
						explanation:
							'Number of consecutive future tokens forecasted simultaneously (typically K = 2 to 4).'
					},
					{
						symbol: '\\mathbf{h}_t^{(k)}',
						name: 'Head Representation',
						explanation:
							'Recurrent transformer representation conditioned on preceding hidden states and intermediate token embeddings.'
					},
					{
						symbol: '\\lambda_k',
						name: 'Loss Discount',
						explanation: 'Weighting coefficient decaying with prediction distance.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Greedy single-token prediction vulnerable to short-sighted syntactic traps (e.g. premature bracket closes)',
			to: 'Parallel horizon prediction forcing representations to plan entire statement blocks and function signatures',
			mechanism:
				'Stacking K lightweight recurrent transformer layers that predict future tokens concurrently during training.'
		},
		impactOnCodingAgents: [
			'Forces internal representations to encode complete syntactic structures and API argument chains.',
			'Built-in heads act as instant speculative draft proposals, accelerating code generation speed by 2x to 3x with zero extra draft model.'
		],
		technicalDeepDive:
			'Code is not linear prose; it is a serialized Abstract Syntax Tree. When an agent writes `for i in range(`, the closing tokens and indentations are already determined. MTP ensures the model represents this structural commitment upfront.',
		interactiveToolId: 'mtp',
		metrics: [
			{ label: 'Speculative Speedup', value: '2x - 3x', delta: 'lossless verification' },
			{ label: 'Code Reasoning Accuracy', value: '+3.5%', delta: 'on HumanEval/SWE' }
		]
	},
	{
		id: 'neuro-attention-2024',
		year: 2024,
		period: 'Oct 2024',
		title: 'Cognitive Neuropsychology of Attention & Pharmacodynamics',
		subtitle:
			'Prefrontal catecholamines (DA, NE, ACh), ADHD pharmacology (Elvanse, Ritalin), and transcending inattention in autonomous agents',
		category: 'architecture',
		authors: 'Arnsten, Posner, Barkley & Modern AI Neuro-Homology',
		paperTitle:
			'Neuromodulation of Prefrontal Cortical Circuits & Mathematical Homology to Transformer Attention',
		paperRef: 'Nature Rev Neurosci / Neuropsychopharmacology',
		tags: [
			'Prefrontal Cortex',
			'ADHD & Inattention',
			'Dopamine & Norepinephrine',
			'Elvanse & Ritalin',
			'Arnsten Inverted-U',
			'Softmax Temperature',
			'Signal-to-Noise Ratio'
		],
		summary:
			'Biological working memory and artificial transformers share a profound mathematical homology. In the prefrontal cortex (PFC), dopamine (D1) and norepinephrine (alpha-2A) gate signal-to-noise ratio: deficient catecholamine tone (ADHD) leads to attentional drift, distractor intrusion, and impulsivity, exactly paralleling high softmax entropy (tau -> infinity) and context collapse in LLM agents. ADHD therapeutics (Lisdexamfetamine/Elvanse, Methylphenidate/Ritalin) optimize PFC gain, mirroring FlashAttention SRAM tiling and KV-cache persistence in silicon.',
		equations: [
			{
				label: 'Prefrontal Signal-to-Noise Ratio & Softmax Homology',
				latex:
					'\\begin{aligned} \\text{SNR}_{\\text{PFC}} &= \\frac{\\mu_{\\text{signal}}(D_1, \\alpha_{2A})}{\\sigma_{\\text{noise}}^2} \\\\[4pt] P_{ij} &= \\text{softmax}\\left(\\frac{Q_i K_j^T}{\\tau \\sqrt{d_k}}\\right) \\end{aligned}',
				displayMode: true,
				terms: [
					{
						symbol: 'D_1, \\alpha_{2A}',
						name: 'Catecholamine Receptors',
						explanation:
							'D1 dopaminergic receptors sculpt lateral inhibition, while alpha-2A noradrenergic receptors enhance recurrent network synaptic connectivity.'
					},
					{
						symbol: '\\tau \\sqrt{d_k}',
						name: 'Softmax Temperature & Dimension Scale',
						explanation:
							'Controls probability distribution entropy: high values scatter attention uniformly across distractors; optimal values isolate salient tokens.'
					}
				]
			},
			{
				label: 'Pharmacodynamics of Psychostimulant Catecholamine Modulation',
				latex:
					'\\frac{d[\\text{DA}]_{\\text{syn}}}{dt} = k_{\\text{release}} + J_{\\text{efflux}}(\\text{TAAR1}) - \\frac{V_{\\max} [\\text{DA}]_{\\text{syn}}}{K_m (1 + [\\text{MPH}]/K_i) + [\\text{DA}]_{\\text{syn}}}',
				displayMode: true,
				terms: [
					{
						symbol: 'J_{\\text{efflux}}(\\text{TAAR1})',
						name: 'D-Amphetamine / Elvanse Carrier Efflux',
						explanation:
							'Phosphorylation of dopamine transporters via intracellular TAAR1 triggers reverse transport, sustaining elevated tonic DA pools.'
					},
					{
						symbol: '[\\text{MPH}] / K_i',
						name: 'Methylphenidate (Ritalin) Blockade',
						explanation:
							'Competitive reuptake inhibition preventing clearance of catecholamines from prefrontal microcircuits, identical to KV-cache preservation.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Treating attention purely as heuristic matrix multiplication without biological grounding in working memory limits, noise gating, or impulse control',
			to: 'Unified bi-directional homology between PFC catecholaminergic gain control (Arnsten inverted-U) and artificial attention temperature/caching',
			mechanism:
				'Dopaminergic D1 tuning and alpha-2A noradrenergic signaling enhance target salience while dampening distractor noise, directly analogous to softmax variance scaling and KV-cache retention.'
		},
		impactOnCodingAgents: [
			'Explains and mitigates agentic "attention drift" and tool thrashing where long conversational histories dilute salient repository context.',
			'Inspires KV-cache persistent retention policies and prefix sharing, analogous to pharmacologically stabilized prefrontal synaptic persistence.',
			'Informs test-time search exploration vs exploitation boundaries: matching catecholaminergic optimal gain with dynamic inference temperature scheduling.'
		],
		technicalDeepDive:
			'In human neuropsychology, attention is not a monolithic switch but a fragile dynamic equilibrium governed by the prefrontal cortex (PFC). Under low catecholamine conditions (such as in ADHD), insufficient alpha-2A noradrenergic stimulation fails to filter environmental noise, and weak D1 dopaminergic stimulation fails to amplify task-relevant signals, resulting in distractibility, hyper-reactivity, and working memory decay. Psychostimulants such as Lisdexamfetamine (Elvanse) and Methylphenidate (Ritalin) elevate synaptic DA and NE by blocking reuptake (DAT/NET) and triggering vesicular efflux (VMAT2/TAAR1), shifting PFC networks into the peak of Arnsten’s Inverted-U curve. In transformer architectures, an exact mathematical mirror exists: if the dot products are unscaled or the temperature tau is uncalibrated, attention distributions either saturate into degenerate delta distributions or dissolve into uniform noise (high entropy), causing agentic tool hallucination and codebase inattentiveness.',
		interactiveToolId: 'neuro',
		metrics: [
			{ label: 'Prefrontal SNR', value: '+14.8 dB', delta: 'Arnsten Inverted-U Peak' },
			{ label: 'Distractor Suppression', value: '94.2%', delta: '-68% agentic tool thrashing' }
		]
	},
	{
		id: 'blackwell-architecture-2024',
		year: 2024,
		period: 'Late 2024',
		title: 'NVIDIA Blackwell: 2nd Gen Transformer Engine, NVFP4 Microscaling & NVLink-5',
		subtitle:
			'Dual-die 10 TB/s NV-HBI, 20 PFLOPS FP4 microscaling, and 1.8 TB/s NVLink-5 exascale clusters for trillion-parameter coding agents',
		category: 'hardware',
		authors: 'NVIDIA Architecture & Systems Engineering',
		paperTitle:
			'NVIDIA Blackwell Architecture: Next-Generation Computing for Generative AI & Reasoning Agents',
		paperRef: 'NVIDIA Technical Whitepaper',
		tags: [
			'Blackwell',
			'NVFP4',
			'Microscaling Formats',
			'NVLink-5',
			'NV-HBI',
			'Transformer Engine 2.0',
			'B200 / GB200 NVL72',
			'Decompression Engine'
		],
		summary:
			'Blackwell overcomes reticle limits via dual-die packaging connected by a 10 TB/s bidirectional NV-HBI link, acting as a single 208-billion transistor monolithic GPU. Its 2nd Gen Transformer Engine introduces native NVFP4 / MXFP4 microscaling formats with per-block scale vectors, delivering 20 PFLOPS of 4-bit compute per GPU, while NVLink-5 scales to 72 GPUs in a single liquid-cooled NVL72 rack with 130 TB/s aggregate all-to-all communication.',
		equations: [
			{
				label: 'Block Microscaled Floating Point (OCP MXFP4 Standard)',
				latex:
					'X_{i} = S_{\\text{block}} \\times x_{i}^{\\text{NVFP4}}, \\quad S_{\\text{block}} \\in \\text{E8M0}, \\; x_i \\in \\text{E2M1}',
				displayMode: true,
				terms: [
					{
						symbol: 'S_{\\text{block}}',
						name: 'Microscale Factor (8-bit E8M0)',
						explanation:
							'Shared power-of-two exponent scaling factor assigned to each 16 or 32-element vector block to retain high dynamic range.'
					},
					{
						symbol: 'x_i^{\\text{NVFP4}}',
						name: '4-bit Quantized Element (E2M1)',
						explanation:
							'1 sign bit, 2 exponent bits, 1 mantissa bit representing 16 discrete states per parameter, halving memory bandwidth demand over FP8.'
					}
				]
			},
			{
				label: 'NVL72 Exascale Domain & NV-HBI Inter-Die Fabric',
				latex:
					'\\text{BW}_{\\text{NV-HBI}} = 10\\text{ TB/s}, \\quad \\text{BW}_{\\text{Rack}} = 72 \\times 1.8\\text{ TB/s} = 130\\text{ TB/s Aggregate}',
				displayMode: true,
				terms: [
					{
						symbol: '\\text{BW}_{\\text{NV-HBI}}',
						name: 'High-Bandwidth Interface',
						explanation:
							'Direct die-to-die interconnect connecting two full reticle chips into a single unified GPU with zero software latency.'
					},
					{
						symbol: '\\text{BW}_{\\text{Rack}}',
						name: 'NVLink-5 Exascale Fabric',
						explanation:
							'72-GPU all-to-all non-blocking fabric providing copper interconnects and in-network SHARP all-reduce acceleration for Mixture-of-Experts routing.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Monolithic single-die GPUs bound by reticle size limits (Hopper GH100) running FP8 with per-tensor quantization',
			to: 'Dual-die 208B-transistor chiplet packaging with fine-grained per-vector block microscaling (NVFP4) and hardware decompression engines',
			mechanism:
				'10 TB/s ultra-dense physical interconnect (NV-HBI) and 2nd Gen Transformer Engine hardware managing tile-level block scale factors.'
		},
		impactOnCodingAgents: [
			'Shrinks 70B parameter coding models to only 35 GB of VRAM, allowing full monorepo contexts and daemons to reside on a single GPU.',
			'Accelerates MoE all-to-all cross-node token dispatch in reasoning models (like DeepSeek-V3/R1) by 4x through NVLink-5 SHARP engines.',
			'Hardware Decompression Engine decodes LZ4/Snappy repository tarballs and AST syntax blobs at 800 GB/s directly into GPU memory.'
		],
		technicalDeepDive:
			'Moore’s Law reticle limits meant chips could no longer grow physically larger on a single silicon slice. NVIDIA Blackwell connects two reticle-sized dies with NV-HBI (10 TB/s), sharing memory, L2 caches, and SM clusters with zero programmer intervention. Its 2nd Gen Transformer Engine adds NVFP4 / MXFP4: by calculating an 8-bit scale factor for every 16 numbers, 4-bit weights preserve full BF16 benchmark accuracy while doubling arithmetic throughput to 20 PFLOPS per B200 chip.',
		interactiveToolId: 'precision',
		metrics: [
			{ label: 'Compute Throughput', value: '20 PFLOPS FP4', delta: '5x vs Hopper FP8' },
			{ label: 'NVLink-5 Bandwidth', value: '1.8 TB/s/GPU', delta: '2x vs Hopper' }
		]
	},
	{
		id: 'grpo-2024',
		year: 2024,
		period: 'Dec 2024',
		title: 'Critic-Free RL: Group Relative Policy Optimization (GRPO)',
		subtitle:
			'Eliminating value network overhead via group sample statistics and verifiable test execution',
		category: 'training',
		authors: 'DeepSeek AI (DeepSeek-R1-Zero / DeepSeek-R1)',
		paperTitle:
			'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
		paperRef: 'arXiv:2501.12948',
		tags: ['GRPO', 'Critic-Free', 'Reinforcement Learning', 'DeepSeek-R1', 'Verifiable Execution'],
		summary:
			'Standard PPO required an auxiliary Critic model equal in size to the Actor to estimate baseline state values, doubling VRAM requirements and suffering value drift on long bash logs. GRPO normalizes rewards across a group of G candidate rollouts.',
		equations: [
			{
				label: 'Group Relative Advantage Normalization',
				latex:
					'A_i = \\frac{r_i - \\text{mean}(\\{r_1, \\dots, r_G\\})}{\\text{std}(\\{r_1, \\dots, r_G\\})}',
				displayMode: true,
				terms: [
					{
						symbol: 'G',
						name: 'Candidate Group Size',
						explanation: 'Number of independent code trajectories sampled per prompt q.'
					},
					{
						symbol: 'r_i',
						name: 'Execution Reward',
						explanation:
							'Deterministic score from running candidate i against compilers and test suites.'
					},
					{
						symbol: 'A_i',
						name: 'Normalized Advantage',
						explanation:
							'Measures how much better candidate i is compared to the peer group without needing a critic network.'
					}
				]
			},
			{
				label: 'GRPO Policy Objective with Analytic Token KL',
				latex:
					'\\mathcal{J}_{\\text{GRPO}}(\\theta) = \\mathbb{E}\\left[ \\frac{1}{G} \\sum_{i=1}^G \\frac{1}{\\vert{}o_i\\vert{}} \\sum_{t=1}^{\\vert{}o_i\\vert{}} \\left( \\min\\left(\\frac{\\pi_\\theta(o_{i,t})}{\\pi_{\\theta_{\\text{old}}}(o_{i,t})} A_i, \\; \\text{clip}\\dots\\right) - \\beta D_{\\text{KL}}^{(t)} \\right) \\right]',
				displayMode: true,
				terms: [
					{
						symbol: 'D_{\\text{KL}}^{(t)}',
						name: 'Analytic KL Term',
						explanation:
							'Computed directly as \\frac{\\pi_{\\text{ref}}}{\\pi_\\theta} - \\log\\frac{\\pi_{\\text{ref}}}{\\pi_\\theta} - 1 with zero learned critic approximation error.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Actor-Critic PPO requiring an extra 70B+ critic model in GPU memory prone to value divergence',
			to: 'Critic-free group advantage calculated from compiler passes and deterministic test verification',
			mechanism:
				'Sampling G solutions in parallel, evaluating binary test passes, and normalizing advantages across the sample cluster.'
		},
		impactOnCodingAgents: [
			'Allowed large models to undergo deep RL reasoning training at half the GPU cluster cost of standard PPO.',
			'Sparked autonomous emergence of extended thinking, error diagnosis, and self-backtracking in coding agents.'
		],
		technicalDeepDive:
			'In coding tasks, estimating value V(s) at intermediate token positions in thousands of lines of compiler output is notoriously noisy. GRPO bypasses this entirely: by running G rollouts against unit tests, the relative ranking of passing vs failing trajectories directly forms the gradient baseline.',
		interactiveToolId: 'grpo',
		metrics: [
			{ label: 'Critic VRAM Overhead', value: '0 GB', delta: '-50% training GPU memory' },
			{ label: 'SWE-bench Verification', value: 'Surged', delta: 'powers DeepSeek-R1' }
		]
	},
	{
		id: 'test-time-search-2025',
		year: 2025,
		period: 'Jan 2025',
		title: 'Test-Time Compute & Search Scaling Laws',
		subtitle: 'Scaling inference compute log-linearly via MCTS, PRMs, and sandbox rollouts',
		category: 'scaling',
		authors: 'OpenAI (o1, o3) & DeepSeek AI (R1)',
		tags: ['Test-Time Compute', 'Extended Thinking', 'PRMs', 'MCTS', 'UCT', 'Ephemeral Sandboxes'],
		summary:
			'Pre-training scaling began encountering data bottlenecks. Reasoning models established that compute allocated at inference time—through extended chain-of-thought, Monte Carlo Tree Search, and process verifiers—scales task success log-linearly.',
		equations: [
			{
				label: 'Inference Reasoning Decomposition',
				latex: 'P(Y \\mid X) = \\sum_{Z} P(Z \\mid X) P(Y \\mid X, Z)',
				displayMode: true,
				terms: [
					{
						symbol: 'Z',
						name: 'Internal Reasoning Trace',
						explanation:
							'Decomposition of hypotheses, edge cases, sanity checks, and self-corrections.'
					},
					{
						symbol: 'Y',
						name: 'Final Tool Action / Patch',
						explanation: 'The final deterministic code patch or terminal execution command.'
					}
				]
			},
			{
				label: 'Test-Time Compute Scaling Law',
				latex:
					'P(\\text{Success}) \\propto C_{\\text{train}}^{\\alpha} \\cdot C_{\\text{test}}^{\\gamma} \\quad (\\gamma > 0)',
				displayMode: true,
				terms: [
					{
						symbol: 'C_{\\text{test}}',
						name: 'Test-Time Compute',
						explanation:
							'Inference tokens expended on exploration rollouts, test executions, and hypothesis validation.'
					}
				]
			},
			{
				label: 'Tree Search Upper Confidence Bound (UCT)',
				latex:
					'\\text{UCT}(s, a) = Q(s, a) + c_{\\text{puct}} \\cdot P(a \\mid s) \\frac{\\sqrt{\\sum_{b} N(s, b)}}{1 + N(s, a)}',
				displayMode: true,
				terms: [
					{
						symbol: 'Q(s, a)',
						name: 'Action Value',
						explanation:
							'Empirical pass rate of downstream unit tests from state s taking tool action a.'
					},
					{
						symbol: 'P(a \\mid s)',
						name: 'Prior Probability',
						explanation: 'Initial model policy probability of proposing tool action a.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Greedy single-pass forward generation expecting flawless code on first attempt',
			to: 'System-2 deliberative search: hypothesizing, branching in ephemeral sandboxes, pruning failing branches',
			mechanism:
				'Allocating additional tokens during inference to run MCTS, PRM evaluations, and automated test passes.'
		},
		impactOnCodingAgents: [
			'Agents explore alternative architectural refactorings in parallel scratch environments before touching production branches.',
			'Eliminates brittle one-shot hallucinations by verifying code execution against test assertions during internal thought.'
		],
		technicalDeepDive:
			'Test-time scaling trades compute time for certainty. An agent given 5 minutes to test 10 patch hypotheses across micro-sandboxes solves complex multi-file bugs that an instantaneous answer model fails on 100% of the time.',
		interactiveToolId: 'test-time',
		metrics: [
			{ label: 'SWE-bench Verified', value: '>70%', delta: 'up from 13% in 2023' },
			{ label: 'Scaling Dimension', value: 'C_test', delta: 'bypasses pretrain plateau' }
		]
	},
	{
		id: 'rdna4-matrix-2025',
		year: 2025,
		period: 'Early 2025',
		title: 'AMD RDNA 4: 2nd Gen AI Accelerators, FP8 WMMA & Client Agent Silicon',
		subtitle:
			'Democratizing local agent execution with native FP8 matrix throughput, Wave32 matrix execution, and unified ROCm 6',
		category: 'hardware',
		authors: 'AMD GPU Architecture & ROCm Core Systems',
		paperTitle: 'AMD RDNA 4 Compute Architecture: Matrix Accelerators & Edge AI Execution',
		paperRef: 'AMD Architecture Whitepaper',
		tags: [
			'AMD RDNA 4',
			'WMMA Instructions',
			'FP8 Native',
			'ROCm 6',
			'Local Coding Agents',
			'Wave Matrix',
			'Navi 4x'
		],
		summary:
			'While datacenter clusters host trillion-parameter models, production software engineering workflows require responsive, privacy-preserving on-device coding daemons. AMD RDNA 4 (Navi 4x) introduces 2nd Generation AI Accelerators with double-rate Wave Matrix Multiply-Accumulate (WMMA) instructions supporting native FP8 (E4M3, E5M2) and INT4 matrix operations, supported by a unified ROCm 6 software stack.',
		equations: [
			{
				label: 'Dual-Issue Wave Matrix Multiply-Accumulate (WMMA)',
				latex:
					'D = A \\cdot B + C, \\quad A, B \\in \\mathbb{R}^{16 \\times 16}_{\\text{FP8/INT4}}',
				displayMode: true,
				terms: [
					{
						symbol: 'D_{16\\times 16}',
						name: 'Wave Accumulator Matrix',
						explanation:
							'Cooperative 32-thread (Wave32) register tile holding FP32 or FP16 accumulated sums.'
					},
					{
						symbol: 'A, B',
						name: 'Native FP8 Matrix Operands',
						explanation:
							'Direct hardware support for E4M3 and E5M2 byte representations, doubling math throughput over RDNA 3.'
					}
				]
			},
			{
				label: 'Local Client Agent Memory Throughput',
				latex:
					'\\text{Tokens/sec} = \\frac{\\text{BW}_{\\text{GDDR6}} + \\eta_{\\text{IC}} \\cdot \\text{BW}_{\\text{InfinityCache}}}{\\text{ModelSize}_{\\text{FP4/FP8}} \\times \\text{TokensPerStep}}',
				displayMode: true,
				terms: [
					{
						symbol: '\\text{BW}_{\\text{InfinityCache}}',
						name: 'AMD Infinity Cache',
						explanation:
							'High-bandwidth on-chip SRAM cache delivering multi-terabyte/sec local bandwidth to keep small LLM weights on-die.'
					},
					{
						symbol: '\\text{ModelSize}_{\\text{FP4/FP8}}',
						name: 'Quantized Agent Memory',
						explanation:
							'Allows 7B–14B coder models to fit within 16GB consumer VRAM alongside IDEs and developer toolchains.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Client GPUs relying on generic SIMD ALUs with limited 1st gen WMMA requiring cloud API calls for code generation',
			to: 'Dedicated 2nd Gen AI Accelerators with double-rate native FP8/FP4 WMMA instructions integrated into consumer workstations',
			mechanism:
				'Hardware-fused wave matrix execution units and ROCm 6 hipBLASLt kernels running FlashAttention locally on consumer hardware.'
		},
		impactOnCodingAgents: [
			'Powers local, air-gapped coding assistants (e.g., Qwen2.5-Coder 7B/14B) running in VS Code / Neovim at >100 tokens/sec.',
			'Enables zero-latency AST syntax completions and real-time keystroke infilling without telemetry or API subscription costs.',
			'Unifies client and datacenter software pipelines: code compiled for AMD CDNA 3 (MI300X) runs seamlessly on RDNA 4 developer workstations.'
		],
		technicalDeepDive:
			'Autonomous software engineering requires both massive cloud clusters for planning and agile edge models for instantaneous keystroke infilling and local linter repair. AMD RDNA 4 equips every Compute Unit with 2nd Gen AI Accelerators, implementing native hardware execution for `v_wmma_f32_16x16x16_fp8` and INT4. Combined with AMD Infinity Cache and ROCm 6, consumer developer rigs run state-of-the-art coding agents locally with sub-10ms first-token latency.',
		interactiveToolId: 'precision',
		metrics: [
			{ label: 'WMMA AI Throughput', value: '2x vs RDNA 3', delta: 'Native FP8 & INT4' },
			{ label: 'Local Agent Speed', value: '>100 tps', delta: 'On-device Qwen 7B' }
		]
	},
	{
		id: 'industrial-protocols-2026',
		year: 2026,
		period: '2025–2026',
		title: 'Industrial Agent Protocols & Micro-VM Sandboxes',
		subtitle: 'Model Context Protocol (MCP), Code Graph PageRank, and FP4 Blackwell Microscaling',
		category: 'agent-loop',
		authors: 'Anthropic (MCP), Cloud Native Agent Alliances, NVIDIA (Blackwell)',
		paperTitle: 'Model Context Protocol Specification & Autonomous SEA Architectures',
		tags: ['MCP', 'Personalized PageRank', 'Micro-VMs', 'Firecracker', 'NVFP4', 'SWE-bench >70%'],
		summary:
			'Standardized client-server RPCs (Model Context Protocol), AST call-graph PageRank retrieval, and micro-VM sandboxes (Firecracker/WASM) bridged the gap between raw models and autonomous software engineering agents.',
		equations: [
			{
				label: 'Code Graph Personalized PageRank Retrieval',
				latex:
					'\\mathbf{p} = (1 - d)\\mathbf{v}_{\\text{query}} + d \\cdot \\mathbf{A}_{\\text{norm}}^T \\mathbf{p}',
				displayMode: true,
				terms: [
					{
						symbol: '\\mathbf{v}_{\\text{query}}',
						name: 'Seed Query Vector',
						explanation:
							'One-hot vector marking files or symbols named in issue report or stack trace.'
					},
					{
						symbol: '\\mathbf{A}_{\\text{norm}}',
						name: 'Normalized Adjacency Matrix',
						explanation:
							'Column-stochastic matrix representing the AST call-graph and cross-file import graph.'
					},
					{
						symbol: 'd \\approx 0.85',
						name: 'Damping Factor',
						explanation:
							'Probability of continuing to walk the import graph versus jumping back to issue seed nodes.'
					}
				]
			},
			{
				label: 'Microscaling NVFP4 / MXFP4 Format',
				latex:
					'X_{i} = S_{\\text{block}} \\cdot x_{i}, \\quad S_{\\text{block}} \\in \\text{E8M0}, \\; x_i \\in \\text{E2M1}',
				displayMode: true,
				terms: [
					{
						symbol: '4-bit E2M1',
						name: 'Ultra-Dense Weights',
						explanation: 'Reduces model weight memory footprint by 4x relative to BF16.'
					},
					{
						symbol: 'Micro-scaling Factor',
						name: 'Per-Tile Dynamic Exponent',
						explanation: 'Preserves numeric accuracy across large activation spikes.'
					}
				]
			}
		],
		architecturalShift: {
			from: 'Ad-hoc text scraping, naive vector RAG, and dangerous unisolated local shell execution',
			to: 'Standardized MCP RPCs, static-analysis graph PageRank, and micro-VM snapshots with instant rollback',
			mechanism:
				'Decoupling agent clients from language servers, databases, and sandboxed runtimes via open specifications.'
		},
		impactOnCodingAgents: [
			'Personalized PageRank extracts the exact 5–10 relevant files across a 500,000-line repository, cutting token costs by 90%.',
			'Micro-VM sandboxing lets agents execute untrusted tests, destructive git rebases, and migrations with instant snapshot rollback.',
			'FP4 microscaling enables serving 70B+ reasoning agents locally or at fraction-of-a-cent per task cost.'
		],
		technicalDeepDive:
			'In 2026, an autonomous coding agent is not merely a model in a prompt box. It is an industrial orchestration engine: static code analyzers construct symbol call graphs, PageRank pinpoints minimal context, MCP tools provide standardized LSP actions, and Firecracker micro-VMs allow fearless execution.',
		interactiveToolId: 'pagerank',
		metrics: [
			{
				label: 'SWE-bench Verified Pass Rate',
				value: '>70%',
				delta: 'autonomous production-grade'
			},
			{ label: 'Context Retrieval Precision', value: '>94%', delta: 'via Call-Graph PageRank' },
			{ label: 'Hardware Footprint', value: '4x density', delta: 'NVFP4 on Blackwell' }
		]
	}
];

export function getAttentionHighlight(
	milestone: Milestone
): 'flash-attention' | 'attention-core' | null {
	if (
		milestone.id === 'flashattention-2022' ||
		milestone.id === 'flashattention2-2023' ||
		milestone.id === 'flashattention3-2024'
	) {
		return 'flash-attention';
	}
	if (
		milestone.id === 'transformer-2017' ||
		milestone.id === 'rope-2021' ||
		milestone.id === 'mla-2024' ||
		milestone.id === 'neuro-attention-2024'
	) {
		return 'attention-core';
	}
	return null;
}

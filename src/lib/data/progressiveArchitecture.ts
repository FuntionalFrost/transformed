import type { CategoryId } from '../types';
import type { SparklineColor } from 'yaxa-svelte';

export interface AttentionBottleneck {
	id: 'context' | 'io' | 'compute' | 'kv-cache';
	channel: string;
	title: string;
	shortTitle: string;
	color: 'cyan' | 'amber' | 'emerald' | 'violet';
	stat2026: string;
	stat2017: string;
	sparklineData: number[];
	sparklineColor: SparklineColor;
	bottleneck2017: string;
	breakthrough: string;
	seaImpact: string;
	technologies: string[];
	labSimulatorId: 'rope' | 'flash' | 'precision' | 'mla' | 'bitboard';
	labSimulatorName: string;
	deepDive: string;
}

export interface SeaPillar {
	id: CategoryId;
	pillarNumber: number;
	layerName: string;
	subtitle: string;
	role: string;
	color: 'cyan' | 'emerald' | 'amber' | 'violet' | 'rose';
	challenge2017: string;
	solution2026: string;
	progressiveHandOff: string;
	runtimeStep: string;
	runtimeAction: string;
	inputArtifact: string;
	outputArtifact: string;
	keyMilestones: string[];
	labSimulatorId:
		'rope' | 'flash' | 'test-time' | 'grpo' | 'react' | 'chinchilla' | 'passk' | 'fim' | 'mla';
	labSimulatorName: string;
}

export const ATTENTION_BOTTLENECKS: AttentionBottleneck[] = [
	{
		id: 'context',
		channel: 'BUS_0: TMA_CTX',
		title: 'Effective Context Horizon',
		shortTitle: 'Context Horizon',
		color: 'cyan',
		stat2026: '1M+ Tokens',
		stat2017: '512 Tokens',
		sparklineData: [0.512, 1, 2, 4, 8, 32, 128, 512, 1000],
		sparklineColor: 'info',
		bottleneck2017:
			'Fixed absolute position embeddings (Vaswani 2017) collapsed beyond 512 tokens. Repositories with tens of thousands of lines had to be aggressively chunked, causing models to lose track of cross-file function calls and imports.',
		breakthrough:
			'Rotary Position Embeddings (RoPE, 2021) rotate query-key vectors by relative distance, while RingAttention (2023) distributes sequence blocks across GPU rings via overlapped communication.',
		seaImpact:
			'Autonomous agents can hold an entire code repository, dependency graph, and compiler error trace in a single active memory window with >99.8% Needle-in-a-Haystack recall.',
		technologies: ['RoPE (Su et al.)', 'RingAttention', 'YaRN Long-Context', 'DeepSeek MLA'],
		labSimulatorId: 'rope',
		labSimulatorName: 'RoPE & ALiBi Explorer',
		deepDive:
			'Standard Transformers computed absolute coordinate lookups W_pos[i] which failed catastrophically when i exceeded pre-training limits. RoPE instead injects relative token distance through complex inner-product rotation matrices R_{Θ,m}^d, ensuring that token dot-products depend solely on relative distance (m - n). RingAttention further decomposes multi-million token sequences across a ring of GPUs, overlapping inter-node P2P communication with tensor core compute.'
	},
	{
		id: 'io',
		channel: 'BUS_1: SRAM_TILE',
		title: 'HBM Memory IO Wall',
		shortTitle: 'Memory IO Wall',
		color: 'amber',
		stat2026: 'O(N) Linear IO',
		stat2017: 'O(N²) HBM Thrash',
		sparklineData: [100, 85, 60, 35, 18, 8, 4, 1],
		sparklineColor: 'warning',
		bottleneck2017:
			'Standard attention materialized the intermediate N × N attention matrix into slow High-Bandwidth Memory (HBM). For an 8k context, this wrote gigabytes of temporary data per forward pass, saturating the GPU memory bus and triggering fatal Out-Of-Memory (OOM) crashes.',
		breakthrough:
			'FlashAttention-1/2/3 (Tri Dao et al.) introduced online softmax tiling. Attention is evaluated block-by-block directly inside ultra-fast on-chip SRAM (256 KB per SM), writing only the final output to HBM.',
		seaImpact:
			'Reduces memory reads/writes from quadratic O(N²) to linear O(N). Enables agents to run thousands of fast, multi-turn tool calling loops without exhausting GPU memory.',
		technologies: [
			'FlashAttention 1-3',
			'Online Softmax Tiling',
			'Hopper TMA Async',
			'SRAM Bitboards'
		],
		labSimulatorId: 'flash',
		labSimulatorName: 'FlashAttention SRAM Visualizer',
		deepDive:
			'GPU High Bandwidth Memory (HBM) delivers ~3.3 TB/s on modern chips, whereas on-chip SRAM delivers over 19 TB/s. Naive attention computed S = QK^T, wrote S to HBM, read S back to compute P = softmax(S), wrote P back to HBM, and read P to compute O = PV. FlashAttention computes the entire chain in on-chip SRAM using an online renormalization formula, never materializing the N × N intermediate matrix in main DRAM.'
	},
	{
		id: 'compute',
		channel: 'BUS_2: WARP_ALU',
		title: 'Tensor Core Efficiency & Micro-Precision',
		shortTitle: 'Silicon FLOPs',
		color: 'emerald',
		stat2026: '73% A100/H100 MFU',
		stat2017: '<25% MFU (Starved)',
		sparklineData: [22, 28, 35, 42, 54, 65, 73],
		sparklineColor: 'success',
		bottleneck2017:
			'Despite immense theoretical peak FLOPs, Tensor Cores spent 70–80% of their operational cycles idling, starved while waiting for memory loads across warp boundaries in FP32/FP16 precision.',
		breakthrough:
			'Hopper/Blackwell Tensor Memory Accelerators (TMA), warp specialization, ping-pong GEMM buffers, FP8 (E4M3/E5M2), and Blackwell NVFP4 block-microscaling.',
		seaImpact:
			'Sustained 73%+ Model FLOPs Utilization (MFU) reduces the wall-clock cost of test-time search (MCTS) and code generation by more than 4×, making exhaustive agent reasoning economically viable.',
		technologies: ['Blackwell NVFP4', 'Hopper WGMMA', 'FP8 E4M3', 'AMD RDNA 4 WMMA'],
		labSimulatorId: 'precision',
		labSimulatorName: 'Numerical Precision Explorer',
		deepDive:
			'Moving from FP16 (16-bit) to FP8 and NVFP4 (4-bit floating point with microscaling factors) doubles and quadruples matrix multiplication throughput per mm² of silicon. Asynchronous warp specialization decouples producer warps (which issue TMA copies) from consumer warps (which execute Tensor Core MMA instructions), hiding memory latency behind continuous systolic compute.'
	},
	{
		id: 'kv-cache',
		channel: 'BUS_3: MLA_LATENT',
		title: 'KV-Cache VRAM Compression',
		shortTitle: 'KV-Cache Footprint',
		color: 'violet',
		stat2026: '-92% Footprint',
		stat2017: 'Full Tensor Bloat',
		sparklineData: [100, 95, 80, 55, 30, 15, 8],
		sparklineColor: 'neutral',
		bottleneck2017:
			'Standard Multi-Head Attention (MHA) required caching full Key and Value tensors for every token, head, and layer. At 128k context, KV-caches demanded tens of gigabytes per concurrent agent session, bottlenecking server concurrency.',
		breakthrough:
			'Multi-Head Latent Attention (MLA, DeepSeek-V2/V3) compresses Key and Value projections into a single low-rank latent vector c_t^{KV} ∈ ℝ^{512}, with decoupled rotary position keys.',
		seaImpact:
			'Cuts active inference KV-cache VRAM by 92%. A single GPU server can host 10× more concurrent autonomous agent worker threads exploring parallel refactoring branches.',
		technologies: [
			'DeepSeek MLA',
			'Decoupled RoPE',
			'Low-Rank Projection',
			'PagedAttention / vLLM'
		],
		labSimulatorId: 'mla',
		labSimulatorName: 'MLA Latent KV Calculator',
		deepDive:
			'In standard MHA, each token appends 2 × n_{layers} × n_{heads} × d_k floats to GPU memory. DeepSeek MLA projects keys and values into a shared latent space c_t^{KV} = W^{DKV} h_t of dimension d_c = 512. During matrix multiplication, the projection matrix W^{UK} is absorbed directly into the query weights Q, allowing the runtime to store only the compressed latent vector in VRAM.'
	}
];

export const SEA_PILLARS: SeaPillar[] = [
	{
		id: 'architecture',
		pillarNumber: 1,
		layerName: '1. Context Layer',
		subtitle: 'Attention, Position & Latent Memory',
		role: "The Agent's Working Memory",
		color: 'cyan',
		challenge2017:
			'Code is rigid and syntactic: a single misplaced bracket or indentation change breaks execution. Naive 512-token attention could not represent complete repository structures or long-range variable definitions.',
		solution2026:
			'RoPE relative angle rotations, DeepSeek Multi-Head Latent Attention (MLA), and Multi-Token Prediction (MTP) preserve exact syntax hierarchies across 1,000,000+ tokens.',
		progressiveHandOff:
			'Outputs mathematically structured sequence representations with exact syntactic coordinate vectors, feeding them directly to Layer 2 hardware engines for accelerated matrix evaluation.',
		runtimeStep: 'Step 1: Codebase & AST Ingestion',
		runtimeAction:
			'Parses repository source trees, extracts symbol call graphs, and encodes tokens into high-dimensional attention embeddings with relative coordinate tags.',
		inputArtifact: 'Raw repository source files, user issue description, and tool definitions',
		outputArtifact: 'Tokenized embedding matrices (Q, K, V) with exact syntax position metadata',
		keyMilestones: [
			'Vaswani et al. (2017) Attention Is All You Need',
			'Su et al. (2021) RoFormer / RoPE',
			'DeepSeek (2024) Multi-Head Latent Attention',
			'Gloeckle et al. (2024) Multi-Token Prediction'
		],
		labSimulatorId: 'rope',
		labSimulatorName: 'RoPE & Context Simulator'
	},
	{
		id: 'hardware',
		pillarNumber: 2,
		layerName: '2. Hardware Engine',
		subtitle: 'Silicon, Tiled SRAM & Micro-Precision',
		role: 'The Execution Engine',
		color: 'emerald',
		challenge2017:
			'GPU High-Bandwidth Memory (HBM) bandwidth could not keep up with quadratic attention memory traffic. Intermediate N × N matrix materialization starved Tensor Cores and triggered out-of-memory aborts on large files.',
		solution2026:
			'FlashAttention-1/2/3 online SRAM tiling, Hopper TMA asynchronous memory transfers, AMD RDNA 4 WMMA, and Blackwell NVFP4 microscaling maintain 73%+ Tensor Core MFU without HBM intermediate writes.',
		progressiveHandOff:
			'Provides the raw FLOPs and microsecond latency budget needed by Layer 3 to perform extensive test-time tree searches without timing out.',
		runtimeStep: 'Step 2: Micro-Kernel Silicon Acceleration',
		runtimeAction:
			'Executes online softmax and GEMM matrix multiplication directly within 256 KB on-chip SRAM caches, bypassing main DRAM bottlenecks.',
		inputArtifact: 'Token embedding matrices (Q, K, V) and attention mask matrices',
		outputArtifact:
			'Attention output tensor (O = softmax(QK^T / √d_k) V) at peak silicon throughput',
		keyMilestones: [
			'NVIDIA Volta Tensor Cores (2017)',
			'Tri Dao et al. FlashAttention-1/2/3 (2022–2024)',
			'NVIDIA Hopper TMA & Blackwell NVFP4 (2024–2026)',
			'AMD RDNA 4 WMMA Architecture (2025)'
		],
		labSimulatorId: 'flash',
		labSimulatorName: 'FlashAttention SRAM Visualizer'
	},
	{
		id: 'scaling',
		pillarNumber: 3,
		layerName: '3. Scaling & Search',
		subtitle: 'Inference Compute & Test-Time Search',
		role: 'The Strategic Planner & Reasoner',
		color: 'amber',
		challenge2017:
			'Greedy forward passes generate code token-by-token without foresight. For complex multi-file architectural refactoring, single-path generation often painted the model into impossible design dead ends.',
		solution2026:
			'Test-Time Compute Scaling laws and Monte Carlo Tree Search (MCTS) guided by Process Reward Models (PRMs) evaluate intermediate step-by-step reasoning nodes before committing to an edit.',
		progressiveHandOff:
			'Synthesizes verified, high-confidence algorithmic plans and step-by-step logic, passing the validated trajectory to Layer 4 for concrete code synthesis.',
		runtimeStep: 'Step 3: Solution Tree Exploration',
		runtimeAction:
			'Branches alternative architectural refactoring plans, evaluates each candidate path with PRM step verifiers, and prunes invalid logic before writing code.',
		inputArtifact: 'Attention context representations and codebase requirement constraints',
		outputArtifact: 'Verified optimal solution trajectory and step-by-step architectural plan',
		keyMilestones: [
			'Kaplan & Hoffmann Chinchilla Optimal Scaling (2020–2022)',
			'Lightman et al. Process Reward Models (2023)',
			'OpenAI o1/o3 Test-Time Scaling (2024–2025)',
			'Snell et al. Scaling LLM Test-Time Compute (2024)'
		],
		labSimulatorId: 'test-time',
		labSimulatorName: 'Test-Time Search & MCTS Lab'
	},
	{
		id: 'training',
		pillarNumber: 4,
		layerName: '4. Training & RL',
		subtitle: 'Causal Code Modeling & Verifiable RL',
		role: 'The Software Engineer & Code Synthesizer',
		color: 'violet',
		challenge2017:
			'Pre-trained prose models lacked the concept of syntax-tree integrity, test suite pass rates, and bidirectional file insertion (editing code in the middle of an existing module).',
		solution2026:
			'Fill-in-the-Middle (FIM) training, pass@k test-driven objective metrics, and critic-free Group Relative Policy Optimization (GRPO) align models directly against deterministic compiler signals.',
		progressiveHandOff:
			'Generates surgical, syntactically compliant code diffs and tool invocation payloads, handing executable commands over to Layer 5 for real-world execution.',
		runtimeStep: 'Step 4: Surgical Code Synthesis',
		runtimeAction:
			'Translates the validated plan into exact file diffs using Fill-in-the-Middle format, optimized against unit test pass-rate rewards.',
		inputArtifact: 'Validated reasoning plan, target file contents, and cursor location',
		outputArtifact: 'Unified diff patches, test scripts, and shell execution commands',
		keyMilestones: [
			'Chen et al. Codex & pass@k Evaluation (2021)',
			'Bavarian et al. Fill-in-the-Middle (2022)',
			'DeepSeek-R1 Group Relative Policy Optimization (2024–2025)',
			'Haluptzok et al. CodeRL Verifier Feedback (2023)'
		],
		labSimulatorId: 'grpo',
		labSimulatorName: 'GRPO Advantage Simulator'
	},
	{
		id: 'agent-loop',
		pillarNumber: 5,
		layerName: '5. Agent Loop',
		subtitle: 'ReAct Cycles, AST Diffs & Micro-VM Sandboxes',
		role: 'The Action & Sandbox Interface',
		color: 'rose',
		challenge2017:
			'Language models are stateless function approximations with no hands. Without tools, deterministic file editing, and sandboxed test execution, they cannot verify whether their code works.',
		solution2026:
			'The ReAct (Reason + Act) loop, tree-sitter AST surgical replacements, Model Context Protocol (MCP) standardized tools, and ephemeral Firecracker micro-VM isolation.',
		progressiveHandOff:
			'Closes the autonomous loop: captures compiler exit codes, linter errors, and runtime test outputs, feeding them back into Layer 1 Context for the next iteration.',
		runtimeStep: 'Step 5: Execution, Test & Autonomous Verification',
		runtimeAction:
			'Applies file diffs, executes test suites in an isolated micro-VM, monitors stderr/stdout logs, and iterates autonomously until all unit tests pass.',
		inputArtifact: 'Generated code diffs and environment test commands',
		outputArtifact: 'Verified passing pull request, terminal execution logs, and green test suite',
		keyMilestones: [
			'Yao et al. ReAct: Synergizing Reasoning and Acting (2022)',
			'Jimenez et al. SWE-bench Agent Benchmark (2023)',
			'Anthropic Model Context Protocol (MCP) (2024)',
			'Industrial Micro-VM Ephemeral Agent Sandboxes (2025–2026)'
		],
		labSimulatorId: 'react',
		labSimulatorName: 'ReAct Agent Loop Simulator'
	}
];

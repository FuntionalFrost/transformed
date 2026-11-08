# Attention Archive (2017 → 2026)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Svelte 5](https://img.shields.io/badge/Svelte-5.x-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![KaTeX](https://img.shields.io/badge/Math-KaTeX-00D8A5)](https://katex.org/)

> **The mathematical, algorithmic, and micro-architectural lineage of modern LLMs**: from Scaled Dot-Product Attention in 2017 to FlashAttention asynchronous SRAM tiling, Multi-Head Latent Compression (MLA), and Blackwell NVFP4 / AMD RDNA 4 WMMA silicon powering autonomous software engineering agents.

---

## Overview

**Attention Archive** is an interactive, rigorous reference documenting the evolution of Transformer attention mechanisms, GPU memory rooflines, and agentic reasoning loops from 2017 through 2026.

It synthesizes academic computer science, hardware micro-architecture, and autonomous agent loops into a unified, interactive console.

### Key Highlights

- **The 5-Pillar Autonomous SEA Stack**: An interactive taxonomy spanning Context Layers, Hardware Engines, Scaling & Search, Training & RL, and Agentic Execution Loops.
- **Micro-Architectural 16×16 SRAM Bitboard**: An authentic pixel-grid simulator modeling NVIDIA Tensor Core WMMA register allocations, causal masking, and online softmax wavefront sweeps.
- **Full Mathematical Rigor**: Every milestone features canonical, battle-tested LaTeX equations rendered with KaTeX, complete with 1-click TeX clipboard export.
- **Interactive Simulator Lab**: Hands-on parameter manipulation across 12+ live mathematical playgrounds:
  - **16×16 SRAM Bitboard**: Tensor core tile sparsity and warp allocation.
  - **MLA KV-Cache**: Low-rank joint key-value compression ($c_t^{KV} \in \mathbb{R}^{512}$) saving >92% VRAM.
  - **GRPO Advantage**: Critic-free group relative policy optimization with normalized clipping.
  - **Chinchilla Optimality**: Parametric scaling laws ($N_{\text{opt}}, D_{\text{opt}}$) under strict FLOP budgets.
  - **pass@k Calculator**: Unbiased combinatorial estimator for software engineering benchmarks.
  - **FlashAttention Memory IO**: Exact comparison of $O(N^2)$ quadratic HBM writes vs. $O(N)$ SRAM tiling.
  - **Test-Time Compute (MCTS)**: UCT tree search with Process Reward Model (PRM) branch verification.
  - **FP8 / NVFP4 Precision**: Microscaled numeric formats, mantissa ranges, and outlier damping.
  - **ReAct Agent Loop**: Autonomous Observe $\rightarrow$ Reason $\rightarrow$ Act cycle with AST search-and-replace.
  - **AST PageRank**: Centrality scoring for multi-file codebase context ingestion.
  - **RoPE Geometry**: Complex plane rotational positional embeddings with frequency decay.
  - **FIM (Fill-in-the-Middle)**: Prefix-Suffix-Middle autoregressive infilling transforms.
  - **Multi-Token Prediction (MTP)**: Dual-stream speculative lookahead verification.
  - **Neuro-Attention & Pharmacodynamics**: Synaptic catecholaminergic signal-to-noise gating parallel to softmax temperature scaling.

---

## Tech Stack

- **Framework**: [SvelteKit 2](https://kit.svelte.dev/) with [Svelte 5 Runes](https://svelte.dev/blog/svelte-5-released) (`$state`, `$derived`, `$props()`)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with hardware wafer dither textures and high-contrast dark theme
- **Typography & Math**: [KaTeX](https://katex.org/) for mathematical typesetting and Fira Code for monospaced telemetry
- **Component Primitives**: [Yaxa Svelte](https://github.com/yaxa-ui/yaxa-svelte)
- **Deployment Target**: Static HTML/CSS/JS export via `@sveltejs/adapter-static` (zero-runtime server required, deployable to GitHub Pages, Cloudflare Pages, Netlify, or Vercel)

---

## Quickstart

### Prerequisites

- Node.js $\ge$ 26.x
- [pnpm](https://pnpm.io/) $\ge$ 12.x (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/attention-archive.git
cd attention-archive

# Install dependencies
pnpm install

# Start the local development server
pnpm dev
```

Open `http://localhost:5173` in your browser.

---

## Production Build & Static Export

The project compiles to a standalone static website in the `build/` folder:

```bash
# Type-check with svelte-check
pnpm check

# Run ESLint & Prettier
pnpm lint

# Build static bundle for production
pnpm build

# Preview the production build locally
pnpm preview
```

---

## Repository Structure

```
attention-archive/
├── src/
│   ├── app.html                 # HTML shell, fonts, OpenGraph/Twitter meta
│   ├── routes/
│   │   ├── +page.svelte         # Main console, Hero die, view switchers, 5-Pillar stack
│   │   ├── +layout.svelte       # App layout wrapper
│   │   └── layout.css           # Tailwind 4 theme, KaTeX scrollbars, wafer dither styles
│   └── lib/
│       ├── types.ts             # TypeScript interfaces (Milestone, Equation, Category)
│       ├── data/
│       │   └── timeline.ts      # Canonical database of 23 seminal milestones (2017–2026)
│       └── components/
│           ├── KatexMath.svelte # Copyable mathematical equation renderer
│           ├── MilestoneCard.svelte
│           ├── MilestoneModal.svelte
│           └── interactive/     # 14+ interactive simulators & calculators
│               ├── TensorTileBitboard.svelte
│               ├── FlashAttentionVisualizer.svelte
│               ├── KVLatentCalculator.svelte
│               ├── GRPOSimulator.svelte
│               ├── ChinchillaSimulator.svelte
│               ├── PassKCalculator.svelte
│               ├── PrecisionExplorer.svelte
│               ├── ReActLoopSimulator.svelte
│               ├── TestTimeSearchSimulator.svelte
│               ├── PageRankExplorer.svelte
│               ├── AttentionExploder.svelte
│               ├── RopeExplorer.svelte
│               ├── FimSimulator.svelte
│               ├── MtpVisualizer.svelte
│               └── NeuroAttentionExplorer.svelte
├── static/
│   ├── favicon.svg              # Bespoke silicon Attention Core vector mark
│   └── robots.txt
├── package.json
└── tsconfig.json
```

---

## Canonical Citations

1. **Vaswani et al. (2017)** — _Attention Is All You Need_. NeurIPS 2017.
2. **Dao et al. (2022)** — _FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness_. NeurIPS 2022.
3. **Dao (2023)** — _FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning_. ICLR 2024.
4. **Shah et al. / Dao et al. (2024)** — _FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-Precision_.
5. **DeepSeek-AI (2024)** — _DeepSeek-V2 / V3: Multi-Head Latent Attention (MLA) Architecture_.
6. **Hoffmann et al. (2022)** — _Training Compute-Optimal Large Language Models (Chinchilla)_. NeurIPS 2022.
7. **Yao et al. (2022)** — _ReAct: Synergizing Reasoning and Acting in Language Models_. ICLR 2023.
8. **Shao et al. (2024)** — _DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models (GRPO)_.

---

## Contributing

Contributions, mathematical corrections, and micro-architectural additions are welcome:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/kernel-optimization`)
3. Format and type-check your changes:
   ```bash
   pnpm format
   pnpm check
   pnpm lint
   pnpm build
   ```
4. Commit your changes (`git commit -m 'feat: add Blackwell B200 NVFP4 tensor profile'`)
5. Push to the branch (`git push origin feature/kernel-optimization`)
6. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

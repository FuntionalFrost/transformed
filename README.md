# Attention Archive (2017 → 2026)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/FuntionalFrost/transformed/actions/workflows/ci.yml/badge.svg)](https://github.com/FuntionalFrost/transformed/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-attentionarchive.pages.dev-cyan.svg)](https://attentionarchive.pages.dev)
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
- **Interactive Simulator Lab**: Hands-on parameter manipulation across 15 live mathematical playgrounds:
  1. **16×16 SRAM Bitboard**: Tensor core tile sparsity, register files, and warp allocation.
  2. **MLA KV-Cache**: Low-rank joint key-value compression ($c_t^{KV} \in \mathbb{R}^{512}$) saving >92% VRAM.
  3. **GRPO Advantage**: Critic-free group relative policy optimization with normalized clipping.
  4. **Chinchilla Optimality**: Parametric scaling laws ($N_{\text{opt}}, D_{\text{opt}}$) under strict FLOP budgets.
  5. **pass@k Calculator**: Unbiased combinatorial estimator for software engineering benchmarks.
  6. **FlashAttention Memory IO**: Exact comparison of $O(N^2)$ quadratic HBM writes vs. $O(N)$ SRAM tiling.
  7. **Test-Time Compute (MCTS)**: UCT tree search with Process Reward Model (PRM) branch verification.
  8. **FP8 / NVFP4 Precision**: Microscaled numeric formats, mantissa ranges, and outlier damping.
  9. **ReAct Agent Loop**: Autonomous Observe $\rightarrow$ Reason $\rightarrow$ Act cycle with AST search-and-replace.
  10. **AST PageRank**: Centrality scoring for multi-file codebase context ingestion.
  11. **Attention Math Matrix Exploder**: Token-by-token matrix transformation walkthrough.
  12. **RoPE Geometry**: Complex plane rotational positional embeddings with frequency decay.
  13. **FIM (Fill-in-the-Middle)**: Prefix-Suffix-Middle autoregressive infilling transforms.
  14. **Multi-Token Prediction (MTP)**: Dual-stream speculative lookahead verification.
  15. **Neuro-Attention & Pharmacodynamics**: Synaptic catecholaminergic signal-to-noise gating parallel to softmax temperature scaling.

---

## Tech Stack

- **Framework**: [SvelteKit 2](https://kit.svelte.dev/) with [Svelte 5 Runes](https://svelte.dev/blog/svelte-5-released) (`$state`, `$derived`, `$props()`)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with hardware wafer dither textures and high-contrast dark theme
- **Typography & Math**: [KaTeX](https://katex.org/) for mathematical typesetting and Fira Code for monospaced telemetry
- **Component Primitives**: [Yaxa Svelte](https://github.com/yaxa-ui/yaxa-svelte)
- **Deployment Target**: Static HTML/CSS/JS export via `@sveltejs/adapter-static` (zero-runtime server required, deployable to Cloudflare Pages, GitHub Pages, Netlify, or Vercel)

---

## Quickstart

### Prerequisites

- Node.js $\ge$ 26.x (or Node 24.x LTS)
- [pnpm](https://pnpm.io/) $\ge$ 12.x (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/FuntionalFrost/transformed.git
cd transformed

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
transformed/
├── src/
│   ├── app.html                 # HTML shell, fonts, OpenGraph/Twitter meta
│   ├── site.config.ts           # Centralized SEO & project metadata
│   ├── routes/
│   │   ├── +page.svelte         # Clean orchestrator (~170 lines)
│   │   ├── +layout.svelte       # App layout wrapper & SEO tags
│   │   ├── layout.css           # Tailwind 4 theme, KaTeX scrollbars, wafer dither styles
│   │   ├── llms.txt/+server.ts  # Prerendered LLM crawler context
│   │   ├── robots.txt/+server.ts# Prerendered robots directive
│   │   ├── sitemap.xml/+server.ts # Prerendered XML sitemap
│   │   └── sitemap.xsl/+server.ts # Prerendered sitemap stylesheet
│   └── lib/
│       ├── types.ts             # TypeScript interfaces (Milestone, Equation, Category)
│       ├── data/
│       │   ├── timeline.ts      # Canonical database of 23 seminal milestones (2017–2026)
│       │   └── progressiveArchitecture.ts # 4 physical bottlenecks & 5-pillar SEA stack
│       └── components/
│           ├── KatexMath.svelte # Copyable mathematical equation renderer
│           ├── MilestoneCard.svelte
│           ├── MilestoneModal.svelte
│           ├── controls/        # Scrubber, category pills & search dock
│           ├── hero/            # Silicon die, KaTeX toggle, crossbar & bottlenecks
│           ├── layout/          # Archive header & academic footer
│           ├── stack/           # 5-Pillar Autonomous SEA Stack
│           ├── views/           # Timeline flow, matrix grid & simulator suite
│           └── interactive/     # 15 interactive simulators & calculators
├── static/
│   ├── favicon.svg              # Bespoke silicon Attention Core vector mark
│   └── images/
│       └── og-card.png          # Open Graph social preview banner (1200×630)
├── .github/
│   ├── workflows/ci.yml         # Automated GitHub Actions lint, check & build
│   └── ISSUE_TEMPLATE/
│       └── paper_proposal.yml   # Paper & milestone submission form
├── LICENSE                      # MIT License
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

Contributions, mathematical corrections, and milestone additions are welcome:

1. Fork the repository
2. Propose new papers via the [Paper Proposal Form](https://github.com/FuntionalFrost/transformed/issues/new?template=paper_proposal.yml) or create a feature branch (`git checkout -b feature/milestone`)
3. Format, type-check, and build your changes:
   ```bash
   pnpm format
   pnpm lint
   pnpm check
   pnpm build
   ```
4. Commit with conventional commit messages (`git commit -m 'feat: add milestone X'`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

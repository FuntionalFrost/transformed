export type CategoryId = 'architecture' | 'hardware' | 'scaling' | 'training' | 'agent-loop';

export interface CategoryInfo {
	id: CategoryId;
	label: string;
	shortLabel: string;
	color: string; // Tailwind color class name
	badgeClass: string;
	glowClass: string;
	borderClass: string;
	iconName: string;
	description: string;
}

export interface EquationTerm {
	symbol: string;
	name: string;
	explanation: string;
}

export interface Milestone {
	id: string;
	year: number;
	period: string; // e.g. "Jun 2017", "Mar 2022", "2024–2025"
	title: string;
	subtitle: string;
	category: CategoryId;
	authors: string;
	paperTitle?: string;
	paperRef?: string;
	tags: string[];
	summary: string;
	equations: {
		label: string;
		latex: string;
		displayMode?: boolean;
		terms?: EquationTerm[];
	}[];
	architecturalShift: {
		from: string;
		to: string;
		mechanism: string;
	};
	impactOnCodingAgents: string[];
	technicalDeepDive: string;
	interactiveToolId?:
		| 'attention'
		| 'rope'
		| 'chinchilla'
		| 'flash'
		| 'passk'
		| 'fim'
		| 'react'
		| 'mla'
		| 'grpo'
		| 'test-time'
		| 'mtp'
		| 'pagerank'
		| 'precision'
		| 'neuro';
	metrics?: {
		label: string;
		value: string;
		delta?: string;
	}[];
}

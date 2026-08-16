import type { Publication } from './types';

// Newest first.
export const publications: Publication[] = [
	{
		year: 2026,
		title: 'SpecTrum: Specification-Guided Differential Fuzzing for Ethereum Consensus Clients',
		authors: [
			{ name: 'Seokhun Jeong', me: true },
			{ name: 'Gyeongmin Dan' },
			{ name: 'Sukyoung Ryu' },
			{ name: 'Sungjae Hwang' }
		],
		venue: 'ASE 2026',
		pinned: true
	},
	{
		year: 2026,
		title:
			'P4-SpecTec: Integrating a Language Mechanization Framework into the Real-World P4 Specification',
		authors: [
			{ name: 'Jaehyun Lee' },
			{ name: 'Seokhun Jeong', me: true },
			{ name: 'Sehyuk Ahn' },
			{ name: 'Haechan Kwon' },
			{ name: 'Sukyoung Ryu' }
		],
		venue: 'OOPSLA 2026'
	},
	{
		year: 2026,
		title:
			'Failing with Purpose: Dangling Coverage-Guided Negative Test Generation from a Mechanized P4 Type System',
		authors: [
			{ name: 'Jaehyun Lee' },
			{ name: 'Seokhun Jeong', me: true },
			{ name: 'Sukyoung Ryu' }
		],
		venue: 'FSE 2026',
		links: [{ label: 'DOI', href: 'https://dl.acm.org/doi/10.1145/3797109' }]
	},
	{
		year: 2026,
		title: 'Mechanized Specifications for Real-World Programming Languages',
		authors: [
			{ name: 'Sukyoung Ryu' },
			{ name: 'Seokhun Jeong', me: true },
			{ name: 'Jaehyun Lee' }
		],
		venue: 'PLDI 2026 Tutorial',
		links: [
			{
				label: 'page',
				href: 'https://pldi26.sigplan.org/details/pldi-2026-tutorials/5/Mechanized-Specifications-for-Real-World-Programming-Languages'
			}
		]
	},
	{
		year: 2025,
		title: 'Mechanizing the P4 Language Specification with P4-SpecTec',
		authors: [
			{ name: 'Jaehyun Lee' },
			{ name: 'Seokhun Jeong', me: true },
			{ name: 'Sukyoung Ryu' }
		],
		venue: 'P4 Developer Days 2025',
		links: [
			{
				label: 'page',
				href: 'https://p4.org/event/p4-developer-days-mechanizing-the-p4-language-specification-with-p4-spectec/'
			},
			{ label: 'video', href: 'https://www.youtube.com/watch?v=2BhqyE7c-Pw' }
		]
	}
];

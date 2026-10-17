import type { Profile } from './types';

export const profile: Profile = {
	name: 'Seokhun Jeong',
	role: 'Ph.D. Student, School of Computing, KAIST',
	location: 'Daejeon, South Korea',
	initials: 'SJ',
	bio: 'I am an Ph.D. student in the Programming Language Research Group (PLRG) at KAIST. My goal is to reduce the burden of maintaining multiple representations of the same semantics, in software where semantic accuracy is critical. The method of choice is a mechanized specification, a single-source of truth from other representations can be mechanically derived. Most recently, I have mechanized the Ethereum consensus algorithm and discovered disagreements among implementations through differential testing.',
	photo: '/portrait.jpg',
	links: [
		{ label: 'Email', href: 'mailto:kunjeong99@gmail.com' },
		{ label: 'GitHub', href: 'https://github.com/KunJeong', external: true },
		{ label: 'Lab Homepage', href: 'https://plrg.kaist.ac.kr/', external: true }
	]
};

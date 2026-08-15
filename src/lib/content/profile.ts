import type { Profile } from './types';

export const profile: Profile = {
	name: 'Seokhun Jeong',
	role: 'M.S. Student, School of Computing, KAIST',
	location: 'Daejeon, South Korea',
	initials: 'SJ',
	bio: 'I am an M.S. student in the Programming Language Research Group (PLRG) at KAIST. I work in applying programming languages techniques to solve software engineering problems, with recent work on mechanizing real-world language specifications (P4) and specification-guided testing of systems such as Ethereum consensus clients.',
	photo: '/portrait.jpg',
	links: [
		{ label: 'Email', href: 'mailto:kunjeong99@gmail.com' },
		{ label: 'GitHub', href: 'https://github.com/KunJeong', external: true },
		{ label: 'Lab Homepage', href: 'https://plrg.kaist.ac.kr/', external: true }
	]
};

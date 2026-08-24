export interface LinkItem {
	label: string;
	href: string;
	external?: boolean;
}

export interface Profile {
	name: string;
	role: string;
	location: string;
	bio: string;
	initials: string;
	/** Path to a portrait in static/. Leave undefined to show the monogram fallback. */
	photo?: string;
	links: LinkItem[];
}

export interface NewsItem {
	/** ISO 'YYYY-MM' or 'YYYY-MM-DD'. */
	date: string;
	text: string;
}

export interface Author {
	name: string;
	/** Marks the site owner, rendered in bold. */
	me?: boolean;
}

export interface Publication {
	year: number;
	title: string;
	authors: Author[];
	venue: string;
	links?: LinkItem[];
	pinned?: boolean;
}

export interface ResearchTheme {
	title: string;
	description: string;
}

export type PostLanguage = 'en' | 'ko';

export interface PostMeta {
	slug: string;
	/** Markdown filename without the .md extension. */
	source: string;
	title: string;
	/** 'YYYY-MM-DD'. Keep it quoted in frontmatter so YAML leaves it a string. */
	date: string;
	summary: string;
	pinned?: boolean;
	tags?: string[];
	language: PostLanguage;
}

export interface EducationEntry {
	/** Free-form period, e.g. '2024 - present'. */
	period: string;
	degree: string;
	place: string;
	note?: string;
}

import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const contentDirectory = fileURLToPath(new URL('../src/content/', import.meta.url));
const textExtensions = new Set(['.md', '.ts']);
const disallowedCharacters = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u2408]/gu;

async function listContentFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const path = join(directory, entry.name);
			return entry.isDirectory() ? listContentFiles(path) : path;
		})
	);

	return files.flat().filter((path) => textExtensions.has(extname(path)));
}

let hasErrors = false;

for (const path of await listContentFiles(contentDirectory)) {
	const lines = (await readFile(path, 'utf8')).split('\n');

	for (const [lineIndex, line] of lines.entries()) {
		for (const match of line.matchAll(disallowedCharacters)) {
			const codePoint = match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
			console.error(
				`${relative(process.cwd(), path)}:${lineIndex + 1}:${match.index + 1}: disallowed character U+${codePoint}`
			);
			hasErrors = true;
		}
	}
}

if (hasErrors) {
	process.exitCode = 1;
}

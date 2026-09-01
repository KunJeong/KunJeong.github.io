# Blog content

Each Markdown file in `blog/` is a post. The filename is its URL slug and files without a language suffix are treated as English.

Use a `.ko.md` suffix and `language: ko` frontmatter for a Korean post. The suffix marks the content language but does not become part of the URL. For example, `marktoberdorf-2026.ko.md` is published at `/blog/marktoberdorf-2026/`.

Run `npm run check:content` to find invisible control characters in content files. The command reports each character's file, line, column, and Unicode code point. It also runs automatically as part of `npm run check` and `npm run build`.

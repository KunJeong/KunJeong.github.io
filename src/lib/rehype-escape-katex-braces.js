/** @typedef {{ type: string, value?: string, properties?: { className?: unknown }, children?: HastNode[] }} HastNode */

/** @param {HastNode} node */
function hasKatexClass(node) {
	const classNames = node.properties?.className;
	return Array.isArray(classNames) ? classNames.includes('katex') : classNames === 'katex';
}

/**
 * @param {HastNode} node
 * @param {boolean} insideKatex
 */
function escapeBraces(node, insideKatex = false) {
	const isKatex = insideKatex || hasKatexClass(node);

	if (isKatex && node.type === 'text' && node.value && /[{}]/.test(node.value)) {
		node.type = 'raw';
		node.value = node.value.replaceAll('{', '&#123;').replaceAll('}', '&#125;');
	}

	for (const child of node.children ?? []) {
		escapeBraces(child, isKatex);
	}
}

export default function rehypeEscapeKatexBraces() {
	/** @param {HastNode} tree */
	return (tree) => escapeBraces(tree);
}

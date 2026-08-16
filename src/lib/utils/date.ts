const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 'YYYY-MM' or 'YYYY-MM-DD' -> 'Aug 2026'. A bare 'YYYY' returns the year. */
export function formatMonth(iso: string): string {
	const [year, month] = iso.split('-');
	if (!month) return year;
	return `${MONTHS[Number(month) - 1]} ${year}`;
}

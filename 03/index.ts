export function part1(input: string): number {
	return encounterTrees(input.split('\n'), 3);
}

export function part2(input: string): number {
	const rows = input.split('\n');
	return [
		encounterTrees(rows, 1),
		encounterTrees(rows, 3),
		encounterTrees(rows, 5),
		encounterTrees(rows, 7),
		encounterTrees(rows, 1, 2),
	].reduce((a: number, b: number) => a * b);
}

function encounterTrees(rows: string[], x: number, y = 1): number {
	let trees = 0;
	for (let i = 1; i < Math.floor(rows.length / y); i++) {
		if (rows[i * y][(i * x) % rows[i].length] === '#') trees++;
	}
	return trees;
}

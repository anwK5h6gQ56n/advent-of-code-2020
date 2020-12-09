const PREAMBLENUMBER = 25;

export const part1 = (input: string): number | undefined => findOutcastNumber(processNumbers(input));

export function part2(input: string): number | undefined {
	const numbers = processNumbers(input);
	const outcast = findOutcastNumber(numbers) || 0;
	let index = 0;
	let cumulative = 0;
	let visited: number[] = [];
	while (outcast !== cumulative || visited.length < 2 || visited.length === numbers.length) {
		if (cumulative > outcast) {
			index -= visited.length - 1;
			cumulative = 0;
			visited = [];
		}
		const number = numbers[index];
		cumulative += number;
		visited.push(number);
		index++;
	}
	return Math.min(...visited) + Math.max(...visited);
}

function processNumbers(data: string): number[] {
	return data.split('\n').map((x) => +x);
}

function findOutcastNumber(numbers: number[]): number | undefined {
	for (let index = PREAMBLENUMBER; index < numbers.length; index++) {
		const sum = numbers[index];
		const preamble = numbers.slice(index - PREAMBLENUMBER, index);
		if (!preamble.some((x) => x * 2 !== sum && !!~preamble.indexOf(sum - x))) return sum;
	}
}

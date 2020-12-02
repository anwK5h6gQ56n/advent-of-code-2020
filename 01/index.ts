export function part1(input: string): number {
	const numbers = extractNumbers(input);
	const goal = 2020;
	let found = 0,
		next = 0;
	while (!found || !numbers.length) {
		next = numbers.pop() || 0;
		found = numbers.find((number: number) => !!number && number + next === goal) || 0;
	}
	return next * found;
}

export function part2(input: string): number {
	const numbers = extractNumbers(input);
	const goal = 2020;
	let n1: number = 0,
		n2: number = 0,
		curr: number = 0;
	while (!n1 && numbers.length) {
		curr = numbers.pop() || 0;
		if (!curr) continue;
		n1 =
			numbers.find((number) => {
				const newGoal = goal - curr;
				if (!number || number > newGoal) return false;
				n2 = numbers.find((number2) => number + number2 === newGoal) || 0;
				return !!n2;
			}) || 0;
	}
	return curr * n1 * n2;
}

function extractNumbers(data: string): number[] {
	return data.split('\n').map((x) => +x);
}

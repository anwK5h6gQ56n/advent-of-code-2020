export const part1 = (input: string) => processNumbers(input, 2020);

export const part2 = (input: string) => processNumbers(input, 30000000);

function processNumbers(input: string, goal: number) {
	const memory: { [key: string]: number } = input
		.split(',')
		.map((x) => +x)
		.reduce((a, b, i) => {
			(a as any)[`x${b}`] = i + 1;
			return a;
		}, {});
	let curr = +(Object.keys(memory).pop() || 0);
	for (let turn = Object.keys(memory).length; turn < goal; turn++) {
		const next = memory[`x${curr}`] ? turn - memory[`x${curr}`] : 0;
		memory[`x${curr}`] = turn;
		curr = next;
	}
	return curr;
}

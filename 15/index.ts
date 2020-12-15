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
	console.log(memory);
	let curr = +(Object.keys(memory).pop() || 0);
	let index = Object.keys(memory).length;
	while (index < goal) {
		const next = memory[`x${curr}`] ? index - memory[`x${curr}`] : 0;
		memory[`x${curr}`] = index;
		curr = next;
		index++;
	}
	return curr;
}

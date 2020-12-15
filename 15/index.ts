export const part1 = (input: string) => processNumbers(input, 2020);

export const part2 = (input: string) => processNumbers(input, 30000000);

function processNumbers(input: string, goal: number) {
	const memory = [...input.split(',')].reduce(
		(a: { [key: string]: number }, b: string, i: number) => ((a[`x${b}`] = i + 1) as any) && a,
		{},
	);
	let curr = +(Object.keys(memory).pop() || 0);
	for (let turn = Object.keys(memory).length; turn < goal; turn++) {
		const next = memory[`x${curr}`] ? turn - memory[`x${curr}`] : 0;
		memory[`x${curr}`] = turn;
		curr = next;
	}
	return curr;
}

export const part1 = (input: string): number => processInput(input, (line) => line.match(/(\d+) ([+*]) (\d+)/) || []);

export const part2 = (input: string): number =>
	processInput(input, (line) => line.match(/(\d+) ([+]) (\d+)/) || line.match(/(\d+) ([*]) (\d+)/) || []);

function processInput(input: string, matchFn: (line: string) => string[]) {
	const operators: { [key: string]: (left: number, right: number) => number } = {
		'+': (l, r) => l + r,
		'*': (l, r) => l * r,
	};
	const solveLine = (line: string): number => {
		while (~line.indexOf(' ')) {
			if (~line.indexOf('(')) {
				const [toReplace, toSolve] = line.match(/\(([^()]+)\)/) || [];
				line = line.replace(toReplace, `${solveLine(toSolve)}`);
				continue;
			}
			const [toReplace, left, operator, right] = matchFn(line);
			const result = operators[operator](+left, +right);
			line = line.replace(toReplace, `${result}`);
		}
		return +line;
	};
	return input
		.split('\n')
		.map(solveLine)
		.reduce((a, b) => a + b);
}

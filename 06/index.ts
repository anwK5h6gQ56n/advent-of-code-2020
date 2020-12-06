export function part1(input: string): number {
	return processGroups(input)
		.map((peopleAnswers: string[][]) => peopleAnswers.reduce((a, b) => [...a, ...b]))
		.map((answers: string[]) => answers.filter((x, i) => answers.indexOf(x) === i).length)
		.reduce((a, b) => a + b);
}

export function part2(input: string): number {
	return processGroups(input)
		.map(
			(peopleAnswers) =>
				peopleAnswers[0].filter((firstPersonAnswer) =>
					peopleAnswers.every((personAnswers) => personAnswers.includes(firstPersonAnswer)),
				).length,
		)
		.reduce((a, b) => a + b);
}

function processGroups(input: string): string[][][] {
	return input.split('\n\n').map((group) => group.split('\n').map((person) => person.split('')));
}

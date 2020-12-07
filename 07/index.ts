const TARGET = 'shiny gold';

export function part1(input: string): number {
	const rules = processRules(input);
	const containsBag = (colour: string): boolean =>
		Object.keys(rules[colour]).some((bag: string) => bag === TARGET || containsBag(bag));
	return Object.keys(rules).filter((colour) => containsBag(colour)).length;
}

export function part2(input: string): number {
	const rules = processRules(input);
	const countBags = (color: string): number => {
		const rule = rules[color];
		return Object.keys(rule).reduce((a: number, b: string) => (rule[b] ? a + rule[b] + rule[b] * countBags(b) : a), 0);
	};
	return countBags(TARGET);
}

interface Rules {
	[key: string]: { [key: string]: number };
}

function processRules(data: string): Rules {
	return [...data.matchAll(/((^\w+\b.*) bags contain (.*)\.)/gm)].reduce((rules: Rules, x: Array<string>) => {
		rules[x[2]] = x[3].split(', ').reduce((bags: { [key: string]: number }, y: string) => {
			const types: Array<string> = [...y.matchAll(/((\d+) (.*) bags?)/g)][0];
			if (types && types[3]) bags[types[3]] = +types[2];
			return bags;
		}, {});
		return rules;
	}, {});
}

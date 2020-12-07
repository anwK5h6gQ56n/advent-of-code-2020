const TARGET = 'shiny gold';

export function part1(input: string): number {
	const rules = processRules(input);
	return Object.keys(rules).filter((colour) => containsBag(rules, colour, TARGET)).length;
}

export function part2(input: string): number {
	return countBags(processRules(input), TARGET);
}

interface Rules {
	[key: string]: { [key: string]: number };
}

function processRules(data: string): Rules {
	return [...data.matchAll(/((^\w+\b.*) bags contain (.*)\.)/gm)].reduce((a: Rules, b: Array<string>) => {
		(a as any)[b[2]] = b[3].split(', ').reduce((c: { [key: string]: number }, d: string) => {
			const types: Array<string> = [...d.matchAll(/((\d+) (.*) bags?)/g)][0];
			if (types && types[3]) (c as any)[types[3]] = +types[2];
			return c;
		}, {});
		return a;
	}, {});
}

function containsBag(rules: Rules, colour: string, target: string): boolean {
	const rule = rules[colour];
	return Object.keys(rule).some((bag: string) => bag === target || containsBag(rules, bag, target));
}

function countBags(rules: Rules, colour: string): number {
	const rule = rules[colour];
	return Object.keys(rule).reduce(
		(a: number, b: string) => (rule[b] ? a + rule[b] + rule[b] * countBags(rules, b) : a),
		0,
	);
}

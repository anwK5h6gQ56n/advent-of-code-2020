export function part1(input: string): number {
	const adapters = processAdapters(input);
	const one = adapters.filter((adapter, index) => adapter - adapters[index - 1] === 1).length;
	const three = adapters.filter((adapter, index) => adapter - adapters[index - 1] === 3).length;
	return one * three;
}

export function part2(input: any): number {
	const adapters = processAdapters(input);
	const partitionLengths: Array<number> = [];
	let index = 0;
	while (index < adapters.length) {
		let partition: Array<number> = [0];
		while (adapters[index + partition.length] - adapters[index + partition.length - 1] === 1) {
			partition.push(adapters[index + partition.length]);
		}
		partitionLengths.push(partition.length);
		index += partition.length;
	}
	return partitionLengths.map(mapLengths).reduce((a, b) => a * b);
}

function processAdapters(data: string) {
	const adapters = data
		.split('\n')
		.map((x) => +x)
		.sort((a, b) => a - b);
	return [0, ...adapters, adapters[adapters.length - 1] + 3];
}

function mapLengths(index: number): number {
	if (index === 0) return 0;
	if (index < 3) return 1;
	return mapLengths(index - 1) + mapLengths(index - 2) + mapLengths(index - 3);
}

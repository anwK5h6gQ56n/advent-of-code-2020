const maskLength = 36;

export function part1(input: string) {
	const result: { [key: string]: number } = {};
	const map = processBitMasks(input);
	Object.keys(map).forEach((mask: string) => {
		map[mask].forEach((bits) => {
			const binary = processMask(bits.value, (bit, index) => (mask[index] === 'X' ? bit : mask[index]));
			result[bits.memory] = parseInt(binary, 2);
		});
	});
	return Object.values(result).reduce((a, b) => a + b);
	return map;
}

export function part2(input: string) {
	const result: { [key: string]: number } = {};
	const map = processBitMasks(input);
	const processFloats = (x: string): string[] =>
		!~x.indexOf('X') ? [x] : [...processFloats(x.replace('X', '0')), ...processFloats(x.replace('X', '1'))];
	Object.keys(map).forEach((mask: string) => {
		map[mask].forEach((bits) => {
			processFloats(processMask(bits.memory, (bit, index) => (mask[index] === '0' ? bit : mask[index]))).forEach(
				(memory: string) => (result[parseInt(memory, 2)] = bits.value),
			);
		});
	});
	return Object.values(result).reduce((a, b) => a + b);
}

function processMask(value: number, mask: (bit: string, index: number) => string): string {
	return value.toString(2).padStart(maskLength, '0').split('').map(mask).join('');
}

function processBitMasks(data: string): { [key: string]: [{ memory: number; value: number }] } {
	const result: { [key: string]: [{ memory: number; value: number }] } = {};
	let mask: string;
	[...data.matchAll(/^(?:mask = ([01X]+)|mem\[(\d+)\] = (\d+))$/gm)].forEach((x: RegExpMatchArray) => {
		const [, bitmask, memory, value] = x;
		mask = bitmask || mask;
		if (!result[mask]) result[mask] = [] as any;
		else result[mask].push({ memory: +memory, value: +value });
	});
	return result;
}

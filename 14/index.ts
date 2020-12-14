const maskLength = 36;

export function part1(input: string) {
	const result: { [key: string]: number } = {};
	const map = processBitMasks(input);
	Object.keys(map).forEach((mask: string) => {
		map[mask].forEach((bits) => {
			const binary = bits.value
				.toString(2)
				.padStart(maskLength, '0')
				.split('')
				.map((bit, index) => (mask[index] === 'X' ? bit : mask[index]))
				.join('');
			result[bits.memory] = parseInt(binary, 2);
		});
	});
	return Object.keys(result)
		.map((x) => result[x])
		.reduce((a, b) => a + b);
}

export function part2(input: string) {
	const result: { [key: string]: number } = {};
	const map = processBitMasks(input);
	const processFloating = (maskedBits: string): string[] => {
		if (maskedBits.indexOf('X') === -1) return [maskedBits];
		return [...processFloating(maskedBits.replace('X', '0')), ...processFloating(maskedBits.replace('X', '1'))];
	};
	Object.keys(map).forEach((mask: string) => {
		map[mask].forEach((bits) => {
			processFloating(
				bits.memory
					.toString(2)
					.padStart(maskLength, '0')
					.split('')
					.map((bit, index) => (mask[index] === '0' ? bit : mask[index]))
					.join(''),
			).forEach((memory: string) => (result[parseInt(memory, 2)] = bits.value));
		});
	});
	return Object.keys(result)
		.map((x) => result[x])
		.reduce((a, b) => a + b);
}

function processBitMasks(data: string): { [key: string]: [{ memory: number; value: number }] } {
	const result: { [key: string]: [{ memory: number; value: number }] } = {};
	let mask: string;
	data.split('\n').forEach((x) => {
		const [, bitmask, memory, value] = [...x.matchAll(/^(?:mask = ([01X]+)|mem\[(\d+)\] = (\d+))$/g)][0];
		mask = bitmask || mask;
		if (!result[mask]) result[mask] = [] as any;
		else result[mask].push({ memory: +memory, value: +value });
	});
	return result;
}

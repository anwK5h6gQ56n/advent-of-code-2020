export function part1(input: string, result = 1, key = 1) {
	const [pk1, pk2] = input.split('\n').map(Number);
	for (let i = 1; ; i++) {
		result = (result * 7) % 20201227;
		if (result === pk1) {
			for (let j = 1; j <= i; j++) key = (key * pk2) % 20201227;
			return key;
		}
	}
}

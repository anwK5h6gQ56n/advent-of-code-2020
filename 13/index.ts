export function part1(input: string) {
	const [arrival, buses] = input.split('\n');
	const bus = buses.split(',').reduce(
		(earliest, curr) => {
			const id = +curr;
			if (!id) return earliest;
			const bus = { id, next: Math.ceil(+arrival / id) * id };
			return !earliest.id || bus.next < earliest.next ? bus : earliest;
		},
		{ id: 0, next: 0 },
	);
	return (bus.next - +arrival) * bus.id;
}

export function part2(input: string) {
	const [, buses] = input.split('\n');
	const nixes = buses
		.split(',')
		.map((x: string, i: number) => ({ n: +x, i }))
		.filter((nindex) => !isNaN(nindex.n));
	const n = nixes.reduce((a, b) => a * b.n, 1);
	const mmi = (a: number, b: number): number => (!a || b % a == 0 ? 1 : b - Math.floor((mmi(b % a, a) * b) / a));
	const x = nixes.reduce((a, b) => (a += b.i * Math.floor(n / b.n) * mmi(Math.floor(n / b.n), b.n)), 0);
	return n - (x % n) + nixes.length;
}

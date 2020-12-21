export function part1(input: string) {
	const borders = Tile.processTiles(input).reduce((borders, tile) => {
		tile.borders.forEach((x) => {
			const border = [x.join(''), x.reverse().join('')].sort()[0];
			borders[border] ||= [];
			borders[border].push(tile.id);
		});
		return borders;
	}, {} as { [key: string]: number[] });
	return Object.values(borders)
		.filter((tileIds) => tileIds.length === 1)
		.flat()
		.filter((tileId, i, tileIds) => tileIds.indexOf(tileId) !== i)
		.reduce((a, b) => a * b);
}

export function part2() {}

class Tile {
	id: number;
	// Like CSS borders: top, right, bottom, left
	get borders(): string[][] {
		return [
			this.source[0],
			this.source.map((x) => x[x.length - 1]),
			this.source[this.source.length - 1],
			this.source.map((x) => x[0]),
		];
	}
	private source: string[][];

	constructor(input: string) {
		const [, id, source] = input.match(/^Tile (\d+):\n([.#\n]+)/) || [];
		this.id = +id;
		this.source = source.split('\n').map((line) => line.split(''));
	}

	static processTiles = (input: string): Tile[] => input.split('\n\n').map((tileLns) => new Tile(tileLns));
}

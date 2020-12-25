export function part1(input: string): number {
	const edges = new TileImage(input).edges;
	return edges.reduce((a, b) => a * b);
}

export function part2(input: string) {
	const image = new TileImage(input);
	return image.countMonsters();
}

class Tile {
	readonly id: number;
	readonly source: string[][];
	neighborIds?: number[];
	gridPosition?: { x: number; y: number; source: string[][] };

	get borders(): string[] {
		return Tile.getBordersFromSource(this.source);
	}

	constructor(input: string) {
		const [, id, source] = input.match(/^Tile (\d+):\n([.#\n]+)/) || [];
		this.id = +id;
		this.source = source.split('\n').map((line) => line.split(''));
	}

	static fromInput = (...input: string[]): Tile[] => input.map((tileLns) => new Tile(tileLns));

	static getBordersFromSource(source: string[][]) {
		return [
			source[0].join(),
			source[source.length - 1].join(),
			source.map((x) => x[0]).join(),
			source.map((x) => x[x.length - 1]).join(),
		];
	}
}

class TileImage {
	tiles: Tile[];

	get edges(): number[] {
		return this.tiles.filter((tile) => (tile.neighborIds || []).length === 2).map((tile) => tile.id);
	}

	constructor(input: string) {
		this.tiles = Tile.fromInput(...input.split('\n\n'));
		const getTileBorders = (tile: Tile) => [tile.borders, tile.borders.map((border) => [...border].reverse().join(''))];
		this.tiles.forEach((tile: Tile, tileIndex: number) => {
			tile.neighborIds = this.tiles
				.filter((potentialNeighbor: Tile, index: number) => {
					if (tileIndex === index) return false;
					for (const tileBorders of getTileBorders(tile))
						for (const potentialNeighborBorders of getTileBorders(potentialNeighbor))
							if (new Set([...tileBorders, ...potentialNeighborBorders]).size < 8) return true;
					return false;
				})
				.map((neighbor) => neighbor.id);
		});
		const index = this.tiles.findIndex((x) => x.id === this.edges[0]);
		const tile = this.tiles[index];
		this.tiles[index].gridPosition = { source: tile.source, x: 0, y: 0 };
		this.positionNeighbors(index);
	}

	countMonsters() {
		const monster = `                  #
	  #    ##    ##    ###
	   #  #  #  #  #  #   `;
		const regex = monster.split('\n').map((x) => new RegExp(`(?=(${x.replace(/\s/g, '.')}))`, 'g'));
		let count = 0;
		for (const source of TileImage.possibleOrientationsGenerator(this.render())) {
			const rows = source.map((chars) => chars.join(''));
			for (let y = 0; y < rows.length - 2; y++) {
				const x = (xa: (number | undefined)[], xb: (number | undefined)[]) => xa.filter((xc) => new Set(xb).has(xc));
				const handleRow = (i: number): (number | undefined)[] =>
					[...rows[y + i].matchAll(regex[i])].map((x) => x.index);
				count += x(x(handleRow(0), handleRow(1)), handleRow(2)).length;
			}
		}
		return count;
	}

	private render(): string[][] {
		const grid = this.tiles.map((x) => x.gridPosition);
		const xs = grid.map((x) => x?.x || 0);
		const ys = grid.map((x) => x?.y || 0);
		const minX = Math.min(...xs);
		const minY = Math.min(...ys);
		let result = [];
		for (let y = 0; y <= Math.max(...ys) - minY; y++) {
			let imageRow: { [key: number]: string } = {};
			for (let x = 0; x <= Math.max(...xs) - minX; x++) {
				grid
					.find((postition) => postition?.x === x + minX && postition.y === y + minY)
					?.source.forEach((chars, index) => {
						imageRow[index] ||= '';
						imageRow[index] += chars.join('');
					});
			}
			result.push(Object.values(imageRow).join('\n'));
		}
		return result
			.join('\n')
			.split('\n')
			.map((x) => x.split(''));
	}

	private positionNeighbors(index: number): void {
		const tile = this.tiles[index];
		if (!tile.gridPosition || !tile.neighborIds?.length) return;
		const { source, x, y } = tile.gridPosition;
		const [top, bottom, left, right] = Tile.getBordersFromSource(source);
		tile.neighborIds
			.map((id) => this.tiles.findIndex((x) => x.id === id))
			.forEach((index) => {
				const neighbor = index >= 0 ? this.tiles[index] : null;
				if (!neighbor || neighbor.gridPosition) return;
				for (const nSource of TileImage.possibleOrientationsGenerator(neighbor.source)) {
					const [nTop, nBottom, nLeft, nRight] = Tile.getBordersFromSource(nSource);
					if (top === nBottom) neighbor.gridPosition = { source: nSource, x, y: y - 1 };
					else if (bottom === nTop) neighbor.gridPosition = { source: nSource, x, y: y + 1 };
					else if (left === nRight) neighbor.gridPosition = { source: nSource, x: x - 1, y };
					else if (right === nLeft) neighbor.gridPosition = { source: nSource, x: x + 1, y };
					if (neighbor.gridPosition) break;
				}
				this.positionNeighbors(index);
			});
	}

	private static *possibleOrientationsGenerator(source: string[][]) {
		const orientations: ((x: string[][]) => string[][])[] = [
			(x) => x,
			(x) => x.map((row) => [...row].reverse()),
			(x) => [...x].reverse(),
		];
		let curr = source;
		for (const orientation of orientations) {
			curr = orientation(source);
			yield curr;
			for (const _ of [0, 1, 2, 3]) {
				const length = curr.length;
				let rotated: string[][] = Array.from({ length }, () => Array.from({ length }));
				for (let y = 0; y < curr.length; y++)
					for (let x = 0; x < curr.length; x++) rotated[y][x] = curr[length - 1 - x][y];
				curr = rotated;
				yield curr;
			}
		}
	}
}

export function part1(input: string): number {
	return findEdgeTileIds(findTilesNeighbors(Tile.processTiles(input)))
		.filter((tileId, i, tileIds) => tileIds.indexOf(tileId) !== i)
		.reduce((a, b) => a * b);
}

export function part2(input: string) {
	const image = new Image(input);
	//return image.matrix;
}

function findTilesNeighbors(tiles: Tile[]): TileBorderNeighbors {
	return tiles.reduce((borders, tile) => {
		tile.borders.forEach((x) => {
			// A border flipped is the same border.
			const border = [x.join(''), x.reverse().join('')].sort()[0];
			borders[border] ||= [];
			borders[border].push(tile.id);
		});
		return borders;
	}, {} as TileBorderNeighbors);
}

function findEdgeTileIds(tileBorderNeighbors: TileBorderNeighbors): number[] {
	return Object.values(tileBorderNeighbors)
		.filter((tileIds) => tileIds.length === 1)
		.flat();
}

class Tile {
	id: number;
	coordinate: Coordinate = { x: 0, y: 0 };
	rotated: number = 0;
	flippedH: boolean = false;
	flippedV: boolean = false;
	processed: boolean = false;

	// Like CSS borders: top, right, bottom, left
	get borders(): string[][] {
		return [
			this._borders[this.rotated % 4],
			this._borders[(this.rotated + 1) % 4],
			this._borders[(this.rotated + 2) % 4],
			this._borders[(this.rotated + 3) % 4],
		];
	}
	private get _borders(): string[][] {
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

class Image {
	matrix: { [key: number]: { [key: number]: Tile } };
	private get matrixValues() {
		return Object.values(this.matrix).flatMap((y) => Object.values(y).flatMap((x) => x));
	}
	private tiles: Tile[];
	private neighbors: TileBorderNeighbors;

	constructor(input: string) {
		this.tiles = Tile.processTiles(input);
		this.neighbors = findTilesNeighbors(this.tiles);
		const rootTile = findEdgeTileIds(this.neighbors)
			.filter((tileId, i, tileIds) => tileIds.indexOf(tileId) !== i)
			.map((x) => this.tiles.find((tile) => tile.id === x) || new Tile(''))[1];
		this.matrix = { 0: { 0: rootTile } };
		const findPosition = {
			[Direction.Top]: (origin: Tile) => {
				return { x: origin.coordinate.x, y: origin.coordinate.y - 1 };
			},
			[Direction.Right]: (origin: Tile) => {
				return { x: origin.coordinate.x + 1, y: origin.coordinate.y };
			},
			[Direction.Bottom]: (origin: Tile) => {
				return { x: origin.coordinate.x, y: origin.coordinate.y + 1 };
			},
			[Direction.Left]: (origin: Tile) => {
				return { x: origin.coordinate.x - 1, y: origin.coordinate.y };
			},
		};
		while (this.matrixValues.some((x) => !x.processed)) {
			const notProcessed = [...this.matrixValues.filter((tile) => !tile.processed)];
			console.log(`\n\n==NEW RUN`);
			notProcessed.forEach((unprocessedTile) => {
				this.findTilesForTile(unprocessedTile).forEach((relative) => {
					relative.tile.coordinate = findPosition[relative.dir](unprocessedTile);
					if (!(this.matrix[relative.tile.coordinate.y] ||= {})[relative.tile.coordinate.x])
						(this.matrix[relative.tile.coordinate.y] ||= {})[relative.tile.coordinate.x] = relative.tile;
				});
				unprocessedTile.processed = true;
			});
		}
		console.log(this.matrix);
	}

	private findTilesForTile(tile: Tile): { dir: Direction; tile: Tile }[] {
		let found: { dir: Direction; tile: Tile }[] = [];
		for (let dir = Direction.Top; dir < 4; dir++) {
			const border = tile.borders[dir].join('');
			const neighborsForBorder = this.neighbors[border];
			if (neighborsForBorder) {
				const neighborTileId = neighborsForBorder.find((x) => tile.id !== x);
				if (neighborTileId) {
					const neighborTile = this.tiles.find((tile) => tile.id === neighborTileId);
					if (neighborTile && !neighborTile.processed) {
						for (let rotation = 0; rotation < 4; rotation++) {
							neighborTile.rotated = rotation;
							const foundTileOppositeBorder = neighborTile.borders[(dir + 2) % 4];
							if (
								foundTileOppositeBorder.join('') === border ||
								foundTileOppositeBorder.reverse().join('') === border
							) {
								const flipped = foundTileOppositeBorder.join('') !== border;
								if (dir === Direction.Top || dir === Direction.Bottom) {
									neighborTile.flippedH = flipped;
								} else {
									neighborTile.flippedV = flipped;
								}
								break;
							}
						}
						found.push({ dir, tile: neighborTile });
					}
				}
			}
		}
		return found;
	}
}

interface TileBorderNeighbors {
	[key: string]: number[];
}

interface Coordinate {
	x: number;
	y: number;
}

enum Direction {
	Top,
	Right,
	Bottom,
	Left,
}

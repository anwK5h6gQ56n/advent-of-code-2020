const vals = Object.values;

export const part1 = (input: string) => new PocketDimension(input).run();

export const part2 = (input: string) => new PocketDimension(input, true).run();

class PocketDimension {
	private grid: { [key: number]: { [key: number]: { [key: number]: { [key: number]: boolean } } } } = {};

	get = (x: number, y: number, z: number, w: number) =>
		w in this.grid && z in this.grid[w] && y in this.grid[w][z] && x in this.grid[w][z][y] && this.grid[w][z][y][x];

	set = (value: boolean, x: number, y: number, z: number, w: number) =>
		((((this.grid[w] ||= {})[z] ||= {})[y] ||= {})[x] = !!value);

	run(): number {
		for (let i = 0; i < 6; i++) {
			const yVals = vals(this.grid).flatMap((w) => vals(w).flatMap((z) => Object.keys(z).map((y) => +y)));
			const yMin = Math.min(...yVals);
			const yMax = Math.max(...yVals);
			const xVals = vals(this.grid).flatMap((w) =>
				vals(w).flatMap((z) => vals(z).flatMap((y) => Object.keys(y).map((x) => +x))),
			);
			const xMin = Math.min(...xVals);
			const xMax = Math.max(...xVals);
			const grid = PocketDimension.fromDimension(this);
			for (let w = this.is4d ? -i - 1 : 0; w <= (this.is4d ? +i + 1 : 0); w++)
				for (let z = -i - 1; z <= +i + 1; z++)
					for (let y = yMin - 1; y <= yMax + 1; y++)
						for (let x = xMin - 1; x <= xMax + 1; x++) {
							const prev = this.get(x, y, z, w);
							const neighbors = this.countNeighbors(x, y, z, w);
							const next = (prev && neighbors >= 2 && neighbors <= 3) || (!prev && neighbors === 3);
							if (prev || next) grid.set(next, x, y, z, w);
						}
			this.grid = grid.grid;
		}
		return vals(this.grid)
			.flatMap((w) => vals(w))
			.flatMap((z) => vals(z))
			.flatMap((y) => vals(y))
			.filter((x) => !!x).length;
	}

	countNeighbors(x: number, y: number, z: number, w: number) {
		let count = 0;
		for (let Δw of this.is4d ? [-1, 0, 1] : [0])
			for (let Δz of [-1, 0, 1])
				for (let Δy of [-1, 0, 1])
					for (let Δx of [-1, 0, 1]) {
						if ((Δx || Δy || Δz || Δw) && this.get(x + Δx, y + Δy, z + Δz, w + Δw)) count++;
					}
		return count;
	}

	constructor(input = '', private is4d = false) {
		if (!input) return;
		this.grid = Object.assign({}, [
			Object.assign({}, [
				Object.assign({}, [
					...input.split('\n').map((x) =>
						Object.assign(
							{},
							x.split('').map((y) => y === '#'),
						),
					),
				]),
			]),
		]);
	}

	static fromDimension(dimension: PocketDimension): PocketDimension {
		let newGrid = new PocketDimension('', dimension.is4d);
		newGrid.grid = JSON.parse(JSON.stringify(dimension.grid));
		return newGrid;
	}
}

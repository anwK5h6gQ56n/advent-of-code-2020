export function part1(input: string): number {
	return HexagonGrid.fromInstructions(input).countFlipped();
}

export function part2(input: string) {
	let grid = HexagonGrid.fromInstructions(input);
	for (let i = 0; i < 100; i++) {
		const next = HexagonGrid.fromHexagonGrid(grid);
		const [xMin, xMax, yMin, yMax, zMin, zMax] = grid.getExtremes();
		for (let x = xMin - 1; x <= xMax + 1; x++)
			for (let y = yMin - 1; y <= yMax + 1; y++)
				for (let z = zMin - 1; z <= zMax + 1; z++) {
					if (x + y + z !== 0) continue;
					const flipped = grid.get(x, y, z);
					const flippedNeighbors = grid.countNeighbors(x, y, z);
					if (flipped && (!flippedNeighbors || flippedNeighbors > 2)) next.set(false, x, y, z);
					if (!flipped && flippedNeighbors === 2) next.set(true, x, y, z);
				}
		grid = next;
	}
	return grid.countFlipped();
}

class HexagonGrid {
	private grid: { [key: number]: { [key: number]: { [key: number]: boolean } } } = {};
	get = (x = 0, y = 0, z = 0) => z in this.grid && y in this.grid[z] && x in this.grid[z][y] && this.grid[z][y][x];
	flip = (x = 0, y = 0, z = 0) => this.set(!this.get(x, y, z), x, y, z);
	set = (value: boolean, x = 0, y = 0, z = 0) => (((this.grid[z] ||= {})[y] ||= {})[x] = !!value);

	countFlipped(): number {
		return Object.values(this.grid)
			.flatMap((y) => Object.values(y))
			.flatMap((x) => Object.values(x))
			.filter(Boolean).length;
	}

	countNeighbors(x: number, y: number, z: number): number {
		const directionMap: { [key: string]: number[] } = {
			ne: [-1, 0, 1],
			se: [0, 1, -1],
			e: [-1, 1, 0],
			nw: [0, -1, 1],
			sw: [1, 0, -1],
			w: [1, -1, 0],
		};
		return Object.keys(directionMap).filter((direction) => {
			const [Δz, Δy, Δx] = directionMap[direction];
			return this.get(x + Δx, y + Δy, z + Δz);
		}).length;
	}

	getExtremes(): number[] {
		const xs = Object.values(this.grid)
			.flatMap((block) => Object.values(block))
			.flatMap((row) => Object.keys(row).map(Number));
		const ys = Object.values(this.grid).flatMap((block) => Object.keys(block).map(Number));
		const zs = Object.keys(this.grid).map(Number);
		return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys), Math.min(...zs), Math.max(...zs)];
	}

	static fromInstructions(input: string): HexagonGrid {
		let grid = new HexagonGrid();
		for (let instr of input
			.split('\n')
			.map((instr) =>
				(instr.match(/(?:(?:n|s)(?:[e,w]){1}|e|w)/gi) || []).reduce((instr, dir) => [...instr, dir], [] as string[]),
			)) {
			let pos = { x: 0, y: 0, z: 0 };
			for (let dir of instr) {
				if (dir === 'e' || dir === 'se') pos.x++;
				if (dir === 'w' || dir === 'nw') pos.x--;
				if (dir === 'w' || dir === 'sw') pos.y++;
				if (dir === 'e' || dir === 'ne') pos.y--;
				if (dir === 'ne' || dir === 'nw') pos.z++;
				if (dir === 'sw' || dir === 'se') pos.z--;
			}
			grid.flip(pos.x, pos.y, pos.z);
		}
		return grid;
	}

	static fromHexagonGrid(hexagonGrid: HexagonGrid): HexagonGrid {
		let newGrid = new HexagonGrid();
		newGrid.grid = JSON.parse(JSON.stringify(hexagonGrid.grid));
		return newGrid;
	}
}

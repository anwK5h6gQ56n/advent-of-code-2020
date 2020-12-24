export function part1(input: string): number {
	return HexagonGrid.fromInstructions(processInstructions(input)).countFlipped();
}

export function part2(input: string) {
	let grid = HexagonGrid.fromInstructions(processInstructions(input));
	for (let i = 0; i < 100; i++) {
		const next = HexagonGrid.fromHexagonGrid(grid);
		const [xMin, xMax, yMin, yMax, zMin, zMax] = grid.getExtremes();
		for (let x = xMin - 1; x <= xMax + 1; x++) {
			for (let y = yMin - 1; y <= yMax + 1; y++) {
				for (let z = zMin - 1; z <= zMax + 1; z++) {
					if (x + y + z !== 0) continue;
					const flipped = grid.get(x, y, z);
					const flippedNeighbors = grid.countNeighbors(x, y, z);
					if (flipped && (!flippedNeighbors || flippedNeighbors > 2)) next.set(false, x, y, z);
					if (!flipped && flippedNeighbors === 2) next.set(true, x, y, z);
				}
			}
		}
		grid = next;
	}
	return grid.countFlipped();
}

function processInstructions(input: string): Direction[][] {
	return input
		.split('\n')
		.map((instruction) =>
			(instruction.match(/(?:(?:n|s)(?:[e,w]){1}|e|w)/gi) || []).reduce(
				(instruction, direction) => [...instruction, direction as Direction],
				[] as Direction[],
			),
		);
}

class HexagonGrid {
	private grid: { [key: number]: { [key: number]: { [key: number]: boolean } } } = {};

	get = (x: number, y: number, z: number) =>
		z in this.grid && y in this.grid[z] && x in this.grid[z][y] && this.grid[z][y][x];
	flip = (x: number, y: number, z: number) => this.set(!this.get(x, y, z), x, y, z);
	set = (value: boolean, x: number, y: number, z: number) => (((this.grid[z] ||= {})[y] ||= {})[x] = !!value);

	countFlipped(): number {
		return Object.values(this.grid)
			.flatMap((y) => Object.values(y))
			.flatMap((x) => Object.values(x))
			.filter(Boolean).length;
	}

	countNeighbors(x: number, y: number, z: number): number {
		const directionMap: { [key: string]: number[] } = {
			[Direction.NE]: [-1, 0, 1],
			[Direction.SE]: [0, 1, -1],
			[Direction.E]: [-1, 1, 0],
			[Direction.NW]: [0, -1, 1],
			[Direction.SW]: [1, 0, -1],
			[Direction.W]: [1, -1, 0],
		};
		return Object.values(Direction).filter((direction) => {
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

	static fromInstructions(instructions: Direction[][]): HexagonGrid {
		let grid = new HexagonGrid();
		for (let instruction of instructions) {
			let position = { x: 0, y: 0, z: 0 };
			for (let direction of instruction) {
				if (direction === Direction.E || direction === Direction.SE) position.x++;
				if (direction === Direction.W || direction === Direction.NW) position.x--;
				if (direction === Direction.W || direction === Direction.SW) position.y++;
				if (direction === Direction.E || direction === Direction.NE) position.y--;
				if (direction === Direction.NE || direction === Direction.NW) position.z++;
				if (direction === Direction.SW || direction === Direction.SE) position.z--;
			}
			grid.flip(position.x, position.y, position.z);
		}
		return grid;
	}

	static fromHexagonGrid(hexagonGrid: HexagonGrid): HexagonGrid {
		let newGrid = new HexagonGrid();
		newGrid.grid = JSON.parse(JSON.stringify(hexagonGrid.grid));
		return newGrid;
	}
}

enum Direction {
	NE = 'ne',
	SE = 'se',
	E = 'e',
	NW = 'nw',
	SW = 'sw',
	W = 'w',
}

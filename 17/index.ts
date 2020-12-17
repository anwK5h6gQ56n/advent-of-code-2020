export function part1(input: string) {
	const grid = new Grid(input);
	return grid.grid;
}

class Grid {
	grid: { [key: number]: { [key: number]: { [key: number]: { [key: number]: string } } } };

	constructor(input: string) {
		this.grid = Object.assign({}, [
			Object.assign({}, [Object.assign({}, [...input.split('\n').map((x) => Object.assign({}, x.split('')))])]),
		]);
	}

	abomination(): any {
		// prettier:ignore
		let minλ = Number.MAX_SAFE_INTEGER,
			maxλ = 0,
			minZ = Number.MAX_SAFE_INTEGER,
			maxZ = 0,
			minY = Number.MAX_SAFE_INTEGER,
			maxY = 0,
			minX = Number.MAX_SAFE_INTEGER,
			maxX = 0;
		const λkeys = Object.keys(this.grid).map(Number);
		minλ = Math.min(...λkeys);
		maxλ = Math.max(...λkeys);
		const input = Object.values(this.grid)
			.flatMap((λ) => {
				const zKeys = Object.keys(λ).map(Number);
				minZ = Math.min(...[minZ, ...zKeys]);
				maxZ = Math.max(...[maxZ, ...zKeys]);
				return Object.values(λ).flatMap((z) => {
					const yKeys = Object.keys(z).map(Number);
					minY = Math.min(...[minY, ...yKeys]);
					maxY = Math.max(...[maxY, ...yKeys]);
					return Object.values(z).flatMap((y) => {
						const xKeys = Object.keys(y).map(Number);
						minX = Math.min(...[minX, ...xKeys]);
						maxX = Math.max(...[maxX, ...xKeys]);
						return Object.values(y)
							.flatMap((x) => x)
							.join('');
					});
				});
			})
			.join('\n');
		return {
			input,
			minλ,
			maxλ,
			minZ,
			maxZ,
			minY,
			maxY,
			minX,
			maxX,
		};
	}

	get(x: number, y: number, z: number, λ = 0) {
		return (
			(λ in this.grid &&
				z in this.grid[λ] &&
				y in this.grid[λ][z] &&
				x in this.grid[λ][z][y] &&
				this.grid[λ][z][y][x]) ||
			null
		);
	}

	set(value: '#' | '.', x: number, y: number, z: number, λ = 0) {
		(((this.grid[λ] ||= {})[z] ||= {})[y] ||= {})[x] = value;
	}

	process(): Grid {
		const grid = new Grid(this.grid.toString());
		return grid;
	}
}

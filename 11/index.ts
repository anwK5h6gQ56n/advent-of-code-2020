const NEIGHBOR_DIR = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1],
];

export const part1 = (input: string) => getFilledSeats(input, false);

export const part2 = (input: string) => getFilledSeats(input, true);

function getFilledSeats(input: string, los: boolean) {
	let seatGrid = new SeatGrid(input);
	let nextGrid: SeatGrid | null = null;
	while (nextGrid === null || seatGrid.hasChangedFrom(nextGrid)) {
		if (nextGrid !== null) seatGrid = nextGrid;
		nextGrid = seatGrid.process((cell, x, y) => {
			const neighbors = los ? seatGrid.getSeatLosNeighbors(x, y) : seatGrid.getSeatNeighbors(x, y);
			if (cell?.value === 'L' && neighbors.every((neighbor) => neighbor?.value !== '#')) return '#';
			if (cell?.value === '#' && neighbors.filter((neighbor) => neighbor?.value === '#').length > (los ? 4 : 3))
				return 'L';
			return cell.value;
		});
	}
	return seatGrid.cells.flat().filter((x) => x.value === '#').length;
}

class SeatGrid {
	cells: SeatCell[][];
	print = () => this.cells.map((row) => row.map((x) => x.value).join('')).join('\n');
	hasChangedFrom = (seatGrid: SeatGrid): boolean => this.print() !== seatGrid.print();
	getSeat = (x: number, y: number) => (y in this.cells && x in this.cells[y] && this.cells[y][x]) || null;
	getSeatNeighbors = (x: number, y: number) => NEIGHBOR_DIR.map(([Δx, Δy]) => this.getSeat(x + Δx, y + Δy));
	getSeatLosNeighbors = (x: number, y: number) =>
		NEIGHBOR_DIR.map(([Δx, Δy]) => {
			for (let index = 1; true; index++) {
				let cell = this.getSeat(x + Δx * index, y + Δy * index);
				if (cell?.value !== '.') return cell;
			}
		});
	setSeat = (x: number, y: number, value: '#' | 'L' | '.' | ''): void => {
		const seat = this.getSeat(x, y);
		if (seat) seat.value = value;
	};
	process = (x: (cell: SeatCell, x: number, y: number) => '#' | 'L' | '.' | ''): SeatGrid => {
		const seatGrid: SeatGrid = new SeatGrid(this.print());
		this.cells.forEach((row, yIndex) =>
			row.forEach((cell, xIndex) => seatGrid.setSeat(xIndex, yIndex, x(cell, xIndex, yIndex))),
		);
		return seatGrid;
	};

	constructor(data: string) {
		this.cells = data
			.split('\n')
			.map((y) => y.split('').map((x) => new SeatCell(x as '#' | 'L' | '.'))) as SeatCell[][];
	}
}

class SeatCell {
	constructor(public value: '#' | 'L' | '.' | '') {}
}

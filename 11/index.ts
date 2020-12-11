// prettier-ignore
const NEIGHBOR_DIR = [[-1, -1],[-1, 0],[-1, 1],[0, -1],[0, 1],[1, -1],[1, 0],[1, 1]];

export const part1 = (input: string): number => getFilledSeats(input, false);

export const part2 = (input: string): number => getFilledSeats(input, true);

function getFilledSeats(input: string, los: boolean): number {
	let seatGrid = new SeatGrid(input);
	let nextGrid: SeatGrid | null = null;
	while (nextGrid === null || seatGrid.hasChangedFrom(nextGrid)) {
		if (nextGrid !== null) seatGrid = nextGrid;
		nextGrid = seatGrid.process((cell, x, y) => {
			const neighbors = los ? seatGrid.getSeatLosNeighbors(x, y) : seatGrid.getSeatNeighbors(x, y);
			if (cell?.value === CellValue.Empty && neighbors.every((neighbor) => neighbor?.value !== CellValue.Occupied))
				return CellValue.Occupied;
			if (
				cell?.value === CellValue.Occupied &&
				neighbors.filter((neighbor) => neighbor?.value === CellValue.Occupied).length > (los ? 4 : 3)
			)
				return CellValue.Empty;
			return cell.value;
		});
	}
	return seatGrid.cells.flat().filter((x) => x.value === CellValue.Occupied).length;
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
				if (cell?.value !== CellValue.Floor) return cell;
			}
		});
	setSeat = (x: number, y: number, value: CellValue): void => {
		const seat = this.getSeat(x, y);
		if (seat) seat.value = value;
	};
	process = (x: (cell: SeatCell, x: number, y: number) => CellValue): SeatGrid => {
		const seatGrid: SeatGrid = new SeatGrid(this.print());
		this.cells.forEach((row, yIndex) =>
			row.forEach((cell, xIndex) => seatGrid.setSeat(xIndex, yIndex, x(cell, xIndex, yIndex))),
		);
		return seatGrid;
	};

	constructor(data: string) {
		this.cells = data.split('\n').map((y) => y.split('').map((x) => new SeatCell(x as CellValue))) as SeatCell[][];
	}
}

class SeatCell {
	constructor(public value: CellValue) {}
}

enum CellValue {
	None = '',
	Empty = 'L',
	Occupied = '#',
	Floor = '.',
}

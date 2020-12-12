export function part1(input: string) {
	// prettier-ignore
	let x = 0, y = 0, dir = Direction.East;
	const changeDirection = (unit: number, clockwise: boolean): Direction => {
		let rotation = [Direction.North, Direction.East, Direction.South, Direction.West];
		if (!clockwise) rotation = rotation.reverse();
		return rotation[(rotation.indexOf(dir) + unit / 90) % rotation.length];
	};
	const actions: { [key: string]: (unit: number) => void } = {
		[Direction.North]: (unit) => (y += unit),
		[Direction.South]: (unit) => (y -= unit),
		[Direction.East]: (unit) => (x += unit),
		[Direction.West]: (unit) => (x -= unit),
		[Direction.Left]: (unit) => (dir = changeDirection(unit, false)),
		[Direction.Right]: (unit) => (dir = changeDirection(unit, true)),
		[Direction.Forward]: (unit) => actions[dir](unit),
	};
	runInstructions(input, actions);
	return Math.abs(x) + Math.abs(y);
}

export function part2(input: string) {
	// prettier-ignore
	let x = 0, y = 0, waypointX = 10, waypointY = 1;
	runInstructions(input, {
		[Direction.North]: (unit) => (waypointY += unit),
		[Direction.South]: (unit) => (waypointY -= unit),
		[Direction.East]: (unit) => (waypointX += unit),
		[Direction.West]: (unit) => (waypointX -= unit),
		[Direction.Left]: (unit) => {
			for (let i = 1; i <= unit / 90; i++) [waypointX, waypointY] = [-waypointY, waypointX];
		},
		[Direction.Right]: (unit) => {
			for (let i = 1; i <= unit / 90; i++) [waypointX, waypointY] = [waypointY, -waypointX];
		},
		[Direction.Forward]: (unit) => {
			x += unit * waypointX;
			y += unit * waypointY;
		},
	});
	return Math.abs(x) + Math.abs(y);
}

function runInstructions(data: string, actions: { [key: string]: (unit: number) => void }): void {
	data.split('\n').forEach((x: string) => {
		const [, dir, unit] = [...x.matchAll(/^(\w)(\d+)$/g)][0];
		actions[dir](+unit);
	});
}

enum Direction {
	North = 'N',
	South = 'S',
	East = 'E',
	West = 'W',
	Left = 'L',
	Right = 'R',
	Forward = 'F',
}

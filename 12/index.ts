const dirActions = (loc: { x: number; y: number }): { [key: string]: (unit: number) => void } => ({
	[Direction.North]: (unit) => (loc.y += unit),
	[Direction.South]: (unit) => (loc.y -= unit),
	[Direction.East]: (unit) => (loc.x += unit),
	[Direction.West]: (unit) => (loc.x -= unit),
});

export function part1(input: string) {
	// prettier-ignore
	let loc = {x: 0, y: 0}, dir = Direction.East;
	const changeDirection = (unit: number, clockwise: boolean): Direction => {
		let rotation = [Direction.North, Direction.East, Direction.South, Direction.West];
		if (!clockwise) rotation = rotation.reverse();
		return rotation[(rotation.indexOf(dir) + unit / 90) % rotation.length];
	};
	const actions: { [key: string]: (unit: number) => void } = {
		...dirActions(loc),
		[Direction.Left]: (unit) => (dir = changeDirection(unit, false)),
		[Direction.Right]: (unit) => (dir = changeDirection(unit, true)),
		[Direction.Forward]: (unit) => actions[dir](unit),
	};
	runInstructions(input, actions);
	return Math.abs(loc.x) + Math.abs(loc.y);
}

export function part2(input: string) {
	// prettier-ignore
	let loc = { x: 0, y: 0 },	waypointLoc = { x: 10, y: 1 };
	runInstructions(input, {
		...dirActions(waypointLoc),
		[Direction.Left]: (unit) => {
			for (let i = 1; i <= unit / 90; i++) [waypointLoc.x, waypointLoc.y] = [-waypointLoc.y, waypointLoc.x];
		},
		[Direction.Right]: (unit) => {
			for (let i = 1; i <= unit / 90; i++) [waypointLoc.x, waypointLoc.y] = [waypointLoc.y, -waypointLoc.x];
		},
		[Direction.Forward]: (unit) => {
			loc.x += unit * waypointLoc.x;
			loc.y += unit * waypointLoc.y;
		},
	});
	return Math.abs(loc.x) + Math.abs(loc.y);
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

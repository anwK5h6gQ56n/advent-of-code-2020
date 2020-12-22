export function part1(input: string): number {
	const [p1, p2] = processPlayers(input);
	let win: number[] = [];
	while (p1.length && p2.length) {
		const p1Card = p1.shift() || 0;
		const p2Card = p2.shift() || 0;
		win = p1Card > p2Card ? p1 : p2;
		win.push(...(p1 === win ? [p1Card, p2Card] : [p2Card, p1Card]));
	}
	return win.map((x, i, deck) => x * (deck.length - i)).reduce((a, b) => a + b);
}

export function part2(input: string): number {
	const play: (x: number[][]) => number[] = ([p1, p2]) => {
		const history = new Set<string>();
		let win: number[] = [];
		while (p1.length && p2.length) {
			const stateId = JSON.stringify([p1, p2]);
			if (history.has(stateId)) return p1;
			history.add(stateId);
			const p1Card = p1.shift() || 0;
			const p2Card = p2.shift() || 0;
			if (p1.length >= p1Card && p2.length >= p2Card) {
				const subP1 = [...p1].splice(0, p1Card);
				const subP2 = [...p2].splice(0, p2Card);
				win = play([subP1, subP2]) === subP1 ? p1 : p2;
			} else {
				win = p1Card > p2Card ? p1 : p2;
			}
			win.push(...(p1 === win ? [p1Card, p2Card] : [p2Card, p1Card]));
		}
		return win;
	};
	return play(processPlayers(input))
		.map((x, i, deck) => x * (deck.length - i))
		.reduce((a, b) => a + b);
}

const processPlayers = (input: string) => input.split('\n\n').map((x) => x.split('\n').splice(1).map(Number));

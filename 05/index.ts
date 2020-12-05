export function part1(input: string) {
	return processSeats(input).sort((a, b) => b - a)[0];
}

export function part2(input: string) {
	const seats = processSeats(input);
	return Array.from({ length: Math.max(...seats) }, (_, x) => (!seats.includes(x + 1) ? x + 1 : false))
		.filter(Boolean)
		.reverse()[0];
}

function processSeats(data: string): number[] {
	return data.split('\n').map((seatBinary: string) => {
		const rowNo = [...Array(128).keys()];
		const colNo = [...Array(8).keys()];
		seatBinary.split('').forEach((x: string) => {
			const array = x.match(/[FB]/) ? rowNo : colNo;
			array.splice(x.match(/[FL]/) ? array.length / 2 : 0, array.length / 2);
		});
		return rowNo[0] * 8 + colNo[0];
	});
}

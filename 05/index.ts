export function part1(input: string) {
	return processSeats(input).sort((a, b) => b.id - a.id)[0].id;
}

export function part2(input: string) {
	const seats = processSeats(input).map((x) => x.id);
	return Array.from({ length: Math.max(...seats) }, (_, x) => (!seats.includes(x + 1) ? x + 1 : false))
		.filter(Boolean)
		.reverse()[0];
}

function processSeats(data: string): { row: number; col: number; id: number }[] {
	return data.split('\n').map((seatBinary: string) => {
		const rowNo = [...Array(128).keys()];
		const colNo = [...Array(8).keys()];
		seatBinary.split('').forEach((x: string) => {
			switch (x) {
				case 'F': {
					rowNo.splice(rowNo.length / 2, rowNo.length / 2);
					break;
				}
				case 'B': {
					rowNo.splice(0, rowNo.length / 2);
					break;
				}
				case 'L': {
					colNo.splice(colNo.length / 2, colNo.length / 2);
					break;
				}
				case 'R': {
					colNo.splice(0, colNo.length / 2);
					break;
				}
			}
		});
		return {
			id: rowNo[0] * 8 + colNo[0],
			row: rowNo[0],
			col: colNo[0],
		};
	});
}

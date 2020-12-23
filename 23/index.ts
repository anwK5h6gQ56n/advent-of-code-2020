export function part1(input: string): number {
	const cups = new Game(...input.split('').map(Number));
	cups.play(100);
	let result = '';
	let cup = cups.source[1].next;
	while (cup.value !== 1) {
		result += cup.value;
		cup = cup.next;
	}
	return +result;
}

export function part2(input: string) {
	const cups = new Game(...input.split('').map(Number));
	for (let value = cups.length + 1; value <= 1000000; value++) cups.push({ value });
	cups.length = 1000000;
	cups.play(10000000);
	const cup = cups.source[1];
	return cup.next.value * cup.next.next.value;
}

class Game {
	head: Cup;
	source: { [key: number]: Cup };
	length: number;

	constructor(...values: number[]) {
		let mainCup: any = { value: values.shift() };
		mainCup.prev = mainCup;
		mainCup.next = mainCup;
		this.head = mainCup as Cup;
		this.source = { [mainCup.value]: mainCup };
		values.forEach((value: number) => {
			this.push({ value });
		});
		this.length = Object.keys(this.source).length;
	}

	push({ value }: { value: number }): Cup {
		return this.insert(this.head.prev, value);
	}

	insert(prev: Cup, value: number): Cup {
		const cup = { value, prev, next: prev.next };
		this.source[value] = cup;
		prev.next.prev = cup;
		prev.next = cup;
		return cup;
	}

	remove(cup: Cup): Cup {
		if (cup === this.head) this.head = cup.next;
		[cup.prev.next, cup.next.prev] = [cup.next, cup.prev];
		delete this.source[cup.value];
		return cup.next;
	}

	play(rounds: number) {
		let current = this.head;
		for (let i = 0; i < rounds; i++) {
			const picked = [current.next, current.next.next, current.next.next.next];
			picked.forEach((cup) => this.remove(cup));
			let destination: Cup | number = 1;
			while (typeof destination === 'number') {
				let cupIndex: number = current.value - destination;
				if (cupIndex <= 0) cupIndex += this.length;
				destination = this.source[cupIndex] || destination + 1;
			}
			picked.reverse().forEach((cup) => this.insert(destination as Cup, cup.value));
			current = current.next;
		}
	}
}

interface Cup {
	value: number;
	prev: Cup;
	next: Cup;
}

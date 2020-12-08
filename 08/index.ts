export function part1(input: string): number {
	const instructions = processInstructions(input);
	let accumulator: number = 0;
	let index: number = 0;
	let previous: Instruction[] = [];

	while (true) {
		const current: Instruction = instructions[index];
		if (previous.includes(current)) return accumulator;
		previous.push(current);
		switch (current.operation) {
			case Operation.Accumulate:
				accumulator += current.value;
			case Operation.NoOperation:
				index++;
				break;
			case Operation.Jump:
				index += current.value;
				break;
		}
	}
}

export function part2(input: string) {
	const instructions = processInstructions(input);
	for (const instruction of instructions) {
		if (instruction.operation === Operation.Accumulate) continue;
		let accumulator: number = 0;
		let index: number = 0;
		let previous: Instruction[] = [];
		while (true) {
			const current: Instruction = instructions[index];
			if (!current || previous.includes(current)) break;
			previous.push(current);
			let operation = current.operation;
			if (instruction === current) {
				switch (current.operation) {
					case Operation.NoOperation:
						operation = Operation.Jump;
						break;
					case Operation.Jump:
						operation = Operation.NoOperation;
						break;
				}
			}
			switch (operation) {
				case Operation.Accumulate:
					accumulator += current.value;
				case Operation.NoOperation:
					index++;
					break;
				case Operation.Jump:
					index += current.value;
					break;
			}
			if (index === instructions.length) return accumulator;
		}
	}
}

enum Operation {
	Accumulate = 'acc',
	Jump = 'jmp',
	NoOperation = 'nop',
}

interface Instruction {
	operation: Operation;
	value: number;
}

function processInstructions(data: string): Instruction[] {
	return data.split('\n').map((x: string) => {
		const match = [...x.matchAll(/^(\w+) ([+-]\d+)$/g)][0];
		return {
			operation: match[1] as Operation,
			value: +match[2],
		};
	});
}

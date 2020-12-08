export function part1(input: string): number {
	return execute(processInstructions(input)).result;
}

export function part2(input: string): number | undefined {
	const instructions = processInstructions(input);
	for (const instruction of instructions) {
		if (instruction.operation === Operation.Accumulate) continue;
		const run = execute(
			instructions,
			(current: Instruction): Operation => {
				if (instruction === current) {
					switch (current.operation) {
						case Operation.NoOperation:
							return Operation.Jump;
						case Operation.Jump:
							return Operation.NoOperation;
					}
				}
				return current.operation;
			},
		);
		if (run.completed) return run.result;
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

function execute(
	instructions: Instruction[],
	changeOperation?: (instruction: Instruction) => Operation,
): { result: number; completed: boolean } {
	let accumulator: number = 0;
	let index: number = 0;
	let previous: Instruction[] = [];

	while (true) {
		const current: Instruction = instructions[index];
		if (previous.includes(current)) break;
		previous.push(current);
		let operation = changeOperation ? changeOperation(current) : current.operation;
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
		if (index === instructions.length) return { result: accumulator, completed: true };
	}
	return { result: accumulator, completed: false };
}

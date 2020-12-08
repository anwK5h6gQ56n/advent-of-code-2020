export function part1(input: string): number {
	return execute(processInstructions(input)).accumulator;
}

export function part2(input: string): number | undefined {
	const instructions = processInstructions(input);
	for (const instruction of instructions) {
		if (instruction.operation === Operation.Accumulate) continue;
		const operationMapper: { [key: string]: Operation } = {
			[Operation.NoOperation]: Operation.Jump,
			[Operation.Jump]: Operation.NoOperation,
		};
		const run = execute(
			instructions,
			(current: Instruction): Operation =>
				instruction === current ? operationMapper[current.operation] : current.operation,
		);
		if (run.completed) return run.accumulator;
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
		const instruction = [...x.matchAll(/^(\w+) ([+-]\d+)$/g)][0];
		return {
			operation: instruction[1] as Operation,
			value: +instruction[2],
		};
	});
}

function execute(
	instructions: Instruction[],
	changeOperation?: (instruction: Instruction) => Operation,
): { accumulator: number; completed: boolean } {
	let accumulator: number = 0;
	let index: number = 0;
	const previous: Instruction[] = [];
	while (true) {
		const current: Instruction = instructions[index];
		if (!current || previous.includes(current)) break;
		previous.push(current);
		const operation = changeOperation ? changeOperation(current) : current.operation;
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
	}
	return { accumulator, completed: index === instructions.length };
}

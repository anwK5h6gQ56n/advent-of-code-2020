export const part1 = (input: string): number => execute(processInstructions(input)).accumulator;

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
	return [...data.matchAll(/^(\w+) ([+-]\d+)$/g)].map((x: RegExpMatchArray) => {
		return {
			operation: x[1] as Operation,
			value: +x[2],
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
	const actions: { [key: string]: (value: number) => void } = {
		[Operation.Accumulate]: (value) => {
			accumulator += value;
			++index;
		},
		[Operation.NoOperation]: (_) => ++index,
		[Operation.Jump]: (value) => (index += value),
	};
	let current: Instruction = instructions[index];
	while (current && !previous.includes(current)) {
		previous.push(current);
		actions[changeOperation ? changeOperation(current) : current.operation](current.value);
		current = instructions[index];
	}
	return { accumulator, completed: index === instructions.length };
}

export function part1(input: string): number {
	return extractPasswords(input).filter((x: PasswordContent | null) => {
		if (!x) return false;
		const occurance = x.password.split(x.char).length - 1;
		return occurance >= x.min && occurance <= x.max;
	}).length;
}

export function part2(input: string): number {
	return extractPasswords(input).filter(
		(x: PasswordContent | null) => !!x && +(x.password[x.min - 1] === x.char) ^ +(x.password[x.max - 1] === x.char),
	).length;
}

interface PasswordContent {
	min: number;
	max: number;
	char: string;
	password: string;
}

function extractPasswords(input: string): Array<PasswordContent | null> {
	return input.split('\n').map((x: string) => {
		if (!x) return null;
		const properties = x.split(' ');
		const boundaries = properties[0].split('-');
		return {
			min: +boundaries[0],
			max: +boundaries[1],
			char: properties[1][0],
			password: properties[2],
		};
	});
}

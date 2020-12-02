export function part1(input: string): number {
	const passwords = extractPasswords(input);
	return passwords.filter((x) => {
		if (!x) return false;
		const occurance = x.password.split('').filter((char) => char === x.char).length;
		return occurance >= x.min && occurance <= x.max;
	}).length;
}

export function part2(input: any): any {
	const passwords = extractPasswords(input);
	return passwords.filter((x) => {
		return (
			!!x &&
			((x.password[x.min - 1] === x.char && x.password[x.max - 1] !== x.char) ||
				(x.password[x.min - 1] !== x.char && x.password[x.max - 1] === x.char))
		);
	}).length;
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

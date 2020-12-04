export function part1(input: string) {
	return processPassports(input).filter((x: Passport) => x.propertiesExist()).length;
}

export function part2(input: string) {
	return processPassports(input).filter((x: Passport) => x.isValid()).length;
}

function processPassports(input: string): Passport[] {
	return input.split('\n\n').map((x: string) => {
		const passport = new Passport();
		x.split(/\n| /g).map((property: string) => {
			const keyValue: string[] = property.split(':');
			(passport as any)[keyValue[0]] = keyValue[1];
		});
		return passport;
	});
}

class Passport {
	constructor(
		public byr: string = '',
		public iyr: string = '',
		public eyr: string = '',
		public hgt: string = '',
		public hcl: string = '',
		public ecl: string = '',
		public pid: string = '',
		public cid?: string,
	) {}

	propertiesExist(): boolean {
		return Object.keys(this).every((property: string) => {
			return property === 'cid' || !!(this as any)[property];
		});
	}

	isValid(): boolean {
		const isFourDigits = /^\d{4}$/;
		const hgt = this.hgt.split(/(in|cm)/);
		return !!(
			this.byr.match(isFourDigits) &&
			+this.byr >= 1920 &&
			+this.byr <= 2002 &&
			this.iyr.match(isFourDigits) &&
			+this.iyr >= 2010 &&
			+this.iyr <= 2020 &&
			this.eyr.match(isFourDigits) &&
			+this.eyr >= 2020 &&
			+this.eyr <= 2030 &&
			this.hcl.match(/^#([a-f0-9]{6})$/) &&
			['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(this.ecl) &&
			this.pid.match(/^\d{9}$/) &&
			this.hgt.match(/^\d{2,3}(in|cm)$/) &&
			((hgt[1] === 'in' && +hgt[0] >= 59 && +hgt[0] <= 76) || (hgt[1] === 'cm' && +hgt[0] >= 150 && +hgt[0] <= 193))
		);
	}
}

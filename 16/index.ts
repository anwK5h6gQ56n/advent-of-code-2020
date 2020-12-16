export function part1(input: string) {
	const data = processInput(input);
	const flatTickets = data.nearbyTickets.flat();
	return flatTickets.filter((ticketField) => !validateTicketField(ticketField, data.fields)).reduce((a, b) => a + b);
}

export function part2(input: string) {
	const data = processInput(input);
	const validTickets = [
		data.ticket,
		...data.nearbyTickets.filter((ticket) =>
			ticket.every((ticketField) => validateTicketField(ticketField, data.fields)),
		),
	];
	const foundFields: string[] = [];
	let eligableFields = data.ticket.map((_, i) =>
		data.fields.filter((field: Field) =>
			validTickets.map((ticket) => ticket[i]).every((ticketField) => validateTicketField(ticketField, [field])),
		),
	);
	while (foundFields.length < Object.keys(data.ticket).length) {
		eligableFields.forEach((fields) => {
			if (fields.length !== 1) return;
			const field = fields[0];
			if (!~foundFields.indexOf(field.name)) foundFields.push(field.name);
		});
		eligableFields = eligableFields.map((fields) => {
			if (fields.length === 1) return fields;
			return fields.filter((field) => !~foundFields.indexOf(field.name));
		});
	}
	const myTicket = eligableFields.flat().map((x, i): Field => ({ ...x, value: data.ticket[i] }));
	return myTicket.filter((field: Field) => ~field.name.indexOf('departure')).reduce((a, b) => a * (b.value || 1), 1);
}

function processInput(input: string) {
	let [fieldsLns, ticketLns, nearbyTicketsLns] = input.split('\n\n');
	const fields: Field[] = [...fieldsLns.matchAll(/^([\w ]+): (\d+)-(\d+) or (\d+)-(\d+)$/gm)].map(
		([, name, r1from, r1until, r2from, r2until]) => ({
			name,
			r1from: +r1from,
			r1until: +r1until,
			r2from: +r2from,
			r2until: +r2until,
		}),
	);
	const ticketArray = ticketLns.split('\n');
	const nearbyTicketsArray = nearbyTicketsLns.split('\n');
	nearbyTicketsArray.shift();
	const processTicket = (lns: string) => lns.split(',').map((x) => +x);
	return {
		fields,
		ticket: processTicket(ticketArray.pop() || ''),
		nearbyTickets: nearbyTicketsArray.map(processTicket),
	};
}

function validateTicketField(ticketField: number, fields: Field[]) {
	return fields.some(
		(field) =>
			(ticketField >= field.r1from && ticketField <= field.r1until) ||
			(ticketField >= field.r2from && ticketField <= field.r2until),
	);
}

interface Field {
	name: string;
	r1from: number;
	r1until: number;
	r2from: number;
	r2until: number;
	value?: number;
}

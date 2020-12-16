export function part1(input: string) {
	const { fields, nearbyTickets } = processInput(input);
	return nearbyTickets
		.map((x) => x[0])
		.filter((ticketField) => !validateTicketField(ticketField, fields))
		.reduce((a, b) => a + b);
}

export function part2(input: string) {
	const { fields, ticket, nearbyTickets } = processInput(input);
	const validTickets = [
		ticket,
		...nearbyTickets.filter((ticket) => ticket.every((ticketField) => validateTicketField(ticketField, fields))),
	];
	const foundFields: string[] = [];
	let eligableFields = ticket.map((_, i) =>
		fields.filter((field: Field) =>
			validTickets.map((ticket) => ticket[i]).every((ticketField) => validateTicketField(ticketField, [field])),
		),
	);
	while (foundFields.length < Object.keys(ticket).length) {
		eligableFields.forEach((innerFields) => {
			if (innerFields.length !== 1) return;
			const foundField = innerFields[0];
			if (!~foundFields.indexOf(foundField.name)) foundFields.push(foundField.name);
		});
		eligableFields = eligableFields.map((fields) =>
			fields.length !== 1 ? fields.filter((field) => !~foundFields.indexOf(field.name)) : fields,
		);
	}
	return eligableFields
		.map((x) => x[0])
		.filter((field: Field, i: number) => {
			field.value = ticket[i];
			return ~field.name.indexOf('departure');
		})
		.reduce((a, b) => a * (b.value || 1), 1);
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

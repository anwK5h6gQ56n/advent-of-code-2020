export function part1(input: string): number {
	const { fields, nearbyTickets } = processInput(input);
	return nearbyTickets
		.flat()
		.filter((ticketField) => !validateTicketField(ticketField, fields))
		.reduce((a, b) => a + b);
}

export function part2(input: string): number {
	const { fields, ticket, nearbyTickets } = processInput(input);
	const validTickets = [
		ticket,
		...nearbyTickets.filter((x) => x.every((ticketField) => validateTicketField(ticketField, fields))),
	];
	const foundFields: string[] = [];
	let eligableFields = ticket.map((_, i) =>
		fields.filter((field: Field) =>
			validTickets.map((ticket) => ticket[i]).every((ticketField) => validateTicketField(ticketField, [field])),
		),
	);
	while (foundFields.length < Object.keys(ticket).length) {
		eligableFields.forEach(
			([foundField, hasMultiple]) =>
				!hasMultiple && !~foundFields.indexOf(foundField.name) && foundFields.push(foundField.name),
		);
		eligableFields = eligableFields.map((fields) =>
			fields.length !== 1 ? fields.filter((field) => !~foundFields.indexOf(field.name)) : fields,
		);
	}
	return eligableFields
		.filter(([field], i: number) => {
			field.value = ticket[i];
			return ~field.name.indexOf('departure');
		})
		.reduce((a, [b]) => a * (b.value || 1), 1);
}

function processInput(input: string) {
	let [fieldsLns, ticketLns, nearbyTicketsLns] = input.split('\n\n');
	const fields: Field[] = [...fieldsLns.matchAll(/^([\w ]+): (\d+)-(\d+) or (\d+)-(\d+)$/gm)].map(
		([, name, r1f, r1u, r2f, r2u]) => ({
			name,
			r1f: +r1f,
			r1u: +r1u,
			r2f: +r2f,
			r2u: +r2u,
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

const validateTicketField = (val: number, fields: Field[]) =>
	fields.some(({ r1f, r2f, r1u, r2u }) => (val >= r1f && val <= r1u) || (val >= r2f && val <= r2u));

interface Field {
	name: string;
	r1f: number;
	r1u: number;
	r2f: number;
	r2u: number;
	value?: number;
}

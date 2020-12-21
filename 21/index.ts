export function part1(input: string): number {
	const food = processFood(input);
	return food
		.flatMap(({ ingredients }) => ingredients)
		.filter(
			(ingredient) =>
				!~Object.values(getLinkedAllergens(food))
					.flatMap((ingredientsList) =>
						ingredientsList[0].filter((ingredient) => ingredientsList.every((list) => ~list.indexOf(ingredient))),
					)
					.indexOf(ingredient),
		).length;
}

export function part2(input: string): string {
	const food = processFood(input);
	const potentialHazard = Object.entries(getLinkedAllergens(food)).reduce(
		(potentialAllergy, [allergen, ingredientsList]) => {
			potentialAllergy[allergen] = ingredientsList[0].filter((ingredient) =>
				ingredientsList.every((list) => ~list.indexOf(ingredient)),
			);
			return potentialAllergy;
		},
		{} as { [key: string]: string[] },
	);
	const actualHazard: { [key: string]: string } = {};
	while (Object.keys(potentialHazard).length) {
		let [allergen, [ingredient]] = Object.entries(potentialHazard).find(
			([, ingredients]) => ingredients.length === 1,
		) || ['', []];
		actualHazard[allergen] = ingredient;
		delete potentialHazard[allergen];
		for (let allergen in potentialHazard) {
			potentialHazard[allergen] = potentialHazard[allergen].filter((ingredient) => ingredient !== ingredient);
		}
	}
	return Object.entries(actualHazard)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([, ingredients]) => ingredients)
		.join(',');
}

function getLinkedAllergens(food: { ingredients: string[]; allergens: string[] }[]): { [key: string]: string[][] } {
	return food.reduce((linkedAllergens, { ingredients, allergens }) => {
		allergens.forEach((allergen) => (linkedAllergens[allergen] ||= []).push(ingredients));
		return linkedAllergens;
	}, {} as { [key: string]: string[][] });
}

function processFood(input: string): { ingredients: string[]; allergens: string[] }[] {
	return [...input.matchAll(/^([\w\s]+)(?: \(contains ([\w\s,]+)\))?$/gm)].map(([, ingredients, allergens]) => ({
		ingredients: ingredients.split(' '),
		allergens: allergens.split(', '),
	}));
}

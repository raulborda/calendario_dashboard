export const toCapitalize = (text) => {
	const name = text.toLowerCase();
	const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
	return nameCapitalized;
};

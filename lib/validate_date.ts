/**
 * Verifica se um valor é uma data válida.
 *
 * @param value - O valor a ser verificado.
 * @returns True se o valor for uma data válida, caso contrário, false.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function is_valid_date(value: any): boolean {
	if (Object.prototype.toString.call(value) !== "[object Date]") {
		return false;
	}
	return !Number.isNaN(value.getTime());
}

/**
 * Valida e converte uma string em um objeto Date.
 *
 * @param dateString - A string a ser convertida.
 * @returns O objeto Date se a string for uma data válida, caso contrário, null.
 */
export function validate_and_convertDate(dateString: string): Date | null {
	const date = new Date(dateString);
	return is_valid_date(date) ? date : null;
}

import GenericError from "./err";
import Result from "./result";

export function check_balance_for_multiple_actions(
	balance: number,
	actions: unknown[],
): Result<void> {
	if (balance === undefined) {
		console.error("Error: balance is undefined");
		return Result.failure(GenericError.balance_undefined_____);
	}

	// Verifica se o desconto total não ultrapassa -90 para cada installment
	const total_discount = actions.length * 90;

	if (balance + total_discount <= -90) {
		console.error("Error: Insufficient balance for this operation");
		return Result.failure(GenericError.insufficient_balance__);
	}

	return Result.success(void 0);
}

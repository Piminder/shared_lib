const GenericError = {
	sucess________________: "S-000",
	unexpected_error______: "E-500",
	generic_error_________: "E-501",

	company_not_found_____: "E-000",
	company_without_credit: "E-008",
	wrong_credentials_____: "E-009",
	email_already_exists__: "E-010",
	nuit_already_exists___: "E-011",
	phone_already_exists__: "E-012",
	customer_not_found____: "E-013",
	invalid_token_________: "E-014",
	expired_token_________: "E-015",
	disabled_account______: "E-016",
	data_not_found________: "E-018",
	invalid_data__________: "E-020",
	feat_not_implemented__: "E-021",
	client_duplicate_data_: "E-022", // Se o client passado, tem os mesmos dados a nivel de email, phone e nuit.

	it_was_impossible_to_send_otp: "E-017",
	company_has_already_been_verified: "E-019",

	insufficient_balance__: "E-023", // "Saldo insuficiente para esta operação. O saldo não deve ser inferior a -90."
	insufficient_balance_short: "E-024", // "Erro: Saldo insuficiente para esta operação"
	balance_undefined_____: "E-025", // "Erro: o saldo está indefinido"
	error_getting_wallet__: "E-026", // "Erro ao obter carteira da empresa"
};

export default GenericError;

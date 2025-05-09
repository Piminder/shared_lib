const GenericError = {
  sucess________________: "S-000",
  unexpected_error______: "E-500",
  generic_error_________: "E-501",

  company_not_found_____: "E-000",
  nuib_already_exists___: "E-007",
  company_without_credit: "E-008",
  wrong_credentials_____: "E-009",
  email_already_exists__: "E-010",
  nuit_already_exists___: "E-011",
  phone_already_exists__: "E-012",
  customer_not_found____: "E-013",
  invalid_token_________: "E-014",
  expired_token_________: "E-015",
  disabled_account______: "E-016",
  it_was_impossible_to_send_otp: "E-017",
  data_not_found________: "E-018",
  company_has_already_been_verified: "E-019",
  invalid_data__________: "E-020",
  feat_not_implemented__: "E-021",
  client_duplicate_data_: "E-022", // Se o client passado, tem os mesmos dados a nivel de email, phone e nuit.

  insufficient_balance__: "E-023", // "Saldo insuficiente para esta operação. O saldo não deve ser inferior a -90."
  insufficient_balance_short: "E-024", // "Erro: Saldo insuficiente para esta operação"
  balance_undefined_____: "E-025", // "Erro: o saldo está indefinido"
  error_getting_wallet__: "E-026", // "Erro ao obter carteira da empresa"

  invalid_payload_______: "E-027", // payload invalido
  invalid_payload_fragment: "E-028", // uma parte do payload é invalida ou não existe
  not_before_token______: "E-029", // o token foi usado antes de sua data de validade (nbf).

  user_already_exists___: "E-030",

  already_logged_in_____: "E-031",

  operation_cannot_be_completed: "E-032", // o pedido foi entendido, mas por algum motivo ela não pode ser processada.

  active_session_found__: "E-033",
  ope_already_completed_: "E-034", // A operação solicitada já foi concluída com sucesso anteriormente e não pode ser repetida (ex: solicitação de pagamento de uma fatura que já foi processada com sucesso. ativações, confirmações, etc.).

  resource_unavailable__: "E-100",
};

export default GenericError;

import { check_balance_for_multiple_actions } from "../../lib/check_balance.ts";

const r = check_balance_for_multiple_actions(-70, [1, 2, 3]);

r.is_success ? console.log(r.value) : console.error(r.error);

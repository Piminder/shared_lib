import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import GenericError from "../err";
import MorgansWrapper from "../morgans";

function safe_equal(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/**
 * Compara o header `x-internal-key` contra o segredo partilhado `INTERNAL_KEY`.
 * Usado tanto pelo guard `require_internal` abaixo quanto por serviços que
 * precisam combinar essa checagem com outro esquema de auth (ex.: aceitar OU um
 * JWT de utilizador, OU o segredo interno, na mesma rota).
 */
export function check_internal_key(req: Request): boolean {
  const key = req.header("x-internal-key");
  const expected = process.env.INTERNAL_KEY;
  return !!(key && expected && safe_equal(key, expected));
}

/**
 * Guarda pra rotas `/internal/*` — só aceita chamadas de outro serviço Piminder
 * que mandem o header `x-internal-key` com o segredo combinado (env `INTERNAL_KEY`,
 * igual em todos os serviços). Mesmo padrão em todos os microservices, pra não ter
 * uma cópia local divergente por serviço.
 */
export function require_internal(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (check_internal_key(req)) {
    req.is_internal = true;
    return next();
  }

  MorgansWrapper.err(
    `Rejected internal call to ${req.originalUrl} from ${req.ip}`,
  );
  return res
    .status(401)
    .json({ message: GenericError.invalid_token_________ });
}

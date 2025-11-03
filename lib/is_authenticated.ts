import type { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import GenericError from "./err";
import MorgansWrapper from "./morgans";

export interface Payload {
  id: string;
  sub: string;
  email?: string;
}

export default function is_authenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res
      .status(401)
      .json({ message: GenericError.invalid_token_________ });
  }

  const [, token] = authToken.split(" ");

  try {
    const payload = jsonwebtoken.verify(
      token,
      Bun.env.JWT_SECRET as string,
    ) as Payload;

    (req as any).user_id = payload.id;
    (req as any).company_id = payload.sub;

    return next();
  } catch (err: any) {
    MorgansWrapper.err(`Is authenticated error: ${err}`);

    const name = err.name;
    const map: Record<string, string> = {
      TokenExpiredError: GenericError.expired_token_________,
      JsonWebTokenError: GenericError.invalid_token_________,
      NotBeforeError: GenericError.not_before_token______,
    };

    return res
      .status(401)
      .json({ message: map[name] ?? GenericError.unexpected_error______ });
  }
}

import type { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import GenericError from "./err";

export interface Payload {
  sub: string;
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
    const { sub } = jsonwebtoken.verify(
      token,
      Bun.env.JWT_SECRET as string,
    ) as Payload;

    req.company_id = sub;

    return next();
  } catch (err) {
    console.error(`Is authenticated error: ${err}`);
    return res
      .status(401)
      .json({ message: GenericError.invalid_token_________ });
  }
}

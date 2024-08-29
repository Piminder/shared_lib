import type { Request, Response, NextFunction } from "express";

class Morgans {
  public static big_news(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const start = Date.now();
    const startTime = new Date(start).toISOString();

    console.log(
      `[${startTime}] Início da requisição: ${req.method} ${req.url}`,
    );

    res.on("finish", () => {
      const duration = Date.now() - start;
      const endTime = new Date().toISOString();
      console.log(
        `[${endTime}] Término da requisição: ${req.method} ${req.url} - Status: ${res.statusCode} - Tempo: ${duration}ms`,
      );
    });

    res.on("close", () => {
      const duration = Date.now() - start;
      const closeTime = new Date().toISOString();
      console.error(
        `[${closeTime}] Requisição fechada prematuramente: ${req.method} ${req.url} - Status: ${res.statusCode} - Tempo: ${duration}ms`,
      );
    });

    res.on("error", (err) => {
      const duration = Date.now() - start;
      const errorTime = new Date().toISOString();
      console.error(
        `[${errorTime}] Erro na requisição: ${req.method} ${req.url} - Status: ${res.statusCode} - Tempo: ${duration}ms - Erro: ${err.message}`,
      );
    });

    next();
  }
}

export default Morgans;

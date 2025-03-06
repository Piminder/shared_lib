import type { Request, Response, NextFunction } from "express";

export enum NewsType {
  log,
  warning,
  err,
  info,
}

/**
 * Classe Morgans responsável por registrar logs detalhados de requisições HTTP.
 * O nome 'Morgans' é uma referência a um personagem de 'One Piece'.
 */
class Morgans {
  /**
   * Middleware para registrar logs de início e término de requisições HTTP.
   * Também trata casos onde a requisição é fechada prematuramente ou ocorre um erro.
   *
   * @param req - Objeto da requisição HTTP.
   * @param res - Objeto da resposta HTTP.
   * @param next - Função para passar o controle para o próximo middleware.
   */
  public static big_news(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const start = Date.now();

    Morgans.publish(
      `Início da requisição: ${req.method} ${req.url}`,
      NewsType.info,
    );

    res.on("finish", () => {
      const duration = Date.now() - start;
      Morgans.publish(
        `Request end: ${req.method} ${req.url} - Status: ${res.statusCode} - Time: ${duration}ms`,
        NewsType.info,
      );
    });

    res.on("close", () => {
      const duration = Date.now() - start;
      Morgans.publish(
        `Request closed prematurely: ${req.method} ${req.url} - Status: ${res.statusCode} - Time: ${duration}ms`,
        NewsType.warning,
      );
    });

    res.on("error", (err) => {
      const duration = Date.now() - start;
      Morgans.publish(
        `Error in request: ${req.method} ${req.url} - Status: ${res.statusCode} - Time: ${duration}ms - Error: ${err.message}`,
        NewsType.err,
      );
    });

    next();
  }

  /**
   * Publica logs formatados no console com diferentes níveis de severidade.
   *
   * @param msg - A mensagem a ser exibida no log.
   * @param type - O tipo de log (log, warning, err, info).
   */
  public static publish(msg: string, type: NewsType = NewsType.log) {
    const now = new Date();
    const date = now.toLocaleDateString("pt-BR");
    const time = now.toLocaleTimeString("pt-BR", { hour12: false });
    const prefix = `===== [${date}] [${time}] |`;

    switch (type) {
      case NewsType.info:
        console.info(`${prefix} INFO: ${msg} =====`);
        break;
      case NewsType.warning:
        console.warn(`${prefix} WARNING: ${msg} =====`);
        break;
      case NewsType.err:
        console.error(`${prefix} ERROR: ${msg} =====`);
        break;
      default:
        console.log(`${prefix} LOG: ${msg} =====`);
    }
  }
}

export default Morgans;

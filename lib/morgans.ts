import type { Request, Response, NextFunction } from "express";
import Result from "./result";
import GenericError from "./err";

export enum NewsType {
    log,
    warning,
    err,
    info,
}

export interface LogParams {
    message: string;
    level: "DEBUG" | "INFO" | "WARN" | "ERROR";
    body: Record<string, string>;
}

/**
 * Classe Morgans responsável por registrar logs detalhados de requisições HTTP.
 * O nome 'Morgans' é uma referência a um personagem de 'One Piece'.
 */
class Morgans {
    private key: string;
    private base_url: string;

    public constructor(key: string, base_url: string) {
        this.key = key;
        this.base_url = base_url;
    }

    private async send_log(params: LogParams): Promise<Result<void>> {
        try {
            const response = await fetch(`${this.base_url}/logs.create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...params,
                    serviceId: this.key,
                    timestamp: new Date().toISOString(),
                    body: JSON.stringify(params.body),
                }),
            });

            if (!response.ok) {
                return Result.failure(`HTTP error! status: ${response.status}`);
            }

            return Result.success(void 0);
        } catch (error) {
            if (error instanceof Error)
                return Result.failure("Failed to send log:" + error.message);
            return Result.failure(GenericError.unexpected_error______);
        }
    }

    /**
     * Middleware para registrar logs de início e término de requisições HTTP.
     * Também trata casos onde a requisição é fechada prematuramente ou ocorre um erro.
     *
     * @param req - Objeto da requisição HTTP.
     * @param res - Objeto da resposta HTTP.
     * @param next - Função para passar o controle para o próximo middleware.
     */
    public big_news(req: Request, res: Response, next: NextFunction): void {
        const start = Date.now();

        this.publish(
            `Início da requisição: ${req.method} ${req.url}`,
            NewsType.info,
        );

        res.on("finish", () => {
            const duration = Date.now() - start;
            this.publish(
                `Request end: ${req.method} ${req.url} - Status: ${res.statusCode} - Time: ${duration}ms`,
                NewsType.info,
            );
        });

        res.on("close", () => {
            const duration = Date.now() - start;
            this.publish(
                `Request closed prematurely: ${req.method} ${req.url} - Status: ${res.statusCode} - Time: ${duration}ms`,
                NewsType.warning,
            );
        });

        res.on("error", (err: Error) => {
            const duration = Date.now() - start;
            this.publish(
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
    public publish(
        msg: string,
        type: NewsType = NewsType.log,
        body: Record<string, string> = {},
    ) {
        const now = new Date();
        const date = now.toLocaleDateString("pt-BR");
        const time = now.toLocaleTimeString("pt-BR", { hour12: false });
        const prefix = `[${date}] [${time}] |`;

        switch (type) {
            case NewsType.info:
                console.info(`${prefix} INFO: ${msg}`);
                this.send_log({
                    message: msg,
                    level: "INFO",
                    body: body,
                });
                break;
            case NewsType.warning:
                console.warn(`${prefix} WARNING: ${msg}`);
                this.send_log({ message: msg, level: "WARN", body: body });
                break;
            case NewsType.err:
                console.error(`${prefix} ERROR: ${msg}`);
                this.send_log({ message: msg, level: "ERROR", body: body });
                break;
            default:
                this.send_log({ message: msg, level: "DEBUG", body: body });
                console.log(`${prefix} LOG: ${msg}`);
        }
    }
}

export default Morgans;

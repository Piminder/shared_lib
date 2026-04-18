import fs from "fs";
import path from "path";
import axios from "axios";
import Result from "./result";
import MorgansWrapper from "./morgans";

export interface HookConfig {
    company_id: string;
    event: string;
    target_url: string;
    active: boolean;
}

export class HookDispatcher {
    private static hooks_cache: HookConfig[] | null = null;

    /**
     * Carrega o arquivo .hooks.json da raiz do microserviço que está executando
     */
    private static load_hooks(): HookConfig[] {
        if (this.hooks_cache) return this.hooks_cache;

        try {
            const file_path = path.join(process.cwd(), ".hooks.json");

            if (!fs.existsSync(file_path)) {
                return [];
            }

            const content = fs.readFileSync(file_path, "utf-8");
            this.hooks_cache = JSON.parse(content);
            return this.hooks_cache || [];
        } catch (error) {
            MorgansWrapper.err("Failed to load .hooks.json", error);
            return [];
        }
    }

    /**
     * Dispara os webhooks mapeados para um evento específico
     */
    public static async trigger(event: string, payload: any): Promise<Result<boolean>> {
        const hooks = this.load_hooks();

        const active_hooks = hooks.filter(h => h.event === event && h.active);

        if (active_hooks.length === 0) return Result.success(true);

        const promises = active_hooks.map(async (hook) => {
            try {
                await axios.post(hook.target_url, {
                    event: hook.event,
                    company_id: hook.company_id,
                    timestamp: new Date().toISOString(),
                    data: payload
                }, { timeout: 5000 });

                MorgansWrapper.info(`Webhook [${event}] sent to ${hook.target_url}`);
            } catch (err) {
                MorgansWrapper.err(`Webhook [${event}] failed for ${hook.target_url}`, err);
            }
        });

        // executar em background para nao travar a resposta da API principal
        Promise.all(promises);

        return Result.success(true);
    }
}
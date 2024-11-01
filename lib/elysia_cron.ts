import cron from "node-cron";
import { parse_schedule, ScheduleType } from "./parse_cron_schedule";

type VoidFunctionAsync = () => Promise<void>;

export abstract class Elysia {
    private tasks: VoidFunctionAsync[] = [];

    constructor() {
        this.init_state();
    }

    protected init_state(): void {
        console.info("Initializing Elysia service...");
    }

    protected abstract on_start(): void;

    protected abstract on_stop(): void;

    protected abstract on_error(error: Error): void;

    public add_task(task: VoidFunctionAsync): void {
        this.tasks.push(task);
    }

    public wake_up(schedule: ScheduleType | string = ScheduleType.OnceADay): void {
        const cron_schedule = parse_schedule(schedule);
        if (!cron_schedule) {
            throw new Error(`Invalid schedule format: ${schedule}`);
        }

        cron.schedule(cron_schedule, async () => {
            console.info("Executing scheduled tasks...");
            try {
                for (const task of this.tasks) {
                    console.info(`Executando tarefa: ${task.name}...`);
                    await task();
                }
            } catch (error) {
                this.on_error(error as Error);
            }
        })
            .on("start", () => this.on_start())
            .on("stop", () => this.on_stop());
    }
}

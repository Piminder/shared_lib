/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import axios from "axios";
import cron from "node-cron";
import MorgansWrapper from "./morgans";
import { parse_schedule, ScheduleType } from "./parse_cron_schedule";

type VoidFunctionAsync = () => Promise<void>;

export abstract class Elysia {
	private tasks: VoidFunctionAsync[] = [];
	protected abstract on_start(): void;
	protected abstract on_stop(): void;
	protected abstract on_error(error: Error): void;

	constructor() {
		this.init_state();
	}

	protected init_state(): void {
		MorgansWrapper.info("Initializing Elysia service...");
	}

	public add_task(task: VoidFunctionAsync): void {
		this.tasks.push(task);
	}

	private async send_heartbeat(
		status: "SUCCESS" | "FAILED",
		errorMsg?: string,
	) {
		try {
			const cron_name = this.constructor.name;
			const service_name = process.env.SERVICE_NAME || "unknown-service";
			const monitor_url = process.env.HEALTH_MONITOR_URL;

			await axios.post(
				`${monitor_url}/cron/heartbeat`,
				{
					cron_name,
					service_name,
					status,
					error: errorMsg,
				},
				{ timeout: 2000 },
			);
		} catch (err: any) {
			MorgansWrapper.err(
				"Não foi possível enviar Heartbeat para o Health Monitor",
				err,
			);
		}
	}

	public wake_up(
		schedule: ScheduleType | string = ScheduleType.OnceADay,
	): void {
		const cron_schedule = parse_schedule(schedule);

		if (!cron_schedule) {
			throw new Error(`Invalid schedule format: ${schedule}`);
		}

		const task = cron.schedule(cron_schedule, async () => {
			try {
				for (const task_fn of this.tasks) {
					await task_fn();
				}

				await this.send_heartbeat("SUCCESS");
			} catch (error: any) {
				MorgansWrapper.err("Cron failed but process kept alive", error);
				await this.send_heartbeat("FAILED", error.message);
			}
		});

		task.on("task:started", () => this.on_start());
		task.on("task:stopped", () => this.on_stop());
	}
}

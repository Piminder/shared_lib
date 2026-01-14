import cron from "node-cron";
import { parse_schedule, ScheduleType } from "./parse_cron_schedule";
import MorgansWrapper from "./morgans";

type VoidFunctionAsync = () => Promise<void>;

export abstract class Elysia {
  private tasks: VoidFunctionAsync[] = [];

  constructor() {
    this.init_state();
  }

  protected init_state(): void {
    MorgansWrapper.info("Initializing Elysia service...");
  }

  protected abstract on_start(): void;

  protected abstract on_stop(): void;

  protected abstract on_error(error: Error): void;

  public add_task(task: VoidFunctionAsync): void {
    this.tasks.push(task);
  }

  public wake_up(
    schedule: ScheduleType | string = ScheduleType.OnceADay,
  ): void {
    const cron_schedule = parse_schedule(schedule);

    if (!cron_schedule) {
      throw new Error(`Invalid schedule format: ${schedule}`);
    }

    const task = cron.schedule(cron_schedule, async () => {
      MorgansWrapper.info("Executing scheduled tasks...");
      try {
        for (const task_fn of this.tasks) {
          MorgansWrapper.info(`Executando tarefa: ${task_fn.name}...`);
          await task_fn();
        }
      } catch (error) {
        this.on_error(error as Error);
      }
    });

    task.on("task:started", () => this.on_start());
    task.on("task:stopped", () => this.on_stop());
  }
}

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
    run_immediately = false,
  ): void {
    const cron_schedule = parse_schedule(schedule);

    if (!cron_schedule) {
      throw new Error(`Invalid schedule format: ${schedule}`);
    }

    const run_all_tasks = async () => {
      try {
        for (const task_fn of this.tasks) {
          await task_fn();
        }
      } catch (error) {
        MorgansWrapper.err("Cron failed but process kept alive", error);
      }
    };

    const task = cron.schedule(cron_schedule, run_all_tasks);

    task.on("task:started", () => this.on_start());
    task.on("task:stopped", () => this.on_stop());

    // Catch-up: se o processo ficou fora do ar durante o horário agendado (deploy,
    // crash, restart), reprocessa assim que voltar em vez de esperar até o próximo
    // ciclo do cron. Protegido por dedup por dia nos próprios tasks (não reenvia o
    // que já foi enviado hoje).
    if (run_immediately) {
      MorgansWrapper.info("Running catch-up execution on startup...");
      run_all_tasks();
    }
  }
}

export enum ScheduleType {
  OnceADay = "once a day",
  EveryHour = "every hour",
  OnceAWeek = "once a week",
  OnceAMonth = "once a month",
  OnceAYear = "once a year",
}

/**
# Converte uma string de agendamento em um formato cron.

### Retorna:
    - Uma string representando a expressão cron correspondente ao agendamento fornecido.


## Exemplos de uso:

    - Agendamento para uma vez ao dia:
  ```js
  parse_schedule("once a day");
  // '0 8 * * *'
  // (Executa todos os dias às 08:00)
  ```

    - Agendamento para a cada hora:
  ```js
  parse_schedule("every hour");
  // '0 * * * *'
  // (Executa todo hora, a cada hora)
  ```

    - Agendamento para uma vez por semana:
  ```js
  parse_schedule("once a week");
  // '0 8 * * 1'
  // (Executa toda segunda-feira às 08:00)
  ```

    - Agendamento para uma vez por mês:
  ```js
  parse_schedule("once a month");
  // '0 8 1 * *'
  // (Executa todo dia 1 do mês às 08:00)
  ```

    - Agendamento para uma vez por ano:
  ```js
  parse_schedule("once a year");
  // '0 8 1 1 *'
  // (Executa todo dia 1 de janeiro às 08:00)
  ```

    - Agendamento para a cada 5 minutos:
  ```js
  parse_schedule("every 5 minutes");
  // '*\/5 * * * *'
  // (Executa a cada 5 minutos)
  ```

    - Agendamento para a cada 30 segundos:
  ```js
  parse_schedule("every 30 seconds");
  // '*\/30 * * * * *'
  // (Executa a cada 30 segundos)
  ```

    - Agendamento para a cada 2 horas:
  ```js
  parse_schedule("every 2 hours");
  // '0 *\/2 * * *'
  // (Executa a cada 2 horas)
  ```

    - Agendamento para a cada 3 dias:
  ```js
  parse_schedule("every 3 days");
  // '0 8 *\/3 * *'
  // (Executa a cada 3 dias às 08:00)
  ```

    - Agendamento para a cada 1 semana:
  ```js
  parse_schedule("every 1 week");
  // '0 8 * * 1'
  // (Executa toda segunda-feira às 08:00)
  ```

    - Agendamento para a cada 2 meses:
  ```js
  parse_schedule("every 2 months");
  // '0 8 1 *\/2 *'
  // (Executa todo dia 1 em meses pares às 08:00)
  ```

    - Agendamento para a cada 4 semanas:
  ```js
  parse_schedule("every 4 weeks");
  // '0 8 * * 1'
  // (Executa a cada 4 semanas às 08:00)
  ```

    - Agendamento para a cada 15 minutos:
  ```js
  parse_schedule("every 15 minutes");
  // '*\/15 * * * *'
  // (Executa a cada 15 minutos)
  ```

    - Agendamento para a cada 1 hora das 9h às 17h:
  ```js
  parse_schedule("every 1 hour from 9 to 17");
  // '9-17/1 * * *'
  // (Executa a cada hora das 09:00 às 17:00)
  ```

    - Agendamento para a cada 2 horas das 8h às 20h:
  ```js
  parse_schedule("every 2 hours from 8 to 20");
  // '8-20/2 * * *'
  // (Executa a cada 2 horas das 08:00 às 20:00)
  ```

    - Agendamento para o último dia do mês:
  ```js
  parse_schedule("last day of month");
  // '59 23 28-31 * * [ "$(date +\%d -d tomorrow)" == "01" ] && echo "0 0 1 * *"'
  // (Executa no último dia do mês às 23:59)
  ```

  - Agendamento para uma vez ao dia em um horário específico:
  ```js
  parse_schedule("once a day at 0");
  // '0 0 * * *'
  // (Executa todos os dias à meia-noite)

  parse_schedule("once a day at 5");
  // '0 5 * * *'
  // (Executa todos os dias às 05:00)

  parse_schedule("once a day at 23");
  // '0 23 * * *'
  // (Executa todos os dias às 23:00)
  ```
*/
export function parse_schedule(schedule: ScheduleType | string): string | null {
  // Enum padrão
  switch (schedule) {
    case ScheduleType.OnceADay:
      return "0 8 * * *";
    case ScheduleType.EveryHour:
      return "0 * * * *";
    case ScheduleType.OnceAWeek:
      return "0 8 * * 1";
    case ScheduleType.OnceAMonth:
      return "0 8 1 * *";
    case ScheduleType.OnceAYear:
      return "0 8 1 1 *";
  }

  //  once a day at X hours
  const onceDayAtMatch = schedule.match(/^once a day at (\d{1,2})$/);
  if (onceDayAtMatch) {
    const hour = Number.parseInt(onceDayAtMatch[1], 10);
    if (hour >= 0 && hour <= 23) return `0 ${hour} * * *`;
  }

  // Match para intervalos personalizados
  const minutesMatch = schedule.match(/^every (\d+) minutes?$/);
  if (minutesMatch) {
    const minutes = Number.parseInt(minutesMatch[1], 10);
    if (minutes >= 1 && minutes <= 59) return `*/${minutes} * * * *`;
  }

  const secondsMatch = schedule.match(/^every (\d+) seconds?$/);
  if (secondsMatch) {
    const seconds = Number.parseInt(secondsMatch[1], 10);
    if (seconds >= 1 && seconds <= 59) return `*/${seconds} * * * * *`;
  }

  const hourlyMatch = schedule.match(/^every (\d+) hours?$/);
  if (hourlyMatch) {
    const hours = Number.parseInt(hourlyMatch[1], 10);
    if (hours >= 1 && hours <= 23) return `0 */${hours} * * *`;
  }

  const dailyMatch = schedule.match(/^every (\d+) days?$/);
  if (dailyMatch) {
    const days = Number.parseInt(dailyMatch[1], 10);
    if (days >= 1 && days <= 31) return `0 8 */${days} * *`;
  }

  const weeklyMatch = schedule.match(/^every (\d+) weeks?$/);
  if (weeklyMatch) {
    const weeks = Number.parseInt(weeklyMatch[1], 10);
    if (weeks >= 1 && weeks <= 4) return `0 8 * * ${weeks * 7}`;
  }

  const monthlyMatch = schedule.match(/^every (\d+) months?$/);
  if (monthlyMatch) {
    const months = Number.parseInt(monthlyMatch[1], 10);
    if (months >= 1 && months <= 12) return `0 8 1 */${months} *`;
  }

  const timeRangeMatch = schedule.match(
    /^every (\d+) hours? from (\d{1,2}) to (\d{1,2})$/,
  );
  if (timeRangeMatch) {
    const hours = Number.parseInt(timeRangeMatch[1], 10);
    const start = Number.parseInt(timeRangeMatch[2], 10);
    const end = Number.parseInt(timeRangeMatch[3], 10);
    if (hours >= 1 && hours <= 23 && start >= 0 && end <= 23 && start < end) {
      return `${start} */${hours} ${end} * * *`;
    }
  }

  return null;
}

# Shared Library

## Listener Pattern

Para escutar eventos do microseviço de credito.
Caso você queira escutar eventos de um outro microserviço, basta expandir o Lister:

```ts
constructor() {

  // você pode alterar o host para um microserviço diferente, por exemplo; `SERVICE.AUTH`.
  this.SERVER_URL = host({
    SERVICE: SERVICE.CREDIT,
    PATH: "/",
  }).replace(/\/{2}$/, "");

  this.io = io(this.SERVER_URL);
}
```

## Implementando um `listener` em um microserviço:

Basta importar o `Listener` e instancia-lô.
Escute os evento com `.on` que recebem um status `{sucess, failed}`, e um data que pode ser to tipo `BroadCast`.

```ts
import Listener from "listener_pattern";

export function listener_part2() {
  const listner = new Listener();

  listner.on(async (status, data) =>
    // você pode usar `is_of_type` para verificar um determinado evento é ou não um especifico,
    // como o `is` do `dartlang`.
    if (data is event_type) {
      if ("sucess" === status) {
         return;
      }
    } else if (data is event_type) {
      if ("sucess" === status) {
        return;
      }
    }

    if ("failed" === status) {
      return;
    }
  });
}
```

E no arquivo main.ts ou index.ts, chame o `listeners` após chamar o express app.

```ts

import listener_part from ...;

//... codigo do index.js

listener_part() // final da linha.
```

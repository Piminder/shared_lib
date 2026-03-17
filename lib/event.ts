/// Id's de evento para o service de analytics com outros microservices.
export function get_event_id() {
  const size = 14;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = '';
  var prefix = '';
  const charsLength = chars.length;

  for (let i = 0; i < size; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }

  prefix = "pub_";

  return `${prefix}${result}`;
}

export enum EventType {
  InvoiceCreated = "invoice.created",
  InvoicePaid = "invoice.paid",
}

export interface InvoiceCreatedEvent {
  type: EventType.InvoiceCreated;
  id: string;
  tenant_id: string;
  user_id: string;
}

export interface InvoicePaidEvent {
  type: EventType.InvoicePaid;
  id: string;
  amount: number;
}

export type AppEvent = InvoiceCreatedEvent | InvoicePaidEvent;
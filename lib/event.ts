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
  // Auth
  AuthLogin = "auth.login",
  AuthLogout = "auth.logout",

  // User
  UserActive = "user.active",

  // Customer
  CustomerCreated = "customer.created",
  CustomerDeleted = "customer.deleted",

  // Invoice
  InvoiceCreated = "invoice.created",
  InstallmentPaid = "invoice.paid",
  InvoicePaymentFailed = "invoice.payment_failed",
  InvoiceOverdue = "invoice.overdue",
  InvoiceCanceled = "invoice.canceled",

  // Notification
  NotificationSent = "notification.sent",
  NotificationDelivered = "notification.delivered",
  NotificationFailed = "notification.failed",
  NotificationOpened = "notification.opened",

  // Wallet
  WalletCredited = "wallet.credited",
  WalletDebited = "wallet.debited",
  WalletInsufficientBalance = "wallet.insufficient_balance",

  // Product
  ProductCreated = "product.created",
  ProductUpdated = "product.updated",
  ProductDeleted = "product.deleted",

  // Feature
  FeatureUsed = "feature.used",
}

interface BaseEvent {
  id: string;
  tenant_id: string;
  user_id: string;
  occurred_at: string; // ISO String for JSON
}

export interface InvoiceCreatedEvent extends BaseEvent {
  type: EventType.InvoiceCreated;
}

export interface InvoicePaidEvent extends BaseEvent {
  type: EventType.InvoicePaid;
  amount: number;
}

export type AppEvent = InvoiceCreatedEvent | InvoicePaidEvent;

export function create_event<T extends AppEvent>(
  data: Omit<T, "id" | "occurred_at">
): T {
  return {
    ...data,
    id: get_event_id(),
    occurred_at: new Date().toISOString(),
  } as T;
}
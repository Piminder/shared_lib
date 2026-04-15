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

interface BaseEvent {
  id: string;
  tenant_id: string;
  user_id: string;
  occurred_at: string; // ISO String for JSON
}

// =========================== TYPES =================================

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
  InvoicePaid = "invoice.paid",
  InvoicePaymentFailed = "invoice.payment_failed",
  InvoiceOverdue = "invoice.overdue",

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

}

// =========================== AUTH ==================================

export interface AuthLoginEvent extends BaseEvent {
  type: EventType.AuthLogin;
}

export interface AuthLogoutEvent extends BaseEvent {
  type: EventType.AuthLogout;
}

// =========================== USER ==================================

export interface UserActiveEvent extends BaseEvent {
  type: EventType.UserActive;
}

// =========================== CUSTOMER ==============================

export interface CustomerCreatedEvent extends BaseEvent {
  type: EventType.CustomerCreated;
  customer_id: string;
}

export interface CustomerDeletedEvent extends BaseEvent {
  type: EventType.CustomerDeleted;
  customer_id: string;
}

// =========================== INVOICE ===============================

export interface InvoiceCreatedEvent extends BaseEvent {
  type: EventType.InvoiceCreated;
  invoice_id: string;
  amount: number;
}

export interface InvoicePaidEvent extends BaseEvent {
  type: EventType.InvoicePaid;
  invoice_id: string;
  amount: number;
}

export interface InvoicePaymentFailedEvent extends BaseEvent {
  type: EventType.InvoicePaymentFailed;
  invoice_id: string;
  amount: number;
}

export interface InvoiceOverdueEvent extends BaseEvent {
  type: EventType.InvoiceOverdue;
  invoice_id: string;
  amount: number;
}

// =========================== NOTIFICATION ==========================

export interface NotificationSentEvent extends BaseEvent {
  type: EventType.NotificationSent;
  channel: "whatsapp" | "sms" | "email";
}

export interface NotificationDeliveredEvent extends BaseEvent {
  type: EventType.NotificationDelivered;
  channel: "whatsapp" | "sms" | "email";
}

export interface NotificationFailedEvent extends BaseEvent {
  type: EventType.NotificationFailed;
  channel: "whatsapp" | "sms" | "email";
}

export interface NotificationOpenedEvent extends BaseEvent {
  type: EventType.NotificationOpened;
  channel: "whatsapp" | "sms" | "email";
}

// =========================== WALLET ================================

export interface WalletCreditedEvent extends BaseEvent {
  type: EventType.WalletCredited;
  amount: number;
}

export interface WalletDebitedEvent extends BaseEvent {
  type: EventType.WalletDebited;
  amount: number;
}

export interface WalletInsufficientBalanceEvent extends BaseEvent {
  type: EventType.WalletInsufficientBalance;
  attempted_amount: number;
}

// =========================== PRODUCT ===============================

export interface ProductCreatedEvent extends BaseEvent {
  type: EventType.ProductCreated;
  product_id: string;
}

export interface ProductUpdatedEvent extends BaseEvent {
  type: EventType.ProductUpdated;
  product_id: string;
}

export interface ProductDeletedEvent extends BaseEvent {
  type: EventType.ProductDeleted;
  product_id: string;
}

// =========================== FEATURE ===============================


// =========================== UNION =================================

export type AppEvent =
  | AuthLoginEvent
  | AuthLogoutEvent
  | UserActiveEvent
  | CustomerCreatedEvent
  | CustomerDeletedEvent
  | InvoiceCreatedEvent
  | InvoicePaidEvent
  | InvoicePaymentFailedEvent
  | InvoiceOverdueEvent
  | NotificationSentEvent
  | NotificationDeliveredEvent
  | NotificationFailedEvent
  | NotificationOpenedEvent
  | WalletCreditedEvent
  | WalletDebitedEvent
  | WalletInsufficientBalanceEvent
  | ProductCreatedEvent
  | ProductUpdatedEvent
  | ProductDeletedEvent;

// =========================== FACTORY ================================
export function create_event<T extends AppEvent>(
  data: Omit<T, "id" | "occurred_at">
): T {
  return {
    ...data,
    id: get_event_id(),
    occurred_at: new Date().toISOString(),
  } as T;
}

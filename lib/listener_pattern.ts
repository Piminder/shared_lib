import { io, type Socket } from "socket.io-client";
import is_of_type from "./is_of_type";
import { host, SERVICE } from "./cc_conf";

export interface BroadcastPaymentData {
    wallet_id: string;
    payment_method: string;
    service_ref: string;
    customer_ref: string;
    message: string;
}

export interface BroadcastStorePaymentData {
    wallet_id: string;
    payment_method: string;
    service_ref: string;
    store_client_email: string;
    store_client_phone: string;
    to_parcel: string;
    transaction_reference: string;
    message: string;
    is_free_sale: boolean;
    amount: number;
}

export interface BroadcastStoreCreateSaleData {
    phone: string;
    email: string;
    corporate_customer_reference: string;
    product_id: string;
    value: number;
    transaction_reference: string;
    message: string;
}

export const is_broadcast_store_create_sale_data = (data: any): data is BroadcastStoreCreateSaleData =>
    is_of_type<BroadcastStoreCreateSaleData>(data, {
        phone: "string",
        email: "string",
        corporate_customer_reference: "string",
        product_id: "string",
        value: "number",
        transaction_reference: "string",
        message: "string",
    });

export const is_broadcast_payment_data = (data: any): data is BroadcastPaymentData =>
    is_of_type<BroadcastPaymentData>(data, {
        wallet_id: "string",
        payment_method: "string",
        service_ref: "string",
        customer_ref: "string",
        message: "string",
    });

export const is_broadcast_store_payment_data = (data: any): data is BroadcastStorePaymentData =>
    is_of_type<BroadcastStorePaymentData>(data, {
        wallet_id: "string",
        payment_method: "string",
        service_ref: "string",
        store_client_email: "string",
        store_client_phone: "string",
        to_parcel: "string",
        transaction_reference: "string",
        message: "string",
        is_free_sale: "boolean",
        amount: "number",
    });

type CallBack = (status: "sucess" | "failed", data: BroadcastPaymentData | BroadcastStorePaymentData | BroadcastStoreCreateSaleData) => void;

export type EmitEvent = "sale_created" | "customer_created";

export default class Listener {
    private SERVER_URL: string;

    private io: Socket;

    constructor() {
        this.SERVER_URL = host({
            SERVICE: SERVICE.CREDIT,
            PATH: "/",
        }).replace(/\/{2}$/, "");

        this.io = io(this.SERVER_URL);
    }

    public on(callback: CallBack) {
        // events
        this.io.on("payment_success", (data: BroadcastPaymentData) => {
            callback("sucess", data);
        });

        this.io.on("payment_failure", (data: BroadcastPaymentData) => {
            callback("failed", data);
        });

        this.io.on("store_payment_success", (data: BroadcastStorePaymentData) => {
            callback("sucess", data);
        });

        this.io.on("store_payment_failure", (data: BroadcastStorePaymentData) => {
            callback("failed", data);
        });

        // socket connections
        this.io.on("connect", () => {
            console.log("Listener credit service, with id:", this.io.id);
        });

        this.io.on("connect_error", (error) => {
            console.error("Erro de conexão:", error.message);
        });

        this.io.on("disconnect", () => {
            console.log("Desconectado do servidor");
        });
    }

    public emit(event: EmitEvent, data: any) {
        this.io.emit(event, data);
    }
}

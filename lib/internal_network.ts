import axios from "axios";
import Result from "./result";
import GenericError from "./err";
import { host, SERVICE } from "./cc_conf";

export interface ICreateProductArgs {
  name: string;
  description: string;
  price: number;
  save: boolean;
  is_signature: boolean;
  interval: number;
}
interface INotificationServiceDiscountArgs {
  wallet_id: string;
  pkg: boolean;
  whatsapp: boolean;
  service_ref: string;
}

export interface IWalletResponse {
  message: IWalletResponseMessage;
}

interface IWalletResponseMessage {
  id: string;
  name: string;
  company_ref: string;
  balance: number;
  notifications: {
    sms: number;
    email: number;
    whatsapp: number;
  };
}

const ChargeStatus: {
  [x: string]: "PAID" | "TOBEACCEPT" | "WAITINGPAYMENT" | "OVERDUE";
} = {
  PAID: "PAID",
  TOBEACCEPT: "TOBEACCEPT",
  WAITINGPAYMENT: "WAITINGPAYMENT",
  OVERDUE: "OVERDUE",
};

export type ChargeStatus = (typeof ChargeStatus)[keyof typeof ChargeStatus];

interface IWatsappNotificationArgs {
  customer_name: string;
  company_name: string;
  value: string;
  installment_id: string;
  cus_numbers: string[];
}

interface ISMSNotificationArgs {
  company_name: string;
  value: string;
  link_text: string;
  number: string;
}

interface IConfirmPaymentNotificationArgs {
  company_name: string;
  client_name: string;
  to: string;
  status: ChargeStatus;
  due_date: Date;
  installment_id: string;
  installment_value: number;
  installment_description: string;
}

interface INotificationArgs {
  company_name: string;
  client_name: string;
  to: string;
  installment_id: string;
  installment_due_date: string;
  installment_value: string;
  installment_description: string;
}

interface IProductResponse {
  message: IProductMessage;
}

interface IProductMessage {
  id: string;
}

interface ICustomerArgs {
  first_name: string;
  email: string;
  phone: string;
  identification_number: string | undefined;
  company_id: string;
}

interface ICustomerResponse {
  message: ICustomerMessage;
}

interface ICustomerMessage {
  id: string;
  first_name: string;
  email: string;
}

export default class InternalServiceNetwork {
  auth_token: string;

  public get token() {
    return this.auth_token;
  }

  public subscribe_token(injet: string) {
    this.auth_token = injet;
  }

  constructor(auth_token: string) {
    this.auth_token = auth_token;

    this.send_recovery_password_mail =
      this.send_recovery_password_mail.bind(this);

    this.create_customer = this.create_customer.bind(this);
    this.create_product = this.create_product.bind(this);
    this.send_mail_notification = this.send_mail_notification.bind(this);
    this.package_discount = this.package_discount.bind(this);
    this.send_sms_notification = this.send_sms_notification.bind(this);
    this.send_payment_notification = this.send_payment_notification.bind(this);

    this.send_confirm_payment_notification_watsapp =
      this.send_confirm_payment_notification_watsapp.bind(this);
    this.send_deny_payment_notification_watsapp =
      this.send_deny_payment_notification_watsapp.bind(this);
    this.send_create_invoice_notification_watsapp =
      this.send_create_invoice_notification_watsapp.bind(this);

    this.get_company_wallet = this.get_company_wallet.bind(this);
    this.discount_the_value_of_the_notification_service =
      this.discount_the_value_of_the_notification_service.bind(this);

    this.create_wallet = this.create_wallet.bind(this);
    this.send_any_sms_message = this.send_any_sms_message.bind(this);
    this.notify_about_deposit = this.notify_about_deposit.bind(this);

    this.test_deposit = this.test_deposit.bind(this);

    this.dispose_notification_file = this.dispose_notification_file.bind(this);
  }

  public async send_recovery_password_mail(
    owner_name: string,
    mail: string,
    token: string,
  ): Promise<Result<void>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      owner_name: owner_name,
      mail: mail,
      token: token,
    };

    try {
      const notify_response = await axios.post(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: "v1/api/notification/auth/password",
        }),
        request_data,
        {
          headers,
        },
      );

      if (notify_response.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(void 0);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (err: any) {
      return Result.failure(err.response.data.message);
    }
  }

  public async notify_about_deposit(
    to: string,
    amount: number,
    txr_id: string,
  ): Promise<Result<void>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      to: to,
      amount: amount,
      txr_id: txr_id,
    };

    try {
      const notify_response = await axios.post(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: "v1/api/notification/wallet-deposit-mail",
        }),
        request_data,
        {
          headers,
        },
      );

      if (notify_response.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(void 0);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async send_any_sms_message(
    message: string,
    tel: string,
  ): Promise<Result<undefined>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      message: message,
      tel: tel,
    };

    try {
      const r = await axios.post(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: "v1/api/notification/sms",
        }),
        request_data,
        {
          headers,
        },
      );

      if (r.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(void 0);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async create_wallet(
    name: string,
    company_ref: string,
  ): Promise<Result<string>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      name: name,
      company_ref: company_ref,
    };

    try {
      const r = await axios.post(
        host({
          SERVICE: SERVICE.CREDIT,
          PATH: "v1/api/credit/wallet/create",
        }),
        request_data,
        {
          headers,
        },
      );

      if (r.status !== 200)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(r.data.message.id);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async get_company_wallet(
    ref: string,
  ): Promise<Result<IWalletResponseMessage>> {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const r = await axios.get(
        host({
          SERVICE: SERVICE.CREDIT,
          PATH: `v1/api/credit/wallet/cref/${ref}`,
        }),
        {
          headers,
        },
      );

      if (r.status !== 200)
        return Result.failure(GenericError.unexpected_error______);

      const data: IWalletResponse = r.data;
      return Result.success(data.message as IWalletResponseMessage);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async test_deposit(
    wallet_id: string,
    amount: number,
  ): Promise<Result<void>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      wallet_id: wallet_id,
      amount: amount,
      method: {
        name: "test",
        phone_number: "877134964",
      },
    };

    try {
      const auth_response = await axios.post(
        host({
          SERVICE: SERVICE.CREDIT,
          PATH: "v1/api/credit/wallet/deposit",
        }),
        request_data,
        {
          headers,
        },
      );

      if (auth_response.status !== 200)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(void 0);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async discount_the_value_of_the_notification_service({
    wallet_id,
    pkg,
    whatsapp,
    service_ref,
  }: INotificationServiceDiscountArgs): Promise<Result<void>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      wallet_id: wallet_id,
      service: {
        buy: {
          notification: {
            sms_mail: pkg,
            whatsapp: whatsapp,
            service_ref: service_ref,
          },
        },
      },
    };

    try {
      const auth_response = await axios.post(
        host({
          SERVICE: SERVICE.CREDIT,
          PATH: "v1/api/credit/wallet/debit",
        }),
        request_data,
        {
          headers,
        },
      );

      if (auth_response.status !== 200)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(void 0);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async create_customer(
    args: ICustomerArgs,
  ): Promise<Result<ICustomerMessage>> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.auth_token,
    };

    const request_data = {
      customer_data: {
        first_name: args.first_name,
        phone: args.phone,
        email: args.email,
        identification_number: args.identification_number,
        birthday: "1990-01-01",
      },
      address: {
        country_id: 1,
        city_id: 1,
        postal_code: "123",
        street: "12",
      },
    };

    try {
      const auth_response = await axios.post(
        host({
          SERVICE: SERVICE.AUTHENTICATIOIN,
          PATH: "v1/api/auth/customer/create",
        }),
        request_data,
        { headers },
      );

      if (auth_response.status !== 200) {
        console.log(`HTTP error: ${auth_response.data.message}`);
        return Result.failure(auth_response.data.message);
      }

      const res: ICustomerResponse = auth_response.data;
      return Result.success(res.message as ICustomerMessage);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      console.log(`Unexpected error: ${error.response.data.message}`);
      return Result.failure(error.response.data.message);
    }
  }

  public async create_product(
    args: ICreateProductArgs,
  ): Promise<Result<string>> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.auth_token,
    };

    try {
      const r = await axios.post(
        host({
          SERVICE: SERVICE.PRODUCT,
          PATH: "v1/api/product",
        }),
        args,
        {
          headers,
        },
      );

      if (r.status !== 200)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(r.data.message);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async send_mail_notification(
    args: INotificationArgs,
  ): Promise<Result<boolean>> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.auth_token,
    };

    const request_data = {
      company_name: args.company_name,
      client_name: args.client_name,
      to: args.to,
      installment_id: args.installment_id,
      installment_due_date: args.installment_due_date,
      installment_value: args.installment_value,
      installment_description: args.installment_description,
    };

    try {
      const notify_response = await axios.post(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: "v1/api/notification/invoice/mail",
        }),
        request_data,
        {
          headers,
        },
      );

      if (notify_response.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(true);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async package_discount(
    installment_id: string,
    specific_value: number | null = null,
  ): Promise<Result<boolean>> {
    const headers = {
      "Content-Type": "application/json",
      // Authorization: this.auth_token,
    };

    let request_data: unknown = {};

    if (null === specific_value) {
      request_data = {
        installment_id: installment_id,
      };
    } else {
      request_data = {
        installment_id: installment_id,
        specific_value: specific_value,
      };
    }

    try {
      const notify_response = await axios.post(
        host({
          SERVICE: SERVICE.CREDIT,
          PATH: "v1/api/credit/discount",
        }),
        request_data,
        {
          headers,
        },
      );

      if (notify_response.status !== 200)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(true);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async send_sms_notification(
    args: ISMSNotificationArgs,
  ): Promise<Result<boolean>> {
    const headers = {
      "Content-Type": "application/json",
      // Authorization: this.auth_token,
    };

    const request_data = {
      company_name: args.company_name,
      value: args.value,
      link_text: args.link_text,
      number: args.number,
    };

    try {
      const notify_response = await axios.post(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: "v1/api/notification/invoice/sms",
        }),
        request_data,
        {
          headers,
        },
      );

      if (notify_response.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(true);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async send_payment_notification(
    args: IConfirmPaymentNotificationArgs,
  ): Promise<Result<boolean>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      company_name: args.company_name,
      client_name: args.client_name,
      to: args.to,
      status: args.status,
      due_date: args.due_date,
      installment_id: args.installment_id,
      installment_value: args.installment_value,
      installment_description: args.installment_description,
    };

    try {
      const notify_response = await axios.post(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: "v1/api/notification/invoice/mail/confirm",
        }),
        request_data,
        {
          headers,
        },
      );

      if (notify_response.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(true);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async send_confirm_payment_notification_watsapp(
    args: IWatsappNotificationArgs,
  ): Promise<Result<boolean>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      customer_name: args.customer_name,
      company_name: args.company_name,
      value: args.value,
      installment_id: args.installment_id,
      cus_numbers: args.cus_numbers,
    };

    try {
      const notify_response = await axios.post(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: "v1/api/notification/whatsapp/confirm-payment",
        }),
        request_data,
        {
          headers,
        },
      );

      if (notify_response.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(true);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async send_deny_payment_notification_watsapp(
    args: IWatsappNotificationArgs,
  ): Promise<Result<boolean>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      customer_name: args.customer_name,
      company_name: args.company_name,
      value: args.value,
      installment_id: args.installment_id,
      cus_numbers: args.cus_numbers,
    };

    try {
      const notify_response = await axios.post(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: "v1/api/notification/whatsapp/deny-payment",
        }),
        request_data,
        {
          headers,
        },
      );

      if (notify_response.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(true);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async send_create_invoice_notification_watsapp(
    args: IWatsappNotificationArgs,
  ): Promise<Result<boolean>> {
    const headers = {
      "Content-Type": "application/json",
    };

    const request_data = {
      customer_name: args.customer_name,
      company_name: args.company_name,
      value: args.value,
      installment_id: args.installment_id,
      cus_numbers: args.cus_numbers,
    };

    try {
      const notify_response = await axios.post(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: "v1/api/notification/whatsapp/create-invoice",
        }),
        request_data,
        {
          headers,
        },
      );

      if (notify_response.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(true);
    } catch (error) {
      return Result.failure(GenericError.unexpected_error______);
    }
  }

  public async dispose_notification_file(
    company_id: string,
  ): Promise<Result<void>> {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const r = await axios.delete(
        host({
          SERVICE: SERVICE.NOTIFICATION,
          PATH: `v1/api/notification/dispose?company_id=${company_id}`,
        }),
        {
          headers,
        },
      );

      if (r.status !== 204)
        return Result.failure(GenericError.unexpected_error______);

      return Result.success(void 0);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      return Result.failure(error.response.data.message);
    }
  }
}

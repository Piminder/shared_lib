enum SERVICE {
  AUTHENTICATIOIN = "auth",
  PRODUCT = "product",
  NOTIFICATION = "notification",
  CREDIT = "credit",
  INVOICE = "invoice",
  ENCRYPTION = "encryption",
}

interface HOST {
  SERVICE: SERVICE;
  PATH: string;
}

function host({ SERVICE, PATH }: HOST): string {
  let port = 8080;

  if ("auth" === SERVICE) port = 3000;
  else if ("invoice" === SERVICE) port = 3001;
  else if ("credit" === SERVICE) port = 3002;
  else if ("product" === SERVICE) port = 3003;
  else if ("notification" === SERVICE) port = 3004;
  else if ("encryption" === SERVICE) port = 9094;

  return `http://${SERVICE}:${port}/${PATH}`;
}

export { host, SERVICE, type HOST };

enum SERVICE {
  AUTHENTICATIOIN = "auth",
  PRODUCT = "product",
  NOTIFICATION = "notification",
  CREDIT = "credit",
  INVOICE = "invoice",
  ENCRYPTION = "encryption",
  ENCRYPTION_STATIC = "encryption_static",
}

interface HOST {
  SERVICE: SERVICE;
  PATH: string;
  LOCAL?: boolean;
}

function host({ SERVICE, PATH, LOCAL = false }: HOST): string {
  let port = 8080;

  if ("auth" === SERVICE) port = 3000;
  else if ("invoice" === SERVICE) port = 3001;
  else if ("credit" === SERVICE) port = 3002;
  else if ("product" === SERVICE) port = 3003;
  else if ("notification" === SERVICE) port = 3004;
  else if ("encryption" === SERVICE) port = 9094;
  else if (SERVICE === "encryption_static") port = 9095;

  if (LOCAL) return `http://localhost:${port}/${PATH}`;
  return `http://${SERVICE}:${port}/${PATH}`;
}

export { host, SERVICE, type HOST };

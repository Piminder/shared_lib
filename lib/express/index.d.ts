declare namespace Express {
  export interface Request {
    company_id: string;
    user_id: string;
  }

  export interface Response {
    responseBody: unknown;
  }
}

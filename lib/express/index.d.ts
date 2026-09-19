declare namespace Express {
  export interface Request {
    company_id: string;
    user_id: string;
    is_internal?: boolean;
  }

  export interface Response {
    responseBody: unknown;
  }
}

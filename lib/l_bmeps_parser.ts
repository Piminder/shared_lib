export type Header = {
  entity_code: string;
  creation_date: string;
  file_id: string;
};

export type Transaction = {
  reference: string;
  amount: number;
  commission: number;
  payment_date: string;
  payment_time: string;
};

export type Footer = {
  record_count: number;
  total_amount: number;
  total_commission: number;
};

export type LParsedFile = {
  header: Header;
  transactions: Transaction[];
  footer: Footer;
};

function parse_currency(s: string): number {
  const value = parseInt(s, 10);
  return value / 100;
}

function format_date(raw: string): string {
  const year = raw.slice(0, 4);
  const day = raw.slice(4, 6);
  const month = raw.slice(6, 8);
  return `${day}/${month}/${year}`;
}

function format_time(raw: string): string {
  const hour = raw.slice(0, 2);
  const minute = raw.slice(2, 4);
  return `${hour}:${minute}`;
}

export default class LParserBMEPS {
  public content: LParsedFile;
  constructor(s: string) {
    this.content = this.parse(s);
  }

  private parse_header(line: string): Header {
    if (line.length !== 19)
      throw new Error("Invalid header. Expected 19 characters.");

    return {
      entity_code: line.slice(1, 6),
      creation_date: format_date(line.slice(6, 14)),
      file_id: line.slice(14, 19),
    };
  }

  private parse_transaction(line: string): Transaction {
    if (line.length !== 65)
      throw new Error("Invalid transaction. Expected 65 characters.");

    return {
      reference: line.slice(1, 12),
      amount: parse_currency(line.slice(12, 28)),
      commission: parse_currency(line.slice(28, 44)),
      payment_date: format_date(line.slice(44, 52)),
      payment_time: format_time(line.slice(52, 58)),
    };
  }

  private parse_footer(line: string): Footer {
    if (line.length !== 40)
      throw new Error("Invalid footer. Expected 58 characters.");

    return {
      record_count: parseInt(line.slice(1, 8), 10),
      total_amount: parse_currency(line.slice(8, 24)),
      total_commission: parse_currency(line.slice(24, 40)),
    };
  }

  private parse(s: string): LParsedFile {
    const lines = s.trim().split(/\r?\n/);

    // validar se o ficheiro está vazio ou contém infos de cabeçalho e rodapé.
    if (lines.length < 2) {
      throw new Error(
        "Ficheiro inválido: deve conter pelo menos cabeçalho e rodapé.",
      );
    }

    const header_line = lines[0];
    const footer_line = lines[lines.length - 1]; // o footer sempre será a última linha, como não temos `last element em js`, temos uma pyconvetion de -1 ou, [-1].
    const transaction_lines = lines.slice(1, -1); // as linhas de transações, estarão entre a linha 1 a last-line (-1)

    const header = this.parse_header(header_line);
    const transactions = transaction_lines.map(this.parse_transaction);
    const footer = this.parse_footer(footer_line);

    if (footer.record_count !== transactions.length) {
      throw new Error(
        `Número de registos no rodapé (${footer.record_count}) não corresponde ao número de transações (${transactions.length}).`,
      );
    }

    return { header, transactions, footer };
  }
}

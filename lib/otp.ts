// otp.ts
import { randomBytes } from "node:crypto"; // Node.js. No browser, ver fallback abaixo.

export default class OTP {
  /** Generates numeric OTP with the exact number of digits. */
  public static numeric(length: number): string {
    if (!Number.isInteger(length) || length <= 0) {
      throw new Error("length deve ser inteiro > 0");
    }
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    return code.toString();
  }

  /**
   * Generates a random "XWLM2QSZ" style key.
   * @param length Key length.
   * @param alphabet Character set (default: A–Z + 0–9).
   * @returns generated string.
   */
  public static key(
    length: number,
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  ): string {
    if (!Number.isInteger(length) || length <= 0) {
      throw new Error("length deve ser inteiro > 0");
    }
    if (!alphabet || alphabet.length === 0) {
      throw new Error("alphabet não pode ser vazio");
    }

    const bytes = OTP.secure_random(length);
    const n = alphabet.length;
    let out = "";

    for (let i = 0; i < length; i++) {
      out += alphabet[bytes[i] % n];
    }
    return out;
  }

  private static secure_random(size: number): Uint8Array {
    if (typeof globalThis.crypto?.getRandomValues === "function") {
      const arr = new Uint8Array(size);
      globalThis.crypto.getRandomValues(arr);
      return arr;
    }
    const buf = randomBytes(size);
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
}

import fs from "fs";
import path from "path";

export const TOKEN_CACHE_PATH = path.resolve(".cache/token.json");

export type TokenCache = {
  [key: string]: {
    token: string;
    expires_at: number;
  };
};

export function load_token_cache(): TokenCache {
  try {
    if (!fs.existsSync(TOKEN_CACHE_PATH)) return {};
    const data = fs.readFileSync(TOKEN_CACHE_PATH, "utf-8");
    return JSON.parse(data) as TokenCache;
  } catch {
    return {};
  }
}

export function save_token_cache(cache: TokenCache) {
  fs.mkdirSync(path.dirname(TOKEN_CACHE_PATH), { recursive: true });
  fs.writeFileSync(TOKEN_CACHE_PATH, JSON.stringify(cache, null, 2));
}

export function get_cached_token(gref: string, service: string): string | null {
  const key = `${gref}:${service}`;
  const cache = load_token_cache();

  if (cache[key] && cache[key].expires_at > Date.now()) {
    return cache[key].token;
  }

  return null;
}

export function cache_token(
  gref: string,
  service: string,
  token: string,
  ttl_ms: number = 24 * 60 * 60 * 1000,
) {
  const key = `${gref}:${service}`;
  const cache = load_token_cache();

  cache[key] = {
    token,
    expires_at: Date.now() + ttl_ms,
  };

  save_token_cache(cache);
}

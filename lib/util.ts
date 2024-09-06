export function generate_random_name(client_name: string): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `@store.unknown.${client_name}_${randomSuffix}`;
}

export function generate_random_email_sufix(m: string): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${m}.store.${randomSuffix}`;
}

export function generate_random_phone_sufix(p: string): string {
  const date = Date.now();
  const randomSuffix = (Math.random() * date).toString().slice(0, 5);
  return `${p}123${randomSuffix}`;
}

export function clean_phone(phone: string): string {
  const match = phone.match(/(.+?)123\d{5}$/);
  return match ? match[1] : phone;
}

export function clean_email(email: string): string {
  const match = email.match(/(.+?)\.store\..+$/);
  return match ? match[1] : email;
}

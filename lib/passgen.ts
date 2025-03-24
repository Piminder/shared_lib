export default function generate_password(length: number): string {
  const lower_case = "abcdefghijklmnopqrstuvwxyz";
  const upper_case = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special_chars = "!@#$%^&*()_-+=<>?/.,;:";

  const all_chars = lower_case + upper_case + numbers + special_chars;

  let password = "";

  password += lower_case.charAt(Math.floor(Math.random() * lower_case.length));
  password += upper_case.charAt(Math.floor(Math.random() * upper_case.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special_chars.charAt(
    Math.floor(Math.random() * special_chars.length),
  );

  for (let i = password.length; i < length; i++) {
    password += all_chars.charAt(Math.floor(Math.random() * all_chars.length));
  }

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

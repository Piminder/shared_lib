export default function is_of_type<T>(
  data: any,
  properties: { [K in keyof T]: string },
): data is T {
  return Object.keys(properties).every(
    (key) => typeof data[key] === properties[key],
  );
}

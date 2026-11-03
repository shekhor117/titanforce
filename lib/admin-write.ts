export function pickWritableFields<T extends Record<string, unknown>>(
  body: Record<string, unknown>,
  fields: readonly (keyof T & string)[],
): Partial<T> {
  return Object.fromEntries(
    fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]),
  ) as Partial<T>
}

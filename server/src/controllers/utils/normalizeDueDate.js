export function normalizeDueDate(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return new Date(value);
}

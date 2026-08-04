import { normalizeTitle } from "./normalizeTitle";

export function isDuplicateTitle(userArray, title, id = null) {
  const normalizedTitle = normalizeTitle(title);
  return userArray.some(
    (item) => item._id !== id && normalizeTitle(item.title) === normalizedTitle,
  );
}

import { showWarning } from "./showApiResponse";

export function isEmptyUpdateBody(patchBody) {
  const empty = Object.keys(patchBody).length === 0;

  if (empty) {
    showWarning("No fields to update!");
  }

  return empty;
}

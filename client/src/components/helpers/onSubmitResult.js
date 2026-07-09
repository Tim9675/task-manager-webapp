export async function onSubmitResult(isEdit, prev, curr, onsubmit) {
  if (isEdit) {
    const patch = {};

    for (const key of Object.keys(curr)) {
      if (curr[key] !== prev[key]) {
        patch[key] = curr[key];
      }
    }

    return onsubmit(prev._id, patch);
  } else {
    return onsubmit(...Object.values(curr));
  }
}

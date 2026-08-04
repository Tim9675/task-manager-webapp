export function sanitizeDocument(obj) {
  const resp = obj.toObject();

  delete resp.__v;
  delete resp.userId;
  delete resp.createdAt;
  delete resp.updatedAt;

  return resp;
}

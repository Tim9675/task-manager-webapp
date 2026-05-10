export function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    timezone: user.timezone,
  };
}

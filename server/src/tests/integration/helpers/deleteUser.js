import User from "../../../models/User";

export async function deleteUser(userId) {
  await User.findByIdAndDelete(userId);
}

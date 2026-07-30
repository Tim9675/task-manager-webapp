import bcrypt from "bcrypt";

import { signToken } from "../../../controllers/helpers/signToken.js";
import User from "../../../models/User.js";

export async function createUser(name, email) {
  const user = await User.create({
    name: name,
    email: email,
    passwordHash: await bcrypt.hash("password", 10),
    timezone: "Asia/Manila",
  });

  return {
    user,
    token: signToken(user._id),
  };
}

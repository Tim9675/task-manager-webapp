import { normalizeString } from "../helpers/normalizeString.js";
import { requireString } from "./helpers/validationHelpers.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*,()\\/\-_+=[\]{}:;<>?\|~])[A-Za-z\d!@#$%^&*,()\\/\-_+=[\]{}:;<>?\|~]{8,}$/;

export function validateRegister(req, res, next) {
  const { name, email, password, timezone } = req.body;

  let errorMessage = "";
  const nameError = requireString(name, "Name", 30);
  if (nameError) {
    errorMessage += nameError + "\n";
  }

  const emailError = requireString(email, "Email", 254); // DOC: 254 is the max email length as per current standards
  if (emailError) {
    errorMessage += emailError + "\n";
  } else {
    const normalizedEmail = normalizeString(email);

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      errorMessage += "Invalid email address\n";
    }
  }

  if (!PASSWORD_PATTERN.test(password)) {
    errorMessage +=
      "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, a special character\n";
  }

  if (errorMessage.length > 0) {
    return res.status(400).json({ message: errorMessage });
  }

  if (
    typeof timezone !== "string" ||
    !Intl.supportedValuesOf("timeZone").includes(timezone)
  ) {
    return res.status(400).json({ message: "Invalid timezone" });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  const emailError = requireString(email, "Email");
  if (emailError) {
    return res.status(400).json({ message: emailError });
  }

  const passwordError = requireString(password, "Password");
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  next();
}

import { isValidHexColor, requireString } from "./helpers/validationHelpers.js";

export function validateCreateTag(req, res, next) {
  const { title, color } = req.body;

  const titleError = requireString(title, "Title", 25);
  if (titleError) {
    return res.status(400).json({ message: titleError });
  }

  const colorError = isValidHexColor(color);
  if (colorError) {
    return res.status(400).json({
      message: colorError,
    });
  }

  next();
}

export function validateUpdateTag(req, res, next) {
  const { title, color } = req.body;

  if (title !== undefined) {
    const titleError = requireString(title, "Title", 25);
    if (titleError) {
      return res.status(400).json({ message: titleError });
    }
  }

  if (color !== undefined) {
    const colorError = isValidHexColor(color);
    if (colorError) {
      return res.status(400).json({ message: colorError });
    }
  }

  next();
}

import { isValidHexColor, requireString } from "./helpers/validationHelpers.js";

export function validateCreateList(req, res, next) {
  const { title, color } = req.body;

  const titleError = requireString(title, "Title", 50);
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

export function validateUpdateList(req, res, next) {
  const { title, color } = req.body;

  if (title !== undefined) {
    const titleError = requireString(title, "Title", 50);
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

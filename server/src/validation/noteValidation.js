import {
  isValidHexColor,
  requireString,
  optionalString,
} from "./helpers/validationHelpers.js";

export function validateCreateNote(req, res, next) {
  const { title, content, color } = req.body;

  const titleError = requireString(title, "Title", 20);
  if (titleError) {
    return res.status(400).json({ message: titleError });
  }

  const contentError = optionalString(content, "Content");
  if (contentError) {
    return res.status(400).json({ message: contentError });
  }

  const colorError = isValidHexColor(color);
  if (colorError) {
    return res.status(400).json({ message: colorError });
  }

  next();
}

export function validateUpdateNote(req, res, next) {
  const { title, content, color } = req.body;

  if (title !== undefined) {
    const titleError = requireString(title, "Title", 20);
    if (titleError) {
      return res.status(400).json({ message: titleError });
    }
  }

  if (content !== undefined) {
    const contentError = optionalString(content, "Content");
    if (contentError) {
      return res.status(400).json({ message: contentError });
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

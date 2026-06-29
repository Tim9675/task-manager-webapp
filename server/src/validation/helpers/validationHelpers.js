import mongoose from "mongoose";
import { DateTime } from "luxon";

const MIN_LENGTH_REQUIRED = 2;
const MAX_LENGTH_OPTIONAL = 500;

export function requireString(value, fieldName, max = 100) {
  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }
  if (!value.trim()) {
    return `${fieldName} must be a non-empty string`;
  }
  if (value.length < MIN_LENGTH_REQUIRED || max < value.length) {
    return `${fieldName} must be between ${MIN_LENGTH_REQUIRED} and ${max} characters long`;
  }
  return null;
}

export function optionalString(value, fieldName) {
  if (value == null) return null;

  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }

  if (value.length > MAX_LENGTH_OPTIONAL) {
    return `${fieldName} must not exceed ${MAX_LENGTH_OPTIONAL} characters`;
  }

  return null;
}

export function isValidObjectId(value, fieldName) {
  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return `${fieldName} must be a valid ObjectId`;
  }
  return null;
}

export function isValidISODate(value, fieldName) {
  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }
  if (!DateTime.fromISO(value).isValid) {
    return `${fieldName} must be a valid ISO date`;
  }
  return null;
}

export function requireArray(value, fieldName) {
  if (!Array.isArray(value)) {
    return `${fieldName} must be an array`;
  }
  return null;
}

export function requireBoolean(value, fieldName) {
  if (typeof value !== "boolean") {
    return `${fieldName} must be a boolean`;
  }
  return null;
}

export function isValidHexColor(value) {
  if (typeof value !== "string") {
    return "Color must be a string";
  }
  const hexColorPattern = /^#([0-9A-Fa-f]{6})$/;

  if (!hexColorPattern.test(value)) {
    return "Color must be a valid hex color value";
  }

  return null;
}

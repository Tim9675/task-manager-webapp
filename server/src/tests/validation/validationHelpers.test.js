import { describe, expect, test } from "vitest";
import {
  requireString,
  optionalString,
  isValidObjectId,
  isValidISODate,
  requireArray,
  requireBoolean,
  isValidHexColor,
} from "../../validation/helpers/validationHelpers";

describe("requireString", () => {
  test("returns null for a valid string", () => {
    expect(requireString("A valid title", "Title")).toBe(null);
  });

  test("returns null for a valid string with leading and trailing whitespace", () => {
    expect(requireString("  A valid title  ", "Title")).toBe(null);
  });

  test("rejects an empty string", () => {
    expect(requireString("", "Title")).toBe("Title must be a non-empty string");
  });

  test("rejects whitespace only", () => {
    expect(requireString("      ", "Title")).toBe(
      "Title must be a non-empty string",
    );
  });

  test("rejects numbers", () => {
    expect(requireString(1, "Title")).toBe("Title must be a string");
  });

  test("rejects undefined", () => {
    expect(requireString(undefined, "Title")).toBe("Title must be a string");
  });

  test("rejects null", () => {
    expect(requireString(null, "Title")).toBe("Title must be a string");
  });

  test("rejects short titles", () => {
    expect(requireString("a", "Title")).toBe(
      "Title must be between 2 and 100 characters long",
    );
  });

  test("rejects titles longer than the limit", () => {
    expect(requireString("a".repeat(16), "Title", 15)).toBe(
      "Title must be between 2 and 15 characters long",
    );
  });
});

describe("optionalString", () => {
  test("returns null for a valid string", () => {
    expect(optionalString("A valid description", "Description")).toBe(null);
  });

  test("returns null for a valid string with leading and trailing whitespace", () => {
    expect(optionalString("  A valid description  ", "Description")).toBe(null);
  });

  test("rejects an empty string", () => {
    expect(optionalString("", "Description")).toBe(
      "Description must be a non-empty string",
    );
  });

  test("rejects a whitespace only string", () => {
    expect(optionalString("      ", "Description")).toBe(
      "Description must be a non-empty string",
    );
  });

  test("returns null for null", () => {
    expect(optionalString(null, "Description")).toBe(null);
  });

  test("returns null for undefined", () => {
    expect(optionalString(undefined, "Description")).toBe(null);
  });

  test("rejects numbers", () => {
    expect(optionalString(1, "Description")).toBe(
      "Description must be a string",
    );
  });

  test("rejects strings longer than the limit", () => {
    expect(optionalString("a".repeat(501), "Description")).toBe(
      "Description must not exceed 500 characters",
    );
  });
});

describe("isValidObjectId", () => {
  test("returns null for a valid ObjectId", () => {
    expect(isValidObjectId("507f1f77bcf86cd799439011", "List ID")).toBe(null);
  });

  test("rejects an invalid ObjectId", () => {
    expect(isValidObjectId("invalidObjectId", "List ID")).toBe(
      "List ID must be a valid ObjectId",
    );
  });

  test("rejects a number", () => {
    expect(isValidObjectId(12345, "List ID")).toBe("List ID must be a string");
  });

  test("rejects null", () => {
    expect(isValidObjectId(null, "List ID")).toBe("List ID must be a string");
  });

  test("rejects undefined", () => {
    expect(isValidObjectId(undefined, "List ID")).toBe(
      "List ID must be a string",
    );
  });
});

describe("isValidISODate", () => {
  test("returns null for a valid ISO date", () => {
    expect(isValidISODate("2023-08-15T12:00:00Z", "Due Date")).toBe(null);
  });

  test("rejects an invalid ISO date", () => {
    expect(isValidISODate("invalidDate", "Due Date")).toBe(
      "Due Date must be a valid ISO date",
    );
  });

  test("rejects a number", () => {
    expect(isValidISODate(12345, "Due Date")).toBe("Due Date must be a string");
  });

  test("rejects null", () => {
    expect(isValidISODate(null, "Due Date")).toBe("Due Date must be a string");
  });

  test("rejects undefined", () => {
    expect(isValidISODate(undefined, "Due Date")).toBe(
      "Due Date must be a string",
    );
  });
});

describe("requireArray", () => {
  test("returns null for a valid array", () => {
    expect(requireArray([], "Tag IDs")).toBe(null);
  });

  test("rejects a string", () => {
    expect(requireArray("not an array", "Tag IDs")).toBe(
      "Tag IDs must be an array",
    );
  });

  test("rejects a number", () => {
    expect(requireArray(12345, "Tag IDs")).toBe("Tag IDs must be an array");
  });

  test("rejects an object", () => {
    expect(requireArray({}, "Tag IDs")).toBe("Tag IDs must be an array");
  });

  test("rejects null", () => {
    expect(requireArray(null, "Tag IDs")).toBe("Tag IDs must be an array");
  });

  test("rejects undefined", () => {
    expect(requireArray(undefined, "Tag IDs")).toBe("Tag IDs must be an array");
  });
});

describe("requireBoolean", () => {
  test("returns null for true", () => {
    expect(requireBoolean(true, "Checked")).toBe(null);
  });

  test("returns null for false", () => {
    expect(requireBoolean(false, "Checked")).toBe(null);
  });

  test("rejects a string", () => {
    expect(requireBoolean("not a boolean", "Checked")).toBe(
      "Checked must be a boolean",
    );
  });

  test("rejects a number", () => {
    expect(requireBoolean(12345, "Checked")).toBe("Checked must be a boolean");
  });

  test("rejects null", () => {
    expect(requireBoolean(null, "Checked")).toBe("Checked must be a boolean");
  });

  test("rejects undefined", () => {
    expect(requireBoolean(undefined, "Checked")).toBe(
      "Checked must be a boolean",
    );
  });
});

describe("isValidHexColor", () => {
  test("returns null for a valid hex color", () => {
    expect(isValidHexColor("#FF5733")).toBe(null);
  });

  test("returns null for a valid hex color with lowercase letters", () => {
    expect(isValidHexColor("#ff5733")).toBe(null);
  });

  test("rejects an invalid hex color", () => {
    expect(isValidHexColor("invalidColor")).toBe(
      "Color must be a valid hex color value",
    );
  });

  test("rejects a number", () => {
    expect(isValidHexColor(12345)).toBe("Color must be a string");
  });

  test("rejects a string without #", () => {
    expect(isValidHexColor("FF5733")).toBe(
      "Color must be a valid hex color value",
    );
  });

  test("rejects null", () => {
    expect(isValidHexColor(null)).toBe("Color must be a string");
  });

  test("rejects undefined", () => {
    expect(isValidHexColor(undefined)).toBe("Color must be a string");
  });
});

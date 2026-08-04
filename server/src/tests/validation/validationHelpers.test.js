import { describe, it, expect } from "vitest";

import {
  requireString,
  optionalString,
  isValidObjectId,
  isValidISODate,
  requireArray,
  requireBoolean,
  isValidHexColor,
} from "../../validation/utils/validationUtils";

describe("requireString", () => {
  it("returns null for a valid string", () => {
    expect(requireString("A valid title", "Title")).toBe(null);
  });

  it("returns null for a valid string with leading and trailing whitespace", () => {
    expect(requireString("  A valid title  ", "Title")).toBe(null);
  });

  it("rejects an empty string", () => {
    expect(requireString("", "Title")).toBe("Title must be a non-empty string");
  });

  it("rejects whitespace only", () => {
    expect(requireString("      ", "Title")).toBe(
      "Title must be a non-empty string",
    );
  });

  it("rejects numbers", () => {
    expect(requireString(1, "Title")).toBe("Title must be a string");
  });

  it("rejects undefined", () => {
    expect(requireString(undefined, "Title")).toBe("Title must be a string");
  });

  it("rejects null", () => {
    expect(requireString(null, "Title")).toBe("Title must be a string");
  });

  it("rejects short titles", () => {
    expect(requireString("a", "Title")).toBe(
      "Title must be between 2 and 100 characters long",
    );
  });

  it("rejects titles longer than the limit", () => {
    expect(requireString("a".repeat(16), "Title", 15)).toBe(
      "Title must be between 2 and 15 characters long",
    );
  });
});

describe("optionalString", () => {
  it("returns null for a valid string", () => {
    expect(optionalString("A valid description", "Description")).toBe(null);
  });

  it("returns null for a valid string with leading and trailing whitespace", () => {
    expect(optionalString("  A valid description  ", "Description")).toBe(null);
  });

  it("returns null for null", () => {
    expect(optionalString(null, "Description")).toBe(null);
  });

  it("returns null for undefined", () => {
    expect(optionalString(undefined, "Description")).toBe(null);
  });

  it("rejects numbers", () => {
    expect(optionalString(1, "Description")).toBe(
      "Description must be a string",
    );
  });

  it("rejects strings longer than the limit", () => {
    expect(optionalString("a".repeat(501), "Description")).toBe(
      "Description must not exceed 500 characters",
    );
  });
});

describe("isValidObjectId", () => {
  it("returns null for a valid ObjectId", () => {
    expect(isValidObjectId("507f1f77bcf86cd799439011", "List ID")).toBe(null);
  });

  it("rejects an invalid ObjectId", () => {
    expect(isValidObjectId("invalidObjectId", "List ID")).toBe(
      "List ID must be a valid ObjectId",
    );
  });

  it("rejects a number", () => {
    expect(isValidObjectId(12345, "List ID")).toBe("List ID must be a string");
  });

  it("rejects null", () => {
    expect(isValidObjectId(null, "List ID")).toBe("List ID must be a string");
  });

  it("rejects undefined", () => {
    expect(isValidObjectId(undefined, "List ID")).toBe(
      "List ID must be a string",
    );
  });
});

describe("isValidISODate", () => {
  it("returns null for a valid ISO date", () => {
    expect(isValidISODate("2023-08-15T12:00:00Z", "Due Date")).toBe(null);
  });

  it("rejects an invalid ISO date", () => {
    expect(isValidISODate("invalidDate", "Due Date")).toBe(
      "Due Date must be a valid ISO date",
    );
  });

  it("rejects a number", () => {
    expect(isValidISODate(12345, "Due Date")).toBe("Due Date must be a string");
  });

  it("rejects null", () => {
    expect(isValidISODate(null, "Due Date")).toBe("Due Date must be a string");
  });

  it("rejects undefined", () => {
    expect(isValidISODate(undefined, "Due Date")).toBe(
      "Due Date must be a string",
    );
  });
});

describe("requireArray", () => {
  it("returns null for a valid array", () => {
    expect(requireArray([], "Tag IDs")).toBe(null);
  });

  it("rejects a string", () => {
    expect(requireArray("not an array", "Tag IDs")).toBe(
      "Tag IDs must be an array",
    );
  });

  it("rejects a number", () => {
    expect(requireArray(12345, "Tag IDs")).toBe("Tag IDs must be an array");
  });

  it("rejects an object", () => {
    expect(requireArray({}, "Tag IDs")).toBe("Tag IDs must be an array");
  });

  it("rejects null", () => {
    expect(requireArray(null, "Tag IDs")).toBe("Tag IDs must be an array");
  });

  it("rejects undefined", () => {
    expect(requireArray(undefined, "Tag IDs")).toBe("Tag IDs must be an array");
  });
});

describe("requireBoolean", () => {
  it("returns null for true", () => {
    expect(requireBoolean(true, "Checked")).toBe(null);
  });

  it("returns null for false", () => {
    expect(requireBoolean(false, "Checked")).toBe(null);
  });

  it("rejects a string", () => {
    expect(requireBoolean("not a boolean", "Checked")).toBe(
      "Checked must be a boolean",
    );
  });

  it("rejects a number", () => {
    expect(requireBoolean(12345, "Checked")).toBe("Checked must be a boolean");
  });

  it("rejects null", () => {
    expect(requireBoolean(null, "Checked")).toBe("Checked must be a boolean");
  });

  it("rejects undefined", () => {
    expect(requireBoolean(undefined, "Checked")).toBe(
      "Checked must be a boolean",
    );
  });
});

describe("isValidHexColor", () => {
  it("returns null for a valid hex color", () => {
    expect(isValidHexColor("#FF5733")).toBe(null);
  });

  it("returns null for a valid hex color with lowercase letters", () => {
    expect(isValidHexColor("#ff5733")).toBe(null);
  });

  it("rejects an invalid hex color", () => {
    expect(isValidHexColor("invalidColor")).toBe(
      "Color must be a valid hex color value",
    );
  });

  it("rejects a number", () => {
    expect(isValidHexColor(12345)).toBe("Color must be a string");
  });

  it("rejects a string without #", () => {
    expect(isValidHexColor("FF5733")).toBe(
      "Color must be a valid hex color value",
    );
  });

  it("rejects null", () => {
    expect(isValidHexColor(null)).toBe("Color must be a string");
  });

  it("rejects undefined", () => {
    expect(isValidHexColor(undefined)).toBe("Color must be a string");
  });
});

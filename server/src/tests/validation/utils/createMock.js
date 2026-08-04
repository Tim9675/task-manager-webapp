import { vi } from "vitest";

function createMockResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

export default function createMock() {
  return {
    res: createMockResponse(),
    next: vi.fn(),
  };
}

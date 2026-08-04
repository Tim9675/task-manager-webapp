import { beforeEach, vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AddTask from "../../components/tasks/AddTask";

const onCreateTask = vi.fn();

vi.mock("../../contexts/useTasks", () => ({
  useTasks: () => ({
    onCreateTask,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const createdTask = {
  message: "Task created successfully",
  data: {
    _id: "123",
    title: "New task title",
    description: "",
    dueDate: null,
    listId: null,
    tagIds: [],
    subtasks: [],
    checked: false,
  },
};

function renderComponent() {
  render(<AddTask activeView={{ type: "today" }} />);
  return {
    titleBox: screen.getByLabelText(/task title/i),
    createButton: screen.getByLabelText("Add new task"),
  };
}

describe("Add Task", () => {
  it("creates a new task via button click", async () => {
    onCreateTask.mockResolvedValue(createdTask);

    const { titleBox, createButton } = renderComponent();
    render(<AddTask activeView={{ type: "today" }} />);

    await userEvent.type(titleBox, "New task title");
    await userEvent.click(createButton);

    expect(onCreateTask).toHaveBeenCalledWith("New task title", {
      type: "today",
    });
    expect(titleBox).toHaveValue("");
  });

  it("creates a new task via enter press", async () => {
    onCreateTask.mockResolvedValue(createdTask);

    const { titleBox } = renderComponent();

    await userEvent.type(titleBox, "New task title");
    await userEvent.keyboard("{Enter}");

    expect(onCreateTask).toHaveBeenCalledWith("New task title", {
      type: "today",
    });
    expect(titleBox).toHaveValue("");
  });

  it("doesn't clear input when create task fails", async () => {
    onCreateTask.mockResolvedValue(null);

    const { titleBox } = renderComponent();

    await userEvent.type(titleBox, "New task title");
    await userEvent.keyboard("{Enter}");

    expect(onCreateTask).toHaveBeenCalledWith("New task title", {
      type: "today",
    });
    expect(titleBox).toHaveValue("New task title");
  });
});

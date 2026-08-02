import { beforeEach, vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TaskForm from "../../components/tasks/TaskForm";

const onUpdateTask = vi.fn();
const onDeleteTask = vi.fn();
const closeTask = vi.fn();

vi.mock("../../contexts/useTasks", () => ({
  useTasks: () => ({
    onUpdateTask,
    onDeleteTask,
    isDeletingTask: false,
    closeTask,
  }),
}));

vi.mock("../../contexts/useLists", () => ({
  useLists: () => ({
    userLists: [
      {
        _id: "6a3521abb585df96518271a7",
        title: "Personal",
      },
    ],
  }),
}));

vi.mock("../../components/tasks/TagSection", () => ({
  default: () => <div>TagSection</div>,
}));

vi.mock("../../components/tasks/SubtaskSection", () => ({
  default: () => <div>SubtaskSection</div>,
}));

vi.mock("../../components/tasks/DeleteItemModal", () => ({
  default: ({ onDelete, onClose }) => (
    <div>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
      <button type="button" onClick={onDelete}>
        Delete
      </button>
    </div>
  ),
}));

vi.mock("../../components/tasks/ButtonBar", () => ({
  default: ({ onOpen }) => (
    <div>
      <button type="button" onClick={onOpen}>
        Delete Task
      </button>
      <button type="submit">Save Changes</button>
    </div>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function renderComponent(selectedTask) {
  render(<TaskForm selectedTask={selectedTask} />);
}

const selectedTask = {
  _id: "123",
  title: "Test title",
  description: "Test description",
  listId: "6a3521abb585df96518271a7",
  dueDate: "2026-08-01T10:35:40+00:00",
};

describe("Task Form", () => {
  it("populates the form from selectedTask", async () => {
    renderComponent(selectedTask);

    const select = screen.getByRole("combobox");

    expect(screen.getByDisplayValue("Test title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
    expect(select).toHaveValue("6a3521abb585df96518271a7");
    expect(screen.getByRole("textbox", { name: "Due Date" })).toHaveValue(
      "08/01/2026",
    );
  });

  it("leaves the due date blank when the provided date is invalid", async () => {
    renderComponent({
      ...selectedTask,
      dueDate: "This is not a date",
    });

    expect(screen.getByRole("textbox", { name: /due date/i })).toHaveValue("");
  });

  it("submits changed fields only", async () => {
    renderComponent(selectedTask);

    const titleBox = screen.getByLabelText(/task title/i);
    const saveButton = screen.getByText("Save Changes");

    await userEvent.clear(titleBox);
    await userEvent.type(titleBox, "New title");
    await userEvent.click(saveButton);

    expect(onUpdateTask).toHaveBeenCalledWith(selectedTask._id, {
      title: "New title",
    });
  });

  it("submits nothing when no fields changed", async () => {
    renderComponent(selectedTask);

    const saveButton = screen.getByText("Save Changes");

    await userEvent.click(saveButton);

    expect(onUpdateTask).toHaveBeenCalledWith(selectedTask._id, {});
  });

  it("opens the delete modal", async () => {
    renderComponent(selectedTask);

    const openDeleteModalButton = screen.getByText("Delete Task");

    await userEvent.click(openDeleteModalButton);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("deletes the selected task via the delete modal", async () => {
    renderComponent(selectedTask);

    const openDeleteModalButton = screen.getByText("Delete Task");

    await userEvent.click(openDeleteModalButton);

    const deleteTaskButton = screen.getByText("Delete");

    await userEvent.click(deleteTaskButton);

    expect(closeTask).toHaveBeenCalledTimes(1);
    expect(onDeleteTask).toHaveBeenCalledWith(selectedTask._id);
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("closes the delete modal without deleting task", async () => {
    renderComponent(selectedTask);

    const openDeleteModalButton = screen.getByText("Delete Task");

    await userEvent.click(openDeleteModalButton);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");

    await userEvent.click(cancelButton);

    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });
});

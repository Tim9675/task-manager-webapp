import {
  requireString,
  optionalString,
  isValidObjectId,
  isValidISODate,
  requireArray,
  requireBoolean,
} from "./helpers/validationHelpers.js";

import List from "../models/List.js";
import Tag from "../models/Tag.js";

export function validateCreateTask(req, res, next) {
  const { title, description, dueDate, listId, tagIds, subtasks, checked } =
    req.body;

  const titleError = requireString(title, "Title");
  if (titleError) {
    return res.status(400).json({ message: titleError });
  }

  const descriptionError = optionalString(description, "Description");
  if (descriptionError) {
    return res.status(400).json({ message: descriptionError });
  }

  if (dueDate != null) {
    const dueDateError = isValidISODate(dueDate, "Due date");
    if (dueDateError) {
      return res.status(400).json({ message: dueDateError });
    }
  }

  if (listId != null) {
    const listIdError = isValidObjectId(listId, "List ID");
    if (listIdError) {
      return res.status(400).json({ message: listIdError });
    }
  }

  const tagIdsError = requireArray(tagIds, "Tag IDs");
  if (tagIdsError) {
    return res.status(400).json({ message: tagIdsError });
  }

  for (const tagId of tagIds) {
    const tagIdError = isValidObjectId(tagId, "Tag ID");
    if (tagIdError) {
      return res.status(400).json({ message: tagIdError });
    }
  }

  const subtasksError = requireArray(subtasks, "Subtasks");
  if (subtasksError) {
    return res.status(400).json({ message: subtasksError });
  }

  for (const subtask of subtasks) {
    if (!subtask || typeof subtask !== "object" || Array.isArray(subtask)) {
      return res
        .status(400)
        .json({ message: "Each subtask must be an object" });
    }

    const subtaskTitleError = requireString(subtask.title, "Subtask title");
    if (subtaskTitleError) {
      return res.status(400).json({ message: subtaskTitleError });
    }

    const subtaskCheckedError = requireBoolean(
      subtask.checked,
      "Subtask checked",
    );
    if (subtaskCheckedError) {
      return res.status(400).json({ message: subtaskCheckedError });
    }
  }

  const checkedError = requireBoolean(checked, "Checked");
  if (checkedError) {
    return res.status(400).json({ message: checkedError });
  }

  next();
}

export function validateUpdateTask(req, res, next) {
  const { title, description, dueDate, listId, tagIds, subtasks, checked } =
    req.body;

  if (title !== undefined) {
    const titleError = requireString(title, "Title");
    if (titleError) {
      return res.status(400).json({ message: titleError });
    }
  }

  if (description !== undefined) {
    const descriptionError = optionalString(description, "Description");
    if (descriptionError) {
      return res.status(400).json({ message: descriptionError });
    }
  }

  // Always send ISO 8601 with timezone
  // (e.g. "2026-05-06T23:59:59.999+08:00" or "2026-05-06T15:59:59.999Z")
  // ^^^ SAME WITH updateTask ^^^

  if (dueDate !== undefined) {
    const dueDateError = isValidISODate(dueDate, "Due date");
    if (dueDateError) {
      return res.status(400).json({ message: dueDateError });
    }
  }

  if (listId !== undefined) {
    const listIdError = isValidObjectId(listId, "List ID");
    if (listIdError) {
      return res.status(400).json({ message: listIdError });
    }
  }

  if (tagIds !== undefined) {
    const tagIdsError = requireArray(tagIds, "Tag IDs");
    if (tagIdsError) {
      return res.status(400).json({ message: tagIdsError });
    }

    for (const tagId of tagIds) {
      const tagIdError = isValidObjectId(tagId, "Tag ID");
      if (tagIdError) {
        return res.status(400).json({ message: tagIdError });
      }
    }
  }

  if (subtasks !== undefined) {
    const subtasksError = requireArray(subtasks, "Subtasks");
    if (subtasksError) {
      return res.status(400).json({ message: subtasksError });
    }

    for (const subtask of subtasks) {
      if (!subtask || typeof subtask !== "object" || Array.isArray(subtask)) {
        return res
          .status(400)
          .json({ message: "Each subtask must be an object" });
      }

      const subtaskTitleError = requireString(subtask.title, "Subtask title");
      if (subtaskTitleError) {
        return res.status(400).json({ message: subtaskTitleError });
      }

      const subtaskCheckedError = requireBoolean(
        subtask.checked,
        "Subtask checked",
      );
      if (subtaskCheckedError) {
        return res.status(400).json({ message: subtaskCheckedError });
      }
    }
  }

  if (checked !== undefined) {
    const checkedError = requireBoolean(checked, "Checked");
    if (checkedError) {
      return res.status(400).json({ message: checkedError });
    }
  }

  next();
}

export async function validateTaskReferences(req, res, next) {
  const userId = req.user.userId;
  const { listId, tagIds } = req.body;

  // Prevents users from creating their tasks inside other users' lists; also catches ""

  if (listId !== undefined && listId !== null && listId !== "") {
    const listExists = await List.exists({
      _id: listId,
      userId,
    });

    if (!listExists) {
      return res.status(404).json({
        message: "List not found",
      });
    }
  }

  if (Array.isArray(tagIds) && tagIds.length > 0) {
    const uniqueTagIds = [...new Set(tagIds)];

    const existingTagsCount = await Tag.countDocuments({
      userId,
      _id: { $in: uniqueTagIds },
    });

    if (existingTagsCount !== uniqueTagIds.length) {
      return res.status(404).json({
        message: "One or more tags not found",
      });
    }
  }

  next();
}

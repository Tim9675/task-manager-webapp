import { useState } from "react";

import { createList, deleteList, updateList } from "../../api/listApi.js";
import { normalizeTitle } from "../helpers/normalizeTitle.js";
import {
  showActionSuccess,
  showApiError,
  showWarning,
} from "../helpers/showApiResponse.js";

function useListCrud({ userLists, setUserLists, removeListFromTasks }) {
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isUpdatingList, setIsUpdatingList] = useState(false);
  const [isDeletingList, setIsDeletingList] = useState(false);

  // CRUD functions
  async function onCreateList(title, color) {
    // Don't need to check for empty string title since button is disabled if listTitle state is empty
    const normalizedTitle = normalizeTitle(title);
    const duplicate = userLists.some(
      (list) => normalizeTitle(list.title) === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsCreatingList(true);
      const res = await createList(title, color);
      setUserLists((prev) => [...prev, res]);
      showActionSuccess("List", "created");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when creating list");
      return {
        success: false,
        error: "Server error in onCreateList",
      };
    } finally {
      setIsCreatingList(false);
    }
  }

  async function onUpdateList(listId, patchBody) {
    // Same reasoning as onCreateList for empty title
    if (!Object.keys(patchBody).length) {
      showWarning("No fields to update!");
      return { success: false };
    }

    if (patchBody.title !== undefined) {
      const normalizedTitle = normalizeTitle(patchBody.title);
      const duplicate = userLists.some(
        (list) =>
          list._id !== patchBody._id &&
          normalizeTitle(list.title) === normalizedTitle,
      );
      if (duplicate) return { success: false, error: "duplicate" };
    }

    try {
      setIsUpdatingList(true);
      const res = await updateList(listId, patchBody);
      setUserLists((prev) =>
        prev.map((list) => (list._id === res._id ? res : list)),
      );
      showActionSuccess("List", "updated");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when updating list");
      return {
        success: false,
        error: "Server error in onUpdateList",
      };
    } finally {
      setIsUpdatingList(false);
    }
  }

  async function onDeleteList(listId) {
    try {
      setIsDeletingList(true);
      await deleteList(listId);
      setUserLists((prev) => prev.filter((list) => list._id !== listId));
      removeListFromTasks(listId);
      showActionSuccess("List", "deleted");
    } catch (error) {
      showApiError(error, "Error when deleting list");
    } finally {
      setIsDeletingList(false);
    }
  }

  return {
    onCreateList,
    onUpdateList,
    onDeleteList,
    isCreatingList,
    isUpdatingList,
    isDeletingList,
  };
}

export default useListCrud;

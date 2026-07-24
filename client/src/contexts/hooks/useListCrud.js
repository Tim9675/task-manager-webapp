import { useState } from "react";

import { createList, updateList, deleteList } from "../../api/listApi.js";
import { showActionSuccess, showApiError } from "../helpers/showApiResponse.js";
import { isDuplicateTitle } from "../helpers/isDuplicateTitle.js";
import { isEmptyUpdateBody } from "../helpers/isEmptyUpdateBody.js";

function useListCrud({ userLists, setUserLists, removeListFromTasks }) {
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isUpdatingList, setIsUpdatingList] = useState(false);
  const [isDeletingList, setIsDeletingList] = useState(false);

  async function onCreateList(title, color) {
    const duplicate = isDuplicateTitle(userLists, title);
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
    if (isEmptyUpdateBody(patchBody)) return { success: false };

    if (patchBody.title !== undefined) {
      const duplicate = isDuplicateTitle(userLists, patchBody.title, listId);
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

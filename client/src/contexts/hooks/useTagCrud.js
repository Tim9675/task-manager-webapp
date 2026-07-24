import { useState } from "react";

import { createTag, updateTag, deleteTag } from "../../api/tagApi";
import { normalizeTitle } from "../helpers/normalizeTitle";
import { showApiError, showActionSuccess } from "../helpers/showApiResponse";
import { isEmptyUpdateBody } from "../helpers/isEmptyUpdateBody";
import { isDuplicateTitle } from "../helpers/isDuplicateTitle";

function useTagCrud({ userTags, setUserTags, removeTagFromTasks }) {
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isUpdatingTag, setIsUpdatingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);

  async function onCreateTag(title, color) {
    const duplicate = isDuplicateTitle(userTags, title);
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsCreatingTag(true);
      const res = await createTag(title, color);
      setUserTags((prev) => [...prev, res]);
      showActionSuccess("Tag", "created");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when creating tag");
      return { success: false, error: "Server error in onCreateTag" };
    } finally {
      setIsCreatingTag(false);
    }
  }

  async function onUpdateTag(tagId, patchBody) {
    if (isEmptyUpdateBody(patchBody)) return { success: false };

    if (patchBody.title !== undefined) {
      const duplicate = isDuplicateTitle(userTags, patchBody.title, tagId);
      if (duplicate) return { success: false, error: "duplicate" };
    }

    try {
      setIsUpdatingTag(true);
      const res = await updateTag(tagId, patchBody);
      setUserTags((prev) =>
        prev.map((tag) => (tag._id === res._id ? res : tag)),
      );
      showActionSuccess("Tag", "updated");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when updating tag");
      return { success: false, error: "Server error in onUpdateTag" };
    } finally {
      setIsUpdatingTag(false);
    }
  }

  async function onDeleteTag(tagId) {
    try {
      setIsDeletingTag(true);
      await deleteTag(tagId);
      setUserTags((prev) => prev.filter((tag) => tag._id !== tagId));
      removeTagFromTasks(tagId);
      showActionSuccess("Tag", "deleted");
    } catch (error) {
      showApiError(error, "Error when deleting tag");
    } finally {
      setIsDeletingTag(false);
    }
  }

  return {
    onCreateTag,
    onUpdateTag,
    onDeleteTag,
    isCreatingTag,
    isUpdatingTag,
    isDeletingTag,
  };
}

export default useTagCrud;

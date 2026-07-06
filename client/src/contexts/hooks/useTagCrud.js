import { useState } from "react";

import { createTag, updateTag, deleteTag } from "../../api/tagApi";
import { normalizeTitle } from "../helpers/normalizeTitle";
import { showApiError, showActionSuccess } from "../helpers/showApiResponse";

function useTagCrud({ userTags, setUserTags, removeTagFromTasks }) {
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isUpdatingTag, setIsUpdatingTag] = useState(false);
  const [isDeletingTag, setisDeletingTag] = useState(false);

  // CRUD functions
  async function onCreateTag(title, color) {
    const normalizedTitle = normalizeTitle(title);
    const duplicate = userTags.some(
      (tag) => normalizeTitle(tag.title) === normalizedTitle,
    );
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

  async function onUpdateTag(updatedTag) {
    const normalizedTitle = normalizeTitle(updatedTag.title);
    const duplicate = userTags.some(
      (tag) =>
        tag._id !== updatedTag._id &&
        normalizeTitle(tag.title) === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsUpdatingTag(true);
      const res = await updateTag(updatedTag);
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
      setisDeletingTag(true);
      await deleteTag(tagId);
      setUserTags((prev) => prev.filter((tag) => tag._id !== tagId));
      removeTagFromTasks(tagId);
      showActionSuccess("Tag", "deleted");
    } catch (error) {
      showApiError(error, "Error when deleting tag");
    } finally {
      setisDeletingTag(false);
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

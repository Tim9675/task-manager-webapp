import { useMemo, useCallback } from "react";

function useTagDerivedData({ userTags, userTasks }) {
  const userTagsMap = useMemo(
    () => Object.fromEntries(userTags.map((tag) => [tag._id, tag])),
    [userTags],
  );

  const getCachedTasksByTag = useCallback(
    (tagId) => userTasks.filter((task) => task.tagIds.includes(tagId)),
    [userTasks],
  );

  function getTagTitle(id) {
    return userTagsMap[id]?.title;
  }

  function getTagById(id) {
    return userTagsMap[id];
  }

  return {
    getCachedTasksByTag,
    getTagTitle,
    getTagById,
  };
}

export default useTagDerivedData;

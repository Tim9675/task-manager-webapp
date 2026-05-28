import { useState } from "react";

import SidebarItem from "../sidebar/SidebarItem";
import AddTaskTags from "./AddTaskTags";
import TagSelectModal from "./TagSelectModal";

function TagSection({ availableTags, watch, setValue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedTagIds = watch("tagIds") || [];
  const selectedTags = availableTags.filter((tag) =>
    selectedTagIds.includes(tag.id),
  );

  function toggleTag(tagId) {
    if (selectedTagIds.includes(tagId)) {
      setValue(
        "tagIds",
        selectedTagIds.filter((id) => id !== tagId),
      );
    } else {
      setValue("tagIds", [...selectedTagIds, tagId]);
    }
  }

  return (
    <div className="flex h-20 w-full items-start justify-between">
      <label className="my-2 text-sm">Tags</label>
      <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto rounded-md border border-[#ebebeb] md:w-65">
        {selectedTags.map((tag) => (
          <SidebarItem key={tag.id} nav={tag} type={"tags"} />
        ))}
        <AddTaskTags onOpen={() => setIsModalOpen(true)} />
        {isModalOpen && (
          <TagSelectModal
            availableTags={availableTags}
            selectedTagIds={selectedTagIds}
            toggleTag={toggleTag}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default TagSection;

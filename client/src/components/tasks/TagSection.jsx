import { useState } from "react";

import { useTags } from "../../contexts/TagsContext";
import TagCard from "./TagCard";
import OpenTagSelectorButton from "./OpenTagSelectorButton";
import TagSelectorModal from "../modals/TagSelectorModal";

function TagSection({ watch, setValue, returnFocusRef }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftTagIds, setDraftTagIds] = useState([]);

  const { userTags } = useTags();

  const committedTagIds = watch("tagIds") || [];
  const committedTags = userTags.filter((tag) =>
    committedTagIds.includes(tag._id),
  );

  function toggleTag(tagId) {
    setDraftTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }

  return (
    <fieldset className="flex h-20 w-full items-start justify-between">
      <legend className="float-left my-2 text-sm">Tags</legend>
      <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto rounded-md border border-[#ebebeb] px-2.5 md:w-65">
        {committedTags.map((tag) => (
          <TagCard key={tag._id} title={tag.title} color={tag.color} />
        ))}

        <OpenTagSelectorButton
          onOpen={() => {
            setDraftTagIds(committedTagIds);
            setIsModalOpen(true);
            returnFocusRef.current = document.activeElement;
          }}
        />

        {isModalOpen && (
          <TagSelectorModal
            userTags={userTags}
            draftTagIds={draftTagIds}
            toggleTag={toggleTag}
            setValue={setValue}
            onClose={() => setIsModalOpen(false)}
            returnFocusRef={returnFocusRef}
          />
        )}
      </div>
    </fieldset>
  );
}

export default TagSection;

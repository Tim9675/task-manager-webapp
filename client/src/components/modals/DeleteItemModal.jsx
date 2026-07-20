import Modal from "./Modal";

function DeleteItemModal({
  itemType,
  title,
  onDelete,
  isDeleting,
  onClose,
  descriptionId,
  returnFocusRef,
  children,
}) {
  return (
    <Modal
      header="Warning!"
      onAction={onDelete}
      onClose={onClose}
      isLoading={isDeleting}
      action={isDeleting ? "Deleting..." : "Delete"}
      descriptionId={descriptionId}
      returnFocusRef={returnFocusRef}
    >
      <p
        role="alert"
        id={descriptionId}
        className="my-5 text-center wrap-anywhere"
      >
        Delete the {itemType} "{title}"?
      </p>
      {children}
    </Modal>
  );
}

export default DeleteItemModal;

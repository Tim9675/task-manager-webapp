import { createPortal } from "react-dom";
import { useRef } from "react";

function Modal({
  header,
  onAction,
  onClose,
  isLoading,
  isEmpty = false,
  action,
  returnFocusRef,
  descriptionId,
  children,
}) {
  const modalRef = useRef(null);

  function closeModal() {
    onClose();

    requestAnimationFrame(() => {
      const element = returnFocusRef?.current;

      if (element && document.contains(element)) {
        element.focus();
      }
    });
  }

  function handleKeyDown(e) {
    const focusable = Array.from(
      modalRef.current.querySelectorAll(
        `
      button:not([disabled]),
      input:not([disabled]),
      textarea:not([disabled]),
      select:not([disabled])
      `,
      ),
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === "Escape") {
      closeModal();
      return;
    }

    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return createPortal(
    <div
      onClick={closeModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={descriptionId}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="w-72 rounded-xl bg-white p-4 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-neutral-800"
          >
            {header}
          </h2>

          <button
            type="button"
            onClick={closeModal}
            className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {children}

        <div className="mt-4 flex justify-evenly">
          <button
            type="button"
            disabled={isLoading}
            onClick={closeModal}
            autoFocus
            className="cursor-pointer rounded-md bg-[#f5f5f5] px-4 py-2 text-sm font-medium hover:brightness-95 disabled:cursor-not-allowed disabled:hover:brightness-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading || isEmpty}
            onClick={async () => {
              await onAction();
            }}
            className="cursor-pointer rounded-md bg-[#ffd43b] px-4 py-2 text-sm font-medium hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#bbbbbb] disabled:hover:brightness-100"
          >
            {action}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;

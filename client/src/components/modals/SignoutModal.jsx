import { useAuth } from "../../contexts/AuthContext";
import Modal from "../modals/Modal";

function SignoutModal({ onSignOutClose, returnFocusRef }) {
  const { signOut } = useAuth();

  return (
    <Modal
      header="Sign out"
      onAction={signOut}
      onClose={onSignOutClose}
      isLoading={false}
      action="Sign out"
      descriptionId="signout-description"
      returnFocusRef={returnFocusRef}
    >
      <p role="alert" id="signout-description" className="my-5 text-center">
        You're about to be signed out.
      </p>
    </Modal>
  );
}

export default SignoutModal;

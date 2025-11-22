import React, { useState } from 'react';
import Modal from './Modal';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail: string;
  isLoading?: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userEmail: _userEmail,
  isLoading = false,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmationText(value);
    setIsConfirmed(value === 'DELETE');
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    setIsConfirmed(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Account" className="delete-account-modal">
      <div className="delete-account-content">
        <div className="warning-section">
          <div className="warning-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h4>This action cannot be undone</h4>
          <p>
            This will permanently delete your account and remove all of your data from our servers. 
            You will be automatically logged out and redirected to the login page. This includes:
          </p>
          <ul>
            <li>Your profile information</li>
            <li>All your activity logs</li>
            <li>Your goals and progress</li>
            <li>Your reminders and notifications</li>
            <li>Your chat history</li>
          </ul>
        </div>

        <div className="confirmation-section">
          <p>
            To confirm, type <strong>DELETE</strong> in the box below:
          </p>
          <input
            type="text"
            value={confirmationText}
            onChange={handleConfirmationChange}
            placeholder="Type DELETE to confirm"
            className="confirmation-input"
            disabled={isLoading}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={handleClose}
            className="cancel-button"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="delete-button"
            disabled={!isConfirmed || isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;

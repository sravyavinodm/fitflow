import React from 'react';
import './DeleteConfirmModal.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item?',
  subtitle = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDeleting = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="delete-modal-overlay" onClick={handleOverlayClick}>
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h3>{title}</h3>
        </div>
        <div className="delete-modal-content">
          <div className="warning-icon">⚠️</div>
          <p className="delete-warning">{message}</p>
          <p className="delete-subtitle">{subtitle}</p>
        </div>
        <div className="delete-modal-actions">
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            {cancelText}
          </button>
          <button
            className="confirm-delete-button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

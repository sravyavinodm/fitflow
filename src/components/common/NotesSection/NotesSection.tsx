import React, { useState } from 'react';
import './NotesSection.css';

interface NotesSectionProps {
  notes: string;
  editable?: boolean;
  onSave?: (notes: string) => Promise<void>;
  placeholder?: string;
  title?: string;
  className?: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  editable = false,
  onSave,
  placeholder = 'Add notes...',
  title = 'Notes',
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    setEditedNotes(notes);
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!onSave) return;

    setSaving(true);
    setError(null);

    try {
      await onSave(editedNotes);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`notes-section ${className}`}>
      <div className="notes-header">
        <h3 className="notes-title">{title}</h3>
        {editable && !isEditing && (
          <button className="edit-button" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="notes-edit">
          <textarea
            value={editedNotes}
            onChange={e => setEditedNotes(e.target.value)}
            placeholder={placeholder}
            className="notes-textarea"
            rows={4}
          />
          {error && <div className="error-message">{error}</div>}
          <div className="notes-actions">
            <button
              className="cancel-button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="notes-display">
          {notes ? (
            <p className="notes-text">{notes}</p>
          ) : (
            <p className="notes-placeholder">{placeholder}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesSection;


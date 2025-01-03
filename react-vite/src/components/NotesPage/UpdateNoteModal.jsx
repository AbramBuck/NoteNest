
import './DeleteConfirmationModal.css';

const UpdateConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to update this note?</h2>
        <div className="bottommodal">
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-del-notebtn">Yes, Update</button>
          <button onClick={onCancel} className="cancel-de-note-btn">Cancel</button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateConfirmationModal;
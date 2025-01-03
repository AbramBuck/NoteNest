


const DeleteConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to delete this task?</h2>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-del-notebtn">Yes, Delete</button>
          <button onClick={onCancel} className="cancel-de-note-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

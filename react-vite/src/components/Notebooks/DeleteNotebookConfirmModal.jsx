import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import "./EditNotebookModal.css";
import { deleteANotebook } from '../../redux/notebooks';

function DeleteNotebookConfirmModal({ notebookId }) {
const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = (notebookId) => {
    try {
      dispatch(deleteANotebook(notebookId));
      closeModal();
    } catch (error) {

      throw new Error("Error when trying to delete a Notebook.");
    }
  };

  return (
    
    <div className='modal-content'>
      <h1>Confirm Delete</h1>
      <h2 className='subhead'>Are you sure you want to remove this Notebook from your library?</h2>
      <div className='modal-buttons'>
        <button type="submit" onClick={() => closeModal()}>{"No (Keep Notebook)"}</button>
        <button className='del-btn' type='button' onClick={() => handleDelete(notebookId)}>{"Yes (Delete Notebook)"}</button>
      </div>
    </div>
    
  );
}

export default DeleteNotebookConfirmModal;
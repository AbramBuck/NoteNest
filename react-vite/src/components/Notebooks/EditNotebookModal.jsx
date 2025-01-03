import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { updateNotebook, getAllNotebooks } from "../../redux/notebooks";
import "./EditNotebookModal.css";



function EditNotebookModal({ notebook }) {
    const dispatch = useDispatch();
    const [name, setName] = useState("")
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();


    useEffect(() => {
      if (notebook) {
        setName(notebook.name);
      }
    }, [notebook]);
  

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const notebookData = {
        id: notebook.id,
        name,
      };
      
      try {
        await dispatch(updateNotebook(notebook.id, notebookData));
        dispatch(getAllNotebooks()); 
        closeModal();
      } catch (error) {
  
        console.error("Error:", error);
        setErrors({ general: "An unexpected error occurred." });
      }
    };
  
    return (
      <>
      <div className='modal-content'>
        <h1>Edit Your Notebook</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="title" className="form-title">
                Notebook Name:
            </label>
            {errors.name && <p>{errors.name}</p>}
            <input
                type="text"
                id="title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            </div>
            <div className="modal-buttons">
              <button type="submit" onClick={handleSubmit}>Update Notebook</button>
              <button type="submit" onClick={() => closeModal()}>Cancel</button>
            </div>

        </form>

      </div>
      </>
    );
  }
  
  export default EditNotebookModal;
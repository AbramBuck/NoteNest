import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { getAllNotebooks } from "../../redux/notebooks";
import Sidebar from "../Sidebar/Sidebar";
import OpenModalButton from "./OpenModalButton";
import DeleteNotebookConfirmModal from "./DeleteNotebookConfirmModal";
import EditNotebookModal from "./EditNotebookModal";
import { FaBook } from "react-icons/fa";
import "./ManageNotebooksStyles.css";
import { thunkFetchNotes } from "../../redux/notes";


function ManageNotebooks() {
  const dispatch = useDispatch();
  // const user = useSelector((store) => store.session.user);
  const notebooks = useSelector((state) => state.notebooks.notebooks);
  const notes = useSelector((state) => state.notes.notes);
  
  console.log("Notes:///////",notes)

  const notesInNotebook = notes.reduce((acc, note) => {
    const id = note.notebook_id;
    acc[id] = (acc[id] || 0) + 1; 
    return acc;
  }, {});

  console.log("NotesInNotebook:///////",notesInNotebook)
  
  const alertDelete = () =>{
    alert('You Cannot Delete a Notebook that has Notes')
  }

  useEffect(() => { 
    dispatch(getAllNotebooks());
    dispatch(thunkFetchNotes());
}, [dispatch], notebooks, notes);

  
  return (
    <div className="page-wrapper">
      <Sidebar />
      {/* NavBar End */}
      <div className="note-books-area">
            <h1 className="manage-notebook-header">NOTEBOOKS</h1>
            <div className="notebooks-page-populated-area">
              {notebooks.map((notebook) => (
                <div className="notebook-instance" key={notebook.id}>
                  <h3>{notebook.name}</h3>
                  <Link to={`/notebooks/${notebook.id}`}>
                    <h1 className="notebook-icon"><FaBook /></h1>
                  </Link>
                  <div className="manage-notebook-title">
                    
                    <h3>Notes:{ notesInNotebook[notebook.id] ? notesInNotebook[notebook.id] : 0 } </h3>
                  </div>
                  <div className="edit-delete-btn-area">
                    <OpenModalButton buttonText="Edit"  modalComponent={<EditNotebookModal notebook={notebook}/>}/>
                    {notesInNotebook[notebook.id] ? <button onClick={alertDelete}>Delete</button> : <OpenModalButton buttonText="Delete"  modalComponent={<DeleteNotebookConfirmModal notebookId={notebook.id}/>}/>}
                    
                    
                  </div>                
                </div>
              ))}
              </div>
      </div>
    </div>

)
}
export default ManageNotebooks;

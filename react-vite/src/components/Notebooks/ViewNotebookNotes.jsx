import './ViewNotebookNotesPage.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkFetchNotes, thunkDeleteNote } from '../../redux/notes';
import { getAllNotebooks } from '../../redux/notebooks';
import Sidebar from '../Sidebar/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteConfirmationModal from '../NotesPage/DeleteNote';

function NotesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const notes = useSelector((state) => state.notes.notes);
  const notebooks = useSelector((state) => state.notebooks.notebooks);
  const { notebookId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const thisNotebook = notebooks.find((notebook) => notebook.id == notebookId);
  const theseNotes = notes.filter((note) => note.notebook_id == notebookId);
  //theseNotes.length;

  useEffect(() => {
    dispatch(thunkFetchNotes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllNotebooks());
  }, [dispatch]);

  const handleEdit = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  const handleDelete = (noteId) => {
    setNoteToDelete(noteId);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      dispatch(thunkDeleteNote(noteToDelete)); 
      setShowModal(false);  
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);  
  };


  return (
    <div className="page-wrapper">
      <Sidebar />

      <div className="right">
        <div><h1>Notebook:{ thisNotebook.name ? `  ${thisNotebook.name}`: "Notebook Not Found"} </h1></div>
        <div className="notes-grid">
          { theseNotes.length == 0 ? <h2>Add notes to your {thisNotebook.name} Notebook to see them here.</h2> : theseNotes.map((note) => (
            <div className="note-card" key={note.id}>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <p>Created on: {note.created_at}</p>
              <p>Tags: {note.tags.join(', ')}</p>

              <div className="note-buttons">
                <button onClick={() => handleEdit(note.id)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(note.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <DeleteConfirmationModal 
        show={showModal} 
        onConfirm={handleConfirmDelete} 
        onCancel={handleCancelDelete} 
      />
    </div>
  );
}

export default NotesPage;

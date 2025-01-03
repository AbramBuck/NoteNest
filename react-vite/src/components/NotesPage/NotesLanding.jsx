import './NotesPage.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkFetchNotes, thunkDeleteNote } from '../../redux/notes';
import Sidebar from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteNote';
//import { fetchAllTags } from '../../redux/tags';
//import { fetchTagsForNoteThunk } from '../../redux/tags';

function NotesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const notes = useSelector((state) => state.notes.notes);


  const [showModal, setShowModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    dispatch(thunkFetchNotes());
    //dispatch(fetchTagsForNoteThunk());
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
        <div><h1>Notes</h1></div>
        <div className="notes-grid">
          {notes.slice(0, 6).map((note) => (
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

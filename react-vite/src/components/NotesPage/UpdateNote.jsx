import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { thunkFetchNotes, thunkUpdateNote } from '../../redux/notes';
import Sidebar from '../Sidebar/Sidebar';
import './UpdateNote.css';
import UpdateConfirmationModal from './UpdateNoteModal'; 

const UpdateNote = () => {
  const { noteId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [note, setNote] = useState({ title: '', content: '', tags: [] });
  const [existingTags, setExistingTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${noteId}`);
        if (response.ok) {
          const data = await response.json();
          setNote(data);
        } else {
          setError('Failed to fetch note data');
        }
      } catch (error) {
        setError('Error fetching note');
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          const data = await response.json();
          setExistingTags(data);
        } else {
          setError('Failed to fetch tags');
        }
      } catch (error) {
        setError('Error fetching tags');
      }
    };

    fetchNote();
    fetchTags();
  }, [noteId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowModal(true);
  };

  const handleConfirmUpdate = async () => {
    const updatedNote = {
      title: note.title,
      content: note.content,
      tags: note.tags
    };

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote)
      });

      if (response.ok) {
        const updatedData = await response.json();
        dispatch(thunkUpdateNote(noteId, updatedData));
        dispatch(thunkFetchNotes());
        setShowModal(false);
        navigate(`/notes/`);
      } else {
        const result = await response.json();
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Error updating note');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate('/notes');
  };

  const handleNewTagInputChange = (e) => {
    setNewTagInput(e.target.value);
  };

  const handleAddNewTag = () => {
    if (newTagInput && !note.tags.includes(newTagInput.trim())) {
      setNote({ ...note, tags: [...note.tags, newTagInput.trim()] });
      setNewTagInput('');
    }
  };

  const handleTagSelect = (e) => {
    const selectedTag = e.target.value;
    if (selectedTag && !note.tags.includes(selectedTag)) {
      setNote({ ...note, tags: [...note.tags, selectedTag] });
    }
  };

  // const handleCloseModal = () => {
  //   setShowModal(false); 
  // };

  return (
    <div className="Update-Wrapper">
      <Sidebar />

      <div className="update-note-container">
        <h1>Edit Note</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="existing-tags">Existing Tags:</label>
            <select id="existing-tags" value="" onChange={handleTagSelect}>
              <option value="">-- Select a Tag --</option>
              {existingTags.map((tag) => (
                <option key={tag.id} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags for This Note:</label>
            <div className="existing-tags">
              {note.tags.length > 0 ? (
                note.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    <p>{tag}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setNote({ ...note, tags: note.tags.filter((t) => t !== tag) });
                      }}
                      className="remove-tag-btn"
                    >
                      X
                    </button>
                  </span>
                ))
              ) : (
                <p>No tags associated with this note yet.</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new-tags">New Tag:</label>
            <div className="tagsedit">
            <input
              type="text"
              id="new-tags"
              value={newTagInput}
              onChange={handleNewTagInputChange}
              placeholder="Enter new tag"
            />
            <p></p>
            <button type="button" onClick={handleAddNewTag} className="add-new-tag-btn">
              Add New Tag
            </button>
          </div>
          </div>

          <div className="updatenotebtn">
            <button className="updateSubmit" type="submit">
              Update Note
            </button>
            <button className="updateCancel" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>


      <UpdateConfirmationModal
        show={showModal}
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default UpdateNote;

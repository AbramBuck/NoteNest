import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllTags,
  createTagThunk,
  deleteTagThunk,
  assignTagToNoteThunk,
  removeTagFromNoteThunk,
  //fetchTagsForNoteThunk,
  //setTagsForNote, 
} from '../../redux/tags';
import { thunkFetchNotes } from '../../redux/notes';
import { Plus, Trash2 } from 'lucide-react';
import '../Tags/Tags.css';
import Sidebar from '../Sidebar/Sidebar'; 

const Tags = ({ noteId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.session.user);
  const allTags = useSelector(state => state.tags.tags);
  const tagsForNote = useSelector(state => state.tags.tagsForNote[noteId] || []);
  const allNotes = useSelector(state => state.notes.notes);
  const [newTagName, setNewTagName] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  //const [tagSelectedNote,setTagSelectedNote] = useState(null)

  const isAuthenticated = !!user;

  // console.log("user: ", user);
  // console.log("All Tags: ", allTags,"//////////////////////");
  // console.log("All Tags For Note: ", tagsForNote,"//////////////////////");
  // console.log("All Notes: ", allNotes,"//////////////////////");


  useEffect(() => {
    const loadTagsAndNotes = async () => {
      if (isAuthenticated) {
        await dispatch(thunkFetchNotes()); // Fetch all notes for dropdown
        await dispatch(fetchAllTags());
        // if (noteId) {
        //   await dispatch(fetchTagsForNoteThunk(noteId));
        // }
      }
      setLoading(false);
    };
    loadTagsAndNotes();
  }, [dispatch, noteId]); 

  

  const handleAddTag = async () => {
    // if (newTagName) {
      const newTag = await dispatch(createTagThunk(newTagName.trim())); // Create the tag
      // if (selectedNoteId || noteId) {
      //   const noteToLink = selectedNoteId || noteId;
      //   console.log("Selected Note ID:",selectedNoteId, "//////////////")
      //   console.log("New Tag:",newTag, "//////////////")
      //   await dispatch(assignTagToNoteThunk(noteToLink, newTag.id)); // Assign it to the note
        // Update the state for the note and refresh tags for the note
        // dispatch(setTagsForNote(noteToLink, [...tagsForNote, { id: newTag.id, name: newTag.name }]));

        //will need selectedNoteID = note_id and newTag.id = tag_id to link the tag to the note
      await dispatch(assignTagToNoteThunk(selectedNoteId, newTag.id));      
      // setNewTagName(''); // Clear input after creation
    // }
  };

  const handleAssignTagToNote = async (noteId, tagId) => {
    // if (noteId) {
      await dispatch(assignTagToNoteThunk(noteId, tagId)); 
      // Update the tags for the note immediately
      // const tag = allTags.find(tag => tag.id === tagId);
      // dispatch(setTagsForNote(noteId, [...tagsForNote, tag])); // Add the tag to the note's tags
    // }
  };

  const handleDeleteTag = async (tagId) => {
    await dispatch(deleteTagThunk(tagId));
    await dispatch(fetchAllTags);
  };

  const handleRemoveTagFromNote = async (tagId) => {
    if (noteId) {
      await dispatch(removeTagFromNoteThunk(noteId, tagId));
    }
  };

  if (loading) {
    return <div>Loading tags...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to manage tags.</div>;
  }

  return (
    <div className="Tags-wrapper">
      <Sidebar />
      <div className="tags-container">
        <h2>Tags</h2>
        <div className="tag-create">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            maxLength={50}
          />
          <select value={selectedNoteId} onChange={(e) => setSelectedNoteId(e.target.value)}>
            <option value="">Select Note to Link</option>
            {allNotes.map(note => (
              <option key={note.id} value={note.id}>{note.title}</option>
            ))}
          </select>
          <button onClick={handleAddTag} className="btn-primary">
            <Plus className="icon-small" /> Add Tag
          </button>
        </div>
        <div className="tags-list">
          {/* {console.log("All Tags in Tags List", allTags)} */}
          {allTags.map((tag) => (
            <div key={tag.id} className="tag-item">
              <span>{tag.name}</span>
              <button onClick={() => handleDeleteTag(tag.id)} className="btn-icon">
                <Trash2 className="icon-small" />
              </button>
              <select value={selectedNoteId} onChange={(e) => setSelectedNoteId(e.target.value)}>
            <option value="">Select Note to Link</option>
            {allNotes.map(note => (
              <option key={note.id} value={note.id}>{note.title}</option>
            ))}
          </select>
              {tagsForNote.includes(tag.id) ? (
                <button onClick={() => handleRemoveTagFromNote(tag.id)} className="btn-secondary">
                  Remove from Note
                </button>
              ) : (
                <button onClick={() => handleAssignTagToNote(selectedNoteId, tag.id)} className="btn-secondary">
                  Assign to Note
              </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;




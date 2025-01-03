
const GET_NOTES = 'notes/getNotes';
const CREATE_NOTE = 'notes/createNote';
const UPDATE_NOTE = 'notes/updateNote';
const DELETE_NOTE = 'notes/deleteNote';


const getNotes = (notes) => ({
  type: GET_NOTES,
  payload: notes,
});
const createNote = (note) => ({
    type: CREATE_NOTE,
    payload: note,
  });
  
  const updateNote = (note) => ({
    type: UPDATE_NOTE,
    payload: note,
  });
  
  const deleteNote = (noteId) => ({
    type: DELETE_NOTE,
    payload: noteId,
  });


export const thunkFetchNotes = () => async (dispatch) => {
    // try {
      const response = await fetch('/api/notes');  
      
      if (response.ok) {
        const data = await response.json();
        // console.log("Fetched Notes:", data);  
        dispatch(getNotes(data));  
      // } else if (response.status < 500) {
      //   const errorMessages = await response.json();
      //   console.error("Error fetching notes:", errorMessages);
      //   return errorMessages;
      } else {
        console.error("Server error:", response.status);
        return { server: "Something went wrong. Please try again" };
      }
    // } catch (error) {
    //   console.error("Fetch error:", error);
    // }
  };


  export const thunkCreateNote = (newNote) => async (dispatch) => {
    // try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });
      
      if (response.ok) {
        const createdNote = await response.json();
        // console.log("Created Note:", createdNote);
        dispatch(createNote(createdNote)); 
      // } else if (response.status < 500) {
      //   const errorMessages = await response.json();
      //   console.error("Error creating note:", errorMessages);
      //   return errorMessages;
      } else {
        console.error("Server error:", response.status);
        return { server: "Something went wrong. Please try again" };
      }
    // } catch (error) {
    //   console.error("Create note error:", error);
    // }
  };
  

  // Update an existing note
  export const thunkUpdateNote = (noteId, updatedNote) => async (dispatch) => {
    // try {
    //   console.log("Updating note with ID:", noteId);
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });
      
      if (response.ok) {
      const updatedNote = await response.json();
      // Dispatch the update to the Redux store with the updated note
      dispatch({
        type: 'UPDATE_NOTE',
        payload: updatedNote,
      });
    } else {
      console.error('Failed to update note');
    }
  // } catch (err) {
  //   console.error('Error updating note:', err);
  // }
};
  

  // Delete a note
  export const thunkDeleteNote = (noteId) => async (dispatch) => {
    // try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log("Deleted Note:", noteId);
        dispatch(deleteNote(noteId)); 
      // } else if (response.status < 500) {
      //   const errorMessages = await response.json();
      //   console.error("Error deleting note:", errorMessages);
      //   return errorMessages;
      } else {
        console.error("Server error:", response.status);
        return { server: "Something went wrong. Please try again" };
      }
    // } catch (error) {
    //   console.error("Delete note error:", error);
    // }
  };


const initialState = {
  notes: [],
};

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTES:
      return {
        ...state,
        notes: action.payload,
      };
      case CREATE_NOTE:
        return {
          ...state,
          notes: [...state.notes, action.payload],
        };
  
      case UPDATE_NOTE:
        return {
          ...state,
          notes: state.notes.map(note =>
            note.id === action.payload.id ? action.payload : note
          ),
        };
  
      case DELETE_NOTE:
        return {
          ...state,
          notes: state.notes.filter(note => note.id !== action.payload),
        };

    default:
      return state;
  }
};

export default notesReducer;
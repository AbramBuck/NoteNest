// Action Types
const SET_TAGS = "tags/SET_TAGS";
const ADD_TAG = "tags/ADD_TAG";
const DELETE_TAG = "tags/DELETE_TAG";
const ASSIGN_TAG_TO_NOTE = "tags/ASSIGN_TAG_TO_NOTE";
const REMOVE_TAG_FROM_NOTE = "tags/REMOVE_TAG_FROM_NOTE";
const SET_TAGS_FOR_NOTE = "tags/SET_TAGS_FOR_NOTE";

// Action Creators
export const setTags = (tags) => ({
  type: SET_TAGS,
  tags,
});

export const addTag = (tag) => ({
  type: ADD_TAG,
  tag,
});

export const deleteTag = (tagId) => ({
  type: DELETE_TAG,
  tagId,
});

export const assignTagToNote = (noteId, tag) => ({
  type: ASSIGN_TAG_TO_NOTE,
  payload: {noteId, tag}
});

export const removeTagFromNote = (noteId, tagId) => ({
  type: REMOVE_TAG_FROM_NOTE,
  noteId,
  tagId,
});

export const setTagsForNote = (noteId, tags) => ({
  type: SET_TAGS_FOR_NOTE,
  noteId,
  tags,
});

// Thunks
export const fetchAllTags = () => async (dispatch) => {
  const response = await fetch("/api/tags");   
  // removed , { credentials: "include" } from response call
  if (response.ok) {
    const data = await response.json();
    dispatch(setTags(data));
  } else {
    console.error("Error fetching tags", response);
  }
};

export const createTagThunk = (name) => async (dispatch) => {
  const csrfToken = document.cookie.split('=')[1];
  const response = await fetch("/api/tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ name }),
    credentials: "include",
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(addTag(data));
    return data; // Return created tag to get ID
    
  } else {
    console.error("Error creating tag", response);
  }
};

export const deleteTagThunk = (tagId) => async (dispatch) => {
  const response = await fetch(`/api/tags/${tagId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (response.ok) {
    dispatch(deleteTag(tagId));
  } else {
    console.error("Error deleting tag");
  }
};

export const assignTagToNoteThunk = (noteId, tagId) => async (dispatch) => {

  const response = await fetch(`/api/notes/${noteId}/tags/${tagId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note_id: noteId, tag_id: tagId }),
    credentials: "include",
  });

  if (response.ok) {
    const data = await response.json();

    const tag = data.tag;
    dispatch(assignTagToNote(noteId, tag))
    return data;
  } else {
    
    const errorData = await response.json();
    throw new Error(errorData.error || "An error occurred while assigning the tag to the note.");
  }
};

//   if (response.ok) {
//     const state = getState(); // Get current state
//     const tag = state.tags.tags.find(tag => tag.id === tagId); // Find full tag by ID
//     dispatch(assignTagToNote(noteId, tag)); // Add the full tag (with name and id) to the note
//   } else {
//     console.error("Error assigning tag to note");
//   }
// };

export const removeTagFromNoteThunk = (noteId, tagId) => async (dispatch) => {
  const response = await fetch("/api/note_tags", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note_id: noteId, tag_id: tagId }),
    credentials: "include",
  });

  if (response.ok) {
    dispatch(removeTagFromNote(noteId, tagId));
  } else {
    console.error("Error removing tag from note");
  }
};

export const fetchTagsForNoteThunk = (noteId) => async (dispatch) => {
  const response = await fetch(`/api/tags/notes/${noteId}/tags`, {
    credentials: "include",
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(setTagsForNote(noteId, data));
  } else {
    console.error("Error fetching tags for note");
  }
};

// Initial State
const initialState = {
  tags: [],
  tagsForNote: {},
};

// Reducer
const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TAGS:
      return {
        ...state,
        tags: action.tags,
      };

    case ADD_TAG:
      return {
        ...state,
        tags: [...state.tags, action.tag],
      };

    case DELETE_TAG:
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.id !== action.tagId),
      };

    case ASSIGN_TAG_TO_NOTE: {
      const { noteId, tag } = action.payload;
      const tagsForNote = state.tagsForNote[noteId] || [];
      return {
        ...state,
        tagsForNote: {
          ...state.tagsForNote,
          [noteId]: [...tagsForNote, tag], // Add full tag to the note
        },
      };
    }

    case REMOVE_TAG_FROM_NOTE: {
      const { noteId, tagId } = action;
      const filteredTags = (state.tagsForNote[noteId] || []).filter((tag) => tag.id !== tagId);
      return {
        ...state,
        tagsForNote: {
          ...state.tagsForNote,
          [noteId]: filteredTags,
        },
      };
    }

    case SET_TAGS_FOR_NOTE:
      return {
        ...state,
        tagsForNote: {
          ...state.tagsForNote,
          [action.noteId]: action.tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
          })),
        },
      };

    default:
      return state;
  }
};

export default tagsReducer;

// // Action Types
// const SET_TAGS = "tags/SET_TAGS";
// const ADD_TAG = "tags/ADD_TAG";
// const DELETE_TAG = "tags/DELETE_TAG";
// //const ASSIGN_TAG_TO_NOTE = "tags/ASSIGN_TAG_TO_NOTE";
// const REMOVE_TAG_FROM_NOTE = "tags/REMOVE_TAG_FROM_NOTE";
// const SET_TAGS_FOR_NOTE = "tags/SET_TAGS_FOR_NOTE";

// // Action Creators
// export const setTags = (tags) => ({
//   type: SET_TAGS,
//   tags,
// });

// export const addTag = (tag) => ({
//   type: ADD_TAG,
//   tag,
// });

// export const deleteTag = (tagId) => ({
//   type: DELETE_TAG,
//   tagId,
// });

// // export const assignTagToNote = (noteId, tagId) => ({
// //   type: ASSIGN_TAG_TO_NOTE,
// //   noteId,
// //   tagId,
// // });
// export const assignTagToNote = (noteId, tag) => ({
//   type: "tags/ASSIGN_TAG_TO_NOTE",
//   noteId,
//   tag,  // Include the full tag object with id and name
// });

// export const removeTagFromNote = (noteId, tagId) => ({
//   type: REMOVE_TAG_FROM_NOTE,
//   noteId,
//   tagId,
// });

// export const setTagsForNote = (noteId, tags) => ({
//   type: SET_TAGS_FOR_NOTE,
//   noteId,
//   tags,
// });

// // Thunks
// // export const fetchAllTags = () => async (dispatch) => {
// //   const response = await fetch("/api/tags", { credentials: "include" });
// //   if (response.ok) {
// //     const data = await response.json();
// //     dispatch(setTags(data));
// //   } else {
// //     console.error("Error fetching tags");
// //   }
// // };
// export const fetchAllTags = () => async (dispatch) => {
//   const response = await fetch("/api/tags", { credentials: "include" });
//   if (response.ok) {
//     const data = await response.json();
//     dispatch(setTags(data)); // Set all tags in Redux state
//   } else {
//     console.error("Error fetching tags", response);
//   }
// };
// export const createTagThunk = (name) => async (dispatch) => {
//   const csrfToken = document.cookie.split('=')[1];
//   const response = await fetch("/api/tags", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "X-CSRFToken": csrfToken,
//     },
//     body: JSON.stringify({ name }),
//     credentials: "include",
//   });
//   if (response.ok) {
//     const data = await response.json();
//     dispatch(addTag(data));
//     return data; // Return created tag to get ID
//   } else {
//     console.error("Error creating tag", response);
//   }
// };

// // export const createTagThunk = (name) => async (dispatch) => {
// //   const csrfToken = document.cookie.split('=')[1];
// //   const response = await fetch("/api/tags", {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //       "X-CSRFToken": csrfToken,
// //     },
// //     body: JSON.stringify({ name }),
// //     credentials: "include",
// //   });
// //   if (response.ok) {
// //     const data = await response.json();
// //     dispatch(addTag(data));
// //   } else {
// //     console.error("Error creating tag", response);
// //   }
// // };
// // export const createTagThunk = (tagName) => async (dispatch) => {
// //   const response = await fetch("/api/tags", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ name: tagName }),
// //     credentials: "include",
// //   });

// //   if (response.ok) {
// //     const newTag = await response.json();
// //     dispatch(addTag(newTag));
// //   } else {
// //     console.error("Error creating tag");
// //   }
// // };

// export const deleteTagThunk = (tagId) => async (dispatch) => {
//   const response = await fetch(`/api/tags/${tagId}`, {
//     method: "DELETE",
//     credentials: "include",
//   });

//   if (response.ok) {
//     dispatch(deleteTag(tagId));
//   } else {
//     console.error("Error deleting tag");
//   }
// };

// // export const assignTagToNoteThunk = (noteId, tagId) => async (dispatch) => {
// //   const response = await fetch("/api/note_tags", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ note_id: noteId, tag_id: tagId }),
// //     credentials: "include",
// //   });

// //   if (response.ok) {
// //     dispatch(assignTagToNote(noteId, tagId));
// //   } else {
// //     console.error("Error assigning tag to note");
// //   }
// // };
// export const assignTagToNoteThunk = (noteId, tagId) => async (dispatch, getState) => {
//   const response = await fetch("/api/note_tags", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ note_id: noteId, tag_id: tagId }),
//     credentials: "include",
//   });

//   if (response.ok) {
//     const state = getState();  // Get current state
//     const tag = state.tags.tags.find(tag => tag.id === tagId);  // Find full tag by ID
//     dispatch(assignTagToNote(noteId, tag));  // Add the full tag (with name and id) to the note
//   } else {
//     console.error("Error assigning tag to note");
//   }
// };


// export const removeTagFromNoteThunk = (noteId, tagId) => async (dispatch) => {
//   const response = await fetch("/api/note_tags", {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ note_id: noteId, tag_id: tagId }),
//     credentials: "include",
//   });

//   if (response.ok) {
//     dispatch(removeTagFromNote(noteId, tagId));
//   } else {
//     console.error("Error removing tag from note");
//   }
// };

// export const fetchTagsForNoteThunk = (noteId) => async (dispatch) => {
//   const response = await fetch(`/api/tags/notes/${noteId}/tags`, {
//     credentials: "include",
//   });
//   if (response.ok) {
//     const data = await response.json();
//     dispatch(setTagsForNote(noteId, data));
//   } else {
//     console.error("Error fetching tags for note");
//   }
// };

// // Initial State
// const initialState = {
//   tags: [],
//   tagsForNote: {},
// };

// // Reducer
// const tagsReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case SET_TAGS:
//       return {
//         ...state,
//         tags: action.tags,
//       };

//     case ADD_TAG:
//       return {
//         ...state,
//         tags: [...state.tags, action.tag],
//       };

//     case DELETE_TAG:
//       return {
//         ...state,
//         tags: state.tags.filter((tag) => tag.id !== action.tagId),
//       };

//     // case ASSIGN_TAG_TO_NOTE: {
//     //   const { noteId, tagId } = action;
//     //   const updatedTagsForNote = state.tagsForNote[noteId]
//     //     ? [...state.tagsForNote[noteId], tagId]
//     //     : [tagId];
//     //   return {
//     //     ...state,
//     //     tagsForNote: {
//     //       ...state.tagsForNote,
//     //       [noteId]: updatedTagsForNote,
//     //     },
//     //   };
//     // }
//         // case "tags/ASSIGN_TAG_TO_NOTE":
//         //   const { noteId, tag } = action;
//         //   const tagsForNote = state.tagsForNote[noteId] || [];
//         //   return {
//         //     ...state,
//         //     tagsForNote: {
//         //       ...state.tagsForNote,
//         //       [noteId]: [...tagsForNote, tag],  // Add full tag to the note
//         //     },
//         //   };

//     case REMOVE_TAG_FROM_NOTE: {
//       const { noteId, tagId } = action;
//       const filteredTags = (state.tagsForNote[noteId] || []).filter((id) => id !== tagId);
//       return {
//         ...state,
//         tagsForNote: {
//           ...state.tagsForNote,
//           [noteId]: filteredTags,
//         },
//       };
//     }

//       case SET_TAGS_FOR_NOTE:
//   return {
//     ...state,
//     tagsForNote: {
//       ...state.tagsForNote,
//       [action.noteId]: action.tags.map((tag) => ({
//         id: tag.id,
//         name: tag.name
//       })),
//     },
//   };

//     default:
//       return state;
//   }
// };

// export default tagsReducer;

export const selectNotebooks = (state) => state.notebooks.notebooks;

const initialState = {
    notebooks: [],
};


//// Action Type
const GET_NOTEBOOKS = "notebooks/getNotebooks";
const ADD_NOTEBOOK = "notebooks/addNotebook";
const DELETE_A_NOTEBOOK = "notebooks/deleteNotebook"
const UPDATE_NOTEBOOK = "notebooks/updateNotebook";

//// Action creator
const getNotebooks = (notebooks) => ({
    type: GET_NOTEBOOKS,
    payload: notebooks,
});

const addNotebook = (addedNotebook) => ({
    type: ADD_NOTEBOOK,
    payload: addedNotebook,
});

const deleteNotebook = (notebookToDelete) => ({
    type: DELETE_A_NOTEBOOK,
    payload: notebookToDelete
});

const updateNotebookAction = (updatedNotebook) => ({
    type: UPDATE_NOTEBOOK,
    payload: updatedNotebook,
});


/////////////////////// THUNKS //////////////////////////


///////Add a Notebook THUNK
export const createNotebook = (addedNotebook) => async (dispatch) => {
    const { name } = addedNotebook;

    try {
        const response = await fetch("/api/notebooks", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 400) {
                console.error('Validation Errors:', data.errors);
                throw data.errors;
            }
            throw new Error(data.message || 'Failed to create a notebook');
        }

        dispatch(addNotebook(data));
        return data;

    } catch (error) {
        console.error('Error creating notebook:', error);
        throw error;
    }
};

/////Update A Notebook THUNK
export const updateNotebook = (notebookId, notebook) => async (dispatch) => { 

    try {
        const response = await fetch(`/api/notebooks/${notebookId}`, {
            
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notebook)
        });
        if (response.ok) {
            const updatedNotebook = await response.json();
            dispatch(updateNotebookAction(updatedNotebook));
            return updatedNotebook;
        }
    } catch (err) {
        console.error(`Error updating notebook: ${err}`);
    }
};



/////Get ALL Notebooks THUNK
export const getAllNotebooks = () => async (dispatch) => {
    const response = await fetch("/api/notebooks");


    if(response.ok) {
        const data = await response.json();
        dispatch(getNotebooks(data));

    } else if (response.status < 500) {
        const errorMessages = await response.json();
        return errorMessages
      } else {
        return { server: "Something went wrong. Please try again" }
      }
    
};


///////////Delete A Notebook THUNK

export const deleteANotebook = (notebookId) => async (dispatch) => {

    try {
        const response = await fetch(`/api/notebooks/${notebookId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            dispatch(deleteNotebook(notebookId));
            dispatch(getAllNotebooks());
        } else {
            throw new Error('Failed to delete the Notebook');
        }
    } catch (error) {
        console.error('Error deleting the Notebook', error);
    }
};


///////////// NOTEBOOK REDUCER /////////////
const notebooksReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_NOTEBOOKS:
            return {
                ...state,
                notebooks: action.payload,
            };

        case ADD_NOTEBOOK:
            return {
                ...state,
                notebooks: [...state.notebooks, action.payload],
            };

        case DELETE_A_NOTEBOOK:
            return {
                ...state,
                notebooks: state.notebooks.filter(notebook => notebook.id !== action.payload.id)
            };
        
        case UPDATE_NOTEBOOK:
            return {
                ...state,
                notebooks: state.notebooks.map((notebook) =>
                    notebook.id === action.updatedNotebook.id ? action.payload : notebook
                ),
            };

        default: 
            return state;
    }
};

export default notebooksReducer;
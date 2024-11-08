//! --------------------------------------------------------------------
//*                        Action Types
//! --------------------------------------------------------------------
const SET_ALL_TASKS = "tasks/SET_ALL_TASKS";
const SET_TASK = "tasks/SET_TASK";
const CREATE_TASK = "tasks/CREATE_TASK";
const EDIT_TASK = "tasks/EDIT_TASK";
const DELETE_TASK = "tasks/DELETE_TASK";






//! --------------------------------------------------------------------
//*                        Action Creators
//! --------------------------------------------------------------------

export const setAllTasks = (tasks) => ({
  type: SET_ALL_TASKS,
  payload: tasks
})

export const setTask = (task) => ({
  type: SET_TASK,
  payload: task
})

export const createTask = (newTask) => ({
  type: CREATE_TASK,
  payload: newTask
})

export const editTask = (editedTask) => ({
  type: EDIT_TASK,
  payload: editedTask
})

export const deleteTask = (deteledTask_id) => ({
  type: DELETE_TASK,
  payload: deteledTask_id
})



//! --------------------------------------------------------------------
//*                          Thunks
//! --------------------------------------------------------------------

// Fetch all the tasks
export const setAllTasksThunk = () => async (dispatch) => {
  const response = await fetch("api/tasks");
  if (response.ok){
    const data = await response.json();
    dispatch(setAllTasks(data));

  }else {
    console.error("Error fetching tasks")
    return {error: "Something went wrong when fetching all tasks data"}

  }
}

// Fetch one specific task

export const setOneTaskThunk = (task_id) => async (dispatch) => {
  const response = await fetch(`api/tasks/${task_id}`)
  if(response.ok){
    const data = await response.json();
    dispatch(setTask(data))
  }else {
    console.error("Error fetching a task")
    return{error: "Something went wrong when fetching a task data"}
  }
}

// Create one task

export const createATaskThunk = (taskData) => async (dispatch) => {
  const response = await fetch('api/tasks',{
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData)
  });

  if (response.ok) {
    const newTask = await response.json();
    dispatch(createTask(newTask));
    dispatch(setAllTasksThunk());// re-fetching, to remain the consistensy with backend
    return newTask;
  }else {
    console.error("Error fetching a spot")
    return {error: "Something went wrong when creating a task"}
  }
}

// Edit a specific task

export const editATaskThunk = (taskData) => async (dispatch) => {
  const response = await fetch(`api/tasks/${taskData.id}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(taskData)
  })

  if (response.ok){
    const updateTask = await response.json();
    dispatch(editTask(updateTask));
    dispatch(setAllTasksThunk());
    return updateTask
  }else {
    console.error("Error editing a task")
    return {error: "Something went wrong when updating a task"}
  }

}

// Delete a task

export const deleteATaskThunk = (task_id) => async (dispatch) => {
  const response = await fetch(`api/tasks/${task_id}`,{
    method: 'DELETE',
  });
  if(response.ok){
    dispatch(deleteTask(task_id));
    dispatch(setAllTasksThunk());
  }else {
    console.error("Error deleting a task")
    return {error: "Something went wrong when deleting a task"}
  }


}


//! --------------------------------------------------------------------
//*                          Reducer
//! --------------------------------------------------------------------

const initialState = {
  allTasks: {},
  singleTask: {}
};

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_TASKS: {
      const newState = {...state, allTasks:{...state.allTasks}};
      action.payload.forEach((task) => {
        newState.allTasks[task.id] = task
      });
      return newState;
    }

    case SET_TASK: {
      return {
        ...state,
        singleTask: action.payload,
      };
    }

    case CREATE_TASK: {
      const newState = {
        ...state,
        allTasks:{ ...state.allTasks, [action.payload.id]:action.payload },
        singleTask: action.payload
      }
      return newState;

    }

    case EDIT_TASK: {
      return {
        ...state,
        allTasks:{
          ...state.allTasks,
          [action.payload.id]:action.payload,
        },
      };

    }

    case DELETE_TASK: {
      const newState = {...state};
      delete newState.allTasks[action.payload];
      return newState
      
    }

    default:
      return state;
  }
};

export default tasksReducer
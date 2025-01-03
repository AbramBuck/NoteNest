import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllTasksThunk, deleteATaskThunk } from '../../redux/tasks';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './tasks.css';
import DeleteConfirmationModal from './DeleteTask'


export const ViewAllTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sessionUser = useSelector(state => state.session.user);
  const tasksObj = useSelector(state => state.tasks.allTasks);


  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);


   // --------------------------------------Add formatDate function
   const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (date.getFullYear() < 1970) {
      return new Date().toLocaleDateString();
    }
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };
  // ---------------------------------------Add formatDate function

  // Convert tasks object to array and filter for current user
  const tasks = Object.values(tasksObj || {}).filter(task =>
    task && task.user_id === sessionUser?.id
  );


  useEffect(() => {
   
      if (sessionUser) {
        console.log("Fetching tasks for user:", sessionUser.id);
         dispatch(setAllTasksThunk());
        
      }
    
  }, [dispatch, sessionUser]);
  
  const handleUpdate = async (e, taskId) => {
    e.preventDefault(); // Prevent the Link navigation
    e.stopPropagation(); // Stop the event from bubbling up
    navigate(`/tasks/${taskId}/edit`)
  }




  // const handleDelete = async (e,taskId) => {
  //   e. preventDefault(); // Prevent the Link navigation
  //   e.stopPropagation(); // Stop the event from bubbling up
  //   await dispatch(deleteATaskThunk(taskId));
  //   await dispatch(setAllTasksThunk())
  // };

 //-------------delete section--------------

  const handleDelete = (taskId) => {
    setTaskToDelete(taskId);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      dispatch(deleteATaskThunk(taskToDelete)); 
      dispatch(setAllTasksThunk());
      setShowModal(false);  
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);  
  };

  //-------------delete section-----------------

  if (!sessionUser) {
    return <div>Please log in to view tasks</div>;
  }



  return (
  <div className = " side-bar-wrapper">
    <Sidebar />
    <div className="tasks-page">
      <h1>TASKS</h1>

      <div className="debug-section">
        <p>Current User ID: {sessionUser.id}</p>
        <p>Total Tasks in Store: {Object.keys(tasksObj).length}</p>
        <p>Filtered Tasks: {tasks.length}</p>
      </div>

      <div className="tasks-grid">
        {tasks && tasks.length > 0 ? (
          tasks.map((task, i) => (
            <div key={i} className="task-card-wrapper">
              <div className="task-card">
                <Link to={`/tasks/${task.id}`} className="task-content">
                  <h3>{task.name}</h3>
                  <p>{task.description}</p>
                </Link>

                <div className="card-footer">
                  <div className="task-date">
                    Created: {formatDate(task.created_at)}
                  </div>
                  <div className="action-buttons">
                    <button
                      className="update-btn"
                      onClick={(e) => handleUpdate(e, task.id)}
                    >
                      UPDATE
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(task.id)}
                    >
                      DELETE
                    </button>
                  </div>
                </div>

              </div>
              
            </div>
          ))
        ) : (
          <p>No tasks found. Create a new task to get started!</p>
        )}
      </div>
    </div>
    
    <DeleteConfirmationModal 
        show={showModal} 
        onConfirm={handleConfirmDelete} 
        onCancel={handleCancelDelete} 
      />
  </div>


  
  );
};

import { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { setAllTasksThunk, deleteATaskThunk, setOneTaskThunk} from '../../redux/tasks';
// import { AlertCircle, Edit, Trash2, Plus, Clock, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import './SingleTaskView.css';
import Sidebar from '../Sidebar/Sidebar';


//! --------------------------------------------------------------------
//*                          SingleTaskDetail Component
//! --------------------------------------------------------------------

// SingleTaskView.jsx
export const SingleTaskDetail = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // const SingleTask = useSelector(state => state.tasks.singleTask);
  const tasksObj = useSelector(state => state.tasks.allTasks);
  const singleTaskObj = Object.values(tasksObj).find((task) => task.id === Number(taskId));



  //validation state
  const[isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false); // for the "Mark Completed"
  


  //! --------------------------------------------------------------------
  //                          Handle Form Submit
  //! --------------------------------------------------------------------

  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true);
      try{
        await Promise.all([
          dispatch(setAllTasksThunk()),
          dispatch(setOneTaskThunk(taskId))
        ]);
      } catch (error) {
        console.error('Error loading task:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [dispatch, taskId]);

  if(isLoading){
    return <div>Loading...</div>;
  }

  if(!singleTaskObj) {
    return <h1> Task Not Found </h1>
  }



  const handleUpdate = async (e) => {
    e.preventDefault();
    await navigate(`/tasks/${singleTaskObj.id}/edit`);
    await dispatch(setAllTasksThunk());
    await dispatch(setOneTaskThunk(singleTaskObj.id));

  };

  const handleDelete = async () => {
    await dispatch(deleteATaskThunk(singleTaskObj.id));
    await dispatch(setAllTasksThunk());
    navigate('/tasks');
  };

  const handleChange = async (e) => {
    e.preventDefault();
    setIsCompleted(true);
  }

 

  //! --------------------------------------------------------------------
  //                         Return JSX HTML Part
  //! --------------------------------------------------------------------

  return (
    <div className="single-task-container">
      <Sidebar />
      <div className="right-panel">
        <h1>{singleTaskObj.name || 'TASK Name HERE'}</h1>
        
        <span 
          className="priority-area" 
          data-priority={singleTaskObj.priority?.toLowerCase()}
        >
          {singleTaskObj.priority || 'Priority'}
        </span>
        
        <div className="task-description">
          <h3>Task Details:</h3>
          <p>{singleTaskObj.description || 'Task details will appear here.'}</p>
        </div>
        
        <div className="task-buttons">
          <button type="button" className="update-button" onClick={handleUpdate}>UPDATE</button>

          <button type="button" className="complete-button" onClick={handleChange}>Mark Complete</button>
          <button type="button" className="delete-button" onClick={handleDelete}>DELETE</button>
        </div>
        
      </div>
    </div>
  );
      
};

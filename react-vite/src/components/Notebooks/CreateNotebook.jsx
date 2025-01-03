import  { useState } from 'react';
import { useDispatch } from 'react-redux';
import './CreateNotebookStyle.css'
import Sidebar from '../Sidebar/Sidebar';
import { createNotebook } from '../../redux/notebooks';


const CreateNotebookPage = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [error, setErrors] = useState(null); 


    const handleSubmit = async (e) => {
        e.preventDefault();

        const notebookData = {
        name,
        };

        try {
            await dispatch(createNotebook(notebookData));
            window.location.href = `/notebooks/manage`;
        } catch (error) {
            setErrors({ submission: "Error when trying to create a review." });
        }
    };


  return (
    <div className="Create-wrapper">
      <Sidebar />
    <div className="create-note-container">
      <h1>Create a New Notebook</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Notebook Name:</label>
          <input
            type="text"
            id="title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
       
        <button type="submit">Create Notebook</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
    </div>
  );
};

export default CreateNotebookPage;
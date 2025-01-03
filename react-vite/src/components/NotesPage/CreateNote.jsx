import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateNote.css'
import Sidebar from '../Sidebar/Sidebar';

const CreateNotePage = () => {
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [notebooks, setNotebooks] = useState([]);  
  const [notebookId, setNotebookId] = useState(1); 
  const [error, setError] = useState(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotebooks = async () => {
      try {
        const response = await fetch('/api/notebooks');  
        if (!response.ok) {
          throw new Error('Failed to fetch notebooks');
        }
        const data = await response.json();
        setNotebooks(data); 
      } catch (err) {
        setError('Error fetching notebooks');
        console.error(err);
      }
    };

    fetchNotebooks();
  }, []); 

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      content,
      notebook_id: notebookId,
      tags: tags.split(',').map((tag) => tag.trim()) 
    };

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        
        navigate('/notes');
      } else {
        const result = await response.json();
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Error while creating note');
      console.error(err);
    }
  };

  return (
    <div className="Create-wrapper">
      <Sidebar />
    <div className="create-note-container">
      <h1>Create a New Note</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated):</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className="form-group">
        <label htmlFor="notebook_id">Notebook:</label>
          <select
            id="notebook_id"
            value={notebookId}
            onChange={(e) => setNotebookId(e.target.value)}
            required
          >
            <option value="">Select a notebook</option>
            {notebooks.map((notebook) => (
              <option key={notebook.id} value={notebook.id}>
                {notebook.name} 
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Note</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
    </div>
  );
};

export default CreateNotePage;

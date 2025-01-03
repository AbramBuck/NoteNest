
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotebooks } from "../../redux/notebooks";
import { Link } from 'react-router-dom';
import { FaBook } from "react-icons/fa";
import { thunkFetchNotes } from "../../redux/notes";
import Sidebar from "../Sidebar/Sidebar";
import "./Homepage.css";

function HomePage() {
  const dispatch = useDispatch();
  const user = useSelector((store)=> store.session.user);
  const notebooks = useSelector((state) => state.notebooks.notebooks);
  const notes = useSelector((state)=> state.notes.notes);

  useEffect(() => { 
    dispatch(getAllNotebooks());
    dispatch(thunkFetchNotes());
}, [dispatch]);

const sortedNotes = notes
.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
.slice(0, 4);

  return (
    <div className="page-wrapper">
      <Sidebar />
      {/* NavBar End */}
      <div className="content-wrapper">
        <div className="sign-in-icon-area">
            <div className="sign-in-icon"> </div>
        </div>
        <div className="note-books-area">
            <h1 className="notebook-header">NOTEBOOKS</h1>
            <div className={ notebooks.length > 4 ? "notebooks-populated-area scroll-bar" : "notebooks-populated-area"}>
              {notebooks.map((notebook) => (
                <div className="notebook-instance" key={notebook.id}>
                  <Link to={`/notebooks/${notebook.id}`}>
                    <h1 className="notebook-icon"><FaBook /></h1>
                  </Link>
                  <h3>{notebook.name}</h3>                
                </div>
              ))}
              </div>
        </div>
            <div className="note-area-wrapper">
          <h2 className="recentNotes">RECENT NOTES</h2>
          {sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <div className="single-note" key={note.id}>
                <h2 className="note-header">{note.title}</h2>
                <p>{note.content || "You haven't added any notes yet. Start by creating one!"}</p>  
                <p>Tags: {note.tags.join(", ")}</p> 
                <p>Created on: {new Date(note.created_at).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No notes available</p>
          )}
        </div>
      </div>
    </div>

)
}

export default HomePage;

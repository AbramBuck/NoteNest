//import React from "react";
//import Homepage from "./components/Layout/Homepage.css";
import { FaBook } from "react-icons/fa";
import dummyText from "./components/Layout/DummyText";

function Notebook() {
  return (
    <div className="page-wrapper">
      <div className="nav-bar">
        <div className="user-name">
          <h2>Username</h2>
        </div>
        <div className="nav-btn-area">
          <div>Notebooks</div><div>+</div>
        </div>
        <div className="nav-btn-area">
          <div>Notebooks</div><div>+</div>
        </div>
        <div className="nav-btn-area">
          <div>Notebooks</div><div>+</div>
        </div>
        <div className="nav-btn-area">
          <div>Notebooks</div><div>+</div>
        </div>
        <div className="nav-btn-area">
          <div>Notebooks</div><div>+</div>
        </div>
      </div>
      {/* NavBar End */}
      <div className="content-wrapper">
        <div className="sign-in-icon-area">
            <div className="sign-in-icon"> Sign In   X</div>
        </div>
        <div className="note-books-area">
            <h1 className="notebook-header">NOTEBOOKS</h1>
            <h1 className="note-book-icons"><FaBook /><FaBook /><FaBook /><FaBook /><FaBook /><FaBook /><FaBook /><FaBook /><FaBook /></h1>
        </div>
        <div className="note-area-wrapper">
          <div className="single-note">
            <h2 className="note-header">Note Title</h2>
            <p>{dummyText}</p>
          </div>
          <div className="single-note">
            <h2 className="note-header">Note Title</h2>
            <p>{dummyText}</p>
          </div>
          <div className="single-note">
            <h2 className="note-header">Note Title</h2>
            <p>{dummyText}</p>
          </div>
          <div className="single-note">
            <h2 className="note-header">Note Title</h2>
            <p>{dummyText}</p>
          </div>
          <div className="single-note">
            <h2 className="note-header">Note Title</h2>
            <p>{dummyText}</p>
          </div>
        </div>
      </div>
    </div>

)
}

export default Notebook;

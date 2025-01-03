import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import  "../../../src/components/Sidebar/SidebarStyle.css"



function Sidebar(){
    const user = useSelector((store) => store.session.user);
    const navigate = useNavigate();

    if (!user) navigate(`/login`);

    return(
        <div className="sidebar">
            <div className="user-name">
                <h2>{ !user? "Welcome" : `Hi, ${user.username}`}</h2>
            </div>
            <div className="sidebar-btn-area">
                <NavLink to="/" title="Go to Homepage Dashboard">Homepage</NavLink>
            </div>
            <div className="sidebar-btn-area">
            <NavLink to="/notebooks/manage" title="See Your Notes">Notebooks</NavLink>
            <NavLink to="/notebooks/create" title="Create a new Notebook">+</NavLink>
            </div>
            <div className="sidebar-btn-area">
            <NavLink to="/notes" title="See Your Notes">Notes</NavLink>
            <NavLink to="/newnote" title="Create a new Note">+</NavLink>
            </div>
            <div className="sidebar-btn-area">
            <NavLink to="/tasks" title="See Your Tasks">Tasks</NavLink>
            <NavLink to="/tasks/new"title="Create a new Task">+</NavLink>
            
            </div>
            <div className="sidebar-btn-area">
            <NavLink to="/tags" title="See Your Tags">Tags</NavLink>
            <NavLink to="/tags" title="Create a new Tag">+</NavLink>
            </div>
      </div>
    )
}

export default Sidebar;

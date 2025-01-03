import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import NotesPage from '../components/NotesPage/NotesLanding';
import Layout from './Layout';
import HomePage from '../components/Homepage/HomePage';
import Tags from '../components/Tags/Tags';

import { ViewAllTasks } from '../components/Tasks/ViewAllTasks';
import { CreateTask } from '../components/Tasks/CreateTasks';
import { UpdateTask } from '../components/Tasks/UpdateTasks';
import { SingleTaskDetail } from '../components/Tasks/SingleTaskView';

import ManageNotebooks from '../components/Notebooks/ManageNotebooks';
import CreateNotebookPage from '../components/Notebooks/CreateNotebook';
import UpdateNote from '../components/NotesPage/UpdateNote'
import CreateNotePage from '../components/NotesPage/CreateNote';
import ViewNotebookNotes from '../components/Notebooks/ViewNotebookNotes';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path:"notes",
        element: <NotesPage/>,
      },
      {
        path: 'notebooks/manage',
        element:<ManageNotebooks />,
      },
      {
        path: 'notebooks/create',
        element:<CreateNotebookPage />,
      },
      {
        path: "/notebooks/:notebookId",
        element: <ViewNotebookNotes />,
      },
      // {
        
      //   path: '/notes/:noteId/edit', 
      //   element: <UpdateNote />, 
      
      // }
      {
        path: "tags", 
        element: <Tags />,     
      },
      {
        path:"tasks/",
        element: <ViewAllTasks />

      },
      {
        path:"tasks/new",
        element: <CreateTask />
      },
      {
        path:"tasks/:taskId",
        element: <SingleTaskDetail />
      },
      {
        path: "/notes/:noteId", 
        element: <UpdateNote />, 
      },
      {
        path: "newnote",
        element: <CreateNotePage/>,
      },
      {
        path:"tasks/:taskId/edit",
        element: <UpdateTask />
      },
      {
        path: "*",
        element: <HomePage />,
      }
    ],
  },
]);

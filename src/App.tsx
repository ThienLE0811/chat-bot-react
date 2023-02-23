import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login";
import SingUp from "./pages/Auth/SignUp";
import Dialogue from "./pages/Dialogue";
import Home from "./pages/Home/Home";
import Train from "./pages/Train";
import User from "./pages/User";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "dialogue",
        element: <Dialogue />,
      },
      {
        path: "train",
        element: <Train />,
      },
      {
        path: "user",
        element: <User />,
      },
    ],
  },
  {
    path: "/singup",
    element: <SingUp />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

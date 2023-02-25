import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import SingUp from "./pages/login/SignUp";
import Dialogue from "./pages/Dialogue";
import Home from "./pages/Home/Home";
import Train from "./pages/Train";

import { routes } from "./config/router";

function App() {
  const router = createBrowserRouter(routes);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

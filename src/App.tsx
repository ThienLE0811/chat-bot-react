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
import { Provider } from "react-redux";

import { routes } from "./config/router";
import store from "./redux/store";

function App() {
  const router = createBrowserRouter(routes);
  return (
    <Provider store={store}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </Provider>
  );
}

export default App;

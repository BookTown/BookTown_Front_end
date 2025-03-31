import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import Home from "./screens/home/Home";
import Search from "./screens/search/Search";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: "/history",
                element: <Home />,
            },
            {
                path: "/ranking",
                element: <Home />,
            },
            {
                path: "/settings",
                element: <Home />,
            },
            {
                path: "/search",
                element: <Search />,
            },
            {

            }
        ]
    },
]);

export default router;
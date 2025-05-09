import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import Home from "./screens/home/Home";
import Search from "./screens/search/Search";
import Popular from "./screens/book/Popular";
import Recent from "./screens/book/Recent";
import OAuthCallback from "./callback/OAuthCallback";
import Setting from "./screens/setting/Setting";
import Rank from "./screens/rank/Rank";
import History from "./screens/history/History";
import Cartoon from "./screens/cartoon/Cartoon";
import LikedBooks from "./screens/setting/LikedBooks";
import Quiz from "./screens/quiz/Quiz";
import QuizEntry from "./screens/quiz/QuizEntry";

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
                element: <History />,
            },
            {
                path: "/ranking",
                element: <Rank />,
            },
            {
                path: "/settings",
                element: <Setting />,
            },
            {
                path: "/search",
                element: <Search />,
            },
            {
                path: "/popular",
                element: <Popular />,
            },
            {
                path: "/recent",
                element: <Recent />,
            },
            {
                path: "/cartoon/:bookId",
                element: <Cartoon />,
            },
            {
                path: "/quiz",
                element: <Quiz />,
            },
            {
                path: "/oauth/callback",
                element: <OAuthCallback />,
            },
            {
                path: "/likedBooks",
                element: <LikedBooks />,
            },
            {
                path: "/quizStart/:bookId",
                element: <QuizEntry />,
            }
        ]
    },
]);

export default router;
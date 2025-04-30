import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./Page/Layout/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import { Home } from "./Page/Home";
import "leaflet/dist/leaflet.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <Home />,
            }
        ]
    }

]);


function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
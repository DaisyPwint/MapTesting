import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div className="flex">
            <div className="w-4/5 mx-auto py-3">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
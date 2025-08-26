import { Outlet } from "react-router-dom"

function Aboutme(){
    return <div className="flex flex-col justify-center items-center bg-blue-500">
        <p className="text-4xl">Hello this is the About me page</p>
        <Outlet />
    </div>
}

export default Aboutme
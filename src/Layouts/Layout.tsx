import { Outlet, useNavigation } from "react-router"
import { NavLink } from "react-router"
import { ToastContainer } from "react-toastify"
import { Spinner } from "../components/circularSpinner/Spinner"

const Layout = () => {
    const navigation = useNavigation()
    return(
        <>
            <header className="bg-slate-800">
                <div className="mx-auto max-w-[80%] lg:max-w-6xl py-6"> {/* contenedor */}
                    <div className="flex flex-col space-y-5 lg:flex-row lg:justify-between items-center">
                        <h1 className="text-3xl text-white font-bold text-center">Administración de productos</h1>
                        <nav className="space-x-5">
                            <NavLink className={({isActive}) => isActive ? "text-white text-lg" : "text-gray-500 text-lg"} to="/">Productos</NavLink>
                            <NavLink className={({isActive}) => isActive ? "text-white text-lg" : "text-gray-500 text-lg"} to="/productos/registrar">Registrar</NavLink>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="mt-5 lg:mt-10">
                <div className="mx-auto max-w-[95%] lg:max-w-6xl bg-white rounded-sm shadow-lg p-5">
                    { navigation.state === 'loading' ? <Spinner/> : <Outlet/> }
                </div>
            </main>
            <ToastContainer/>
        </>
    )
}

export default Layout
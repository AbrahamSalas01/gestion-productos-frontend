import { useEffect, useMemo } from "react"
import { ActionFunctionArgs, useLoaderData, useNavigation } from "react-router"
import { getProducts, updateAvailability } from "../services/productService"
import { toast } from "react-toastify"
import { ApiResponse, Product } from "../types"
import { ProductDetails } from "../components/ProductDetails"

export const loader = async () => {
    const data = await getProducts()
    return data
}

export const action = async ({params}: ActionFunctionArgs) => {
    const id = params.id

    if(id !== undefined){
        const response = await updateAvailability(+id)
        return response
    }
}

const IndexPage = () => {
    const navigation = useNavigation()
    const data = useLoaderData() as ApiResponse<Product[]>
    const products = useMemo(() => {
        if(data.data === undefined) return []
        return data.data.map(product => <ProductDetails key={product.id} product={product}/>)
    }, [data.data])

    useEffect(() => {
        toast(data.message,
            {
                type: data.success ? 'success' : 'error',
                autoClose: 2000,
                position: 'bottom-right',
                pauseOnHover: false
            }
        )
    }, [])

    console.log('componente padre renderizado!')

    return(
        <>
            {navigation.state === 'loading' && <p>Cargando</p>}
            <h2 className="text-2xl font-black text-slate-500">Productos</h2>
            {data.success &&
            <table className="mt-5 w-full table-auto">
                <thead className="text-white">
                    <tr className="text-lg font-bold">
                        <th className="bg-slate-800 p-2">Producto</th>
                        <th className="bg-slate-800 p-2">Precio</th>
                        <th className="bg-slate-800 p-2">Disponibilidad</th>
                        <th className="bg-slate-800 p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? products : <tr>
                        <td colSpan={4} className="p-5"><p className="text-center font-bold text-lg">No tienes productos registrados</p></td>
                    </tr>}
                </tbody>
            </table>
            }
        </>
    )
}

export default IndexPage
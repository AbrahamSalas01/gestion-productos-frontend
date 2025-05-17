import React, {useEffect, useState} from "react"
import { useFetcher, Link, useNavigate } from "react-router"
import {toast} from "react-toastify"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid"
import { Product, ApiResponse } from "../types"
import { deleteProduct } from "../services/productService"
import { formatCurrency } from "../utils"
import { Spinner } from "./squareSpinner/Spinner"

type ProductDetailsprops = {
    product: Product
}

export const ProductDetails = React.memo(({product} : ProductDetailsprops) => {
    const fetcher = useFetcher()
    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(false)
    
    const response = fetcher.data as ApiResponse<null>

    const isLoading = fetcher.state === 'submitting'

    const handleDelete = async (id: Product['id']) => {
        setDeleting(true)
        const response = await deleteProduct(id)

        toast(response.message,
            {
                type: response.success ? 'success' : 'error',
                autoClose: 3000,
                pauseOnHover: false,
                position: 'bottom-right'
            }
        )

        setDeleting(false)
        if(!response.success) return
        
        navigate('/')
    }

    useEffect(() => {
        if(response !== undefined){
            toast(response.message, 
                {
                    type: response.success ? 'success' : 'error',
                    autoClose: 3000,
                    pauseOnHover: false,
                    position: 'bottom-right'
                }
            )
        }
    }, [response])

    console.log(product.name, ': renderizado!')
    return(
        <tr className="border-b border-b-gray-400 text-center">
            <td className="p-3">{product.name}</td>
            <td className="p-3 font-bold">{formatCurrency(product.price)}</td>
            <td className="p-3">
                <fetcher.Form method="patch" action={`/productos/${product.id}/disponibilidad`}>
                    <button
                        type='submit'
                        className="p-1 outline-1 outline-indigo-500 rounded-sm hover:cursor-pointer hover:outline-2 hover:outline-indigo-600 text-sm bg-indigo-100 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {product.available ? 'Disponible' : 'No disponible'}
                    </button>
                </fetcher.Form>
            </td>
            <td className="p-3">
                <div className="grid grid-cols-2 place-items-center">
                    <Link to={`/productos/${product.id}/actualizar`} className="px-2 py-1 w-3/4 rounded-sm bg-indigo-500 hover:cursor-pointer">
                        <div className="flex gap-1 items-center justify-center">
                            <PencilSquareIcon className="size-4 text-white"/>
                            <p>Actualizar</p>
                        </div>
                    </Link>
                    {deleting ? <Spinner/> : 
                    <button
                        onClick={() => handleDelete(product.id)}
                        className="px-2 py-1 w-3/4 max-h-8 rounded-sm bg-red-500 hover:cursor-pointer"
                    >
                        <div className="flex gap-1 items-center justify-center">
                            <TrashIcon className="size-4 text-white"/>
                            <p>Eliminar</p>
                        </div>
                    </button>
                    }
                </div>
            </td>
        </tr>
    )
})
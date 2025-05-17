import { ActionFunctionArgs, Form, LoaderFunctionArgs, redirect, useActionData, useLoaderData, useNavigation } from "react-router";
import { getProduct, updateProduct } from "../services/productService";
import { Product } from "../types";
import { Spinner } from "../components/circularSpinner/Spinner";
import { useEffect } from "react";
import { toast } from "react-toastify";

const loader = async ({params}: LoaderFunctionArgs) => {
    const id = params.id

    if (id === undefined || isNaN(+id) || +id < 1){
        throw new Response('',
            {
                status: 400,
                statusText: 'Bad request - ID not valid'
            }
        )
    }
    
    try {
        const data = await getProduct(+id)
        if(!data.success){
            console.log(data.message)
            return redirect('/')
        }

        return data.data
    } catch (error) {
        throw new Response('Error fetching the product', 
            {
                status: 500,
                statusText: 'Internal Server Error'
            }
        )
    }
}

const action = async ({request} : ActionFunctionArgs) => {
    const updatedProductData = Object.fromEntries(await request.formData())

    if(Object.values(updatedProductData).includes('')){
        return {succes: false, message: 'Todos los campos son obligatorios'}
    }

    const productUpdated = await updateProduct(updatedProductData)
    
    if(productUpdated.success) return redirect('/')

    return productUpdated
}

const UpdateProductPage = () => {
    const product = useLoaderData() as Product
    const data = useActionData()
    const {state} = useNavigation()

    const isSubmitting = state === 'submitting'

    // efecto para mensaje de error
    useEffect(() => {
        if(data){
            toast(data.message,
                {
                    type: 'error',
                    pauseOnHover: false,
                    autoClose: 3000,
                    position: 'bottom-right'
                }
            )
        }
    }, [data])
    
    return(
        <>
            <h2 className="text-2xl font-black text-slate-500">Actualizar producto</h2>
            { isSubmitting ? <Spinner/> :
                <Form
                    className="mt-5"
                    method="POST"
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col space-y-2">
                            <input type="hidden" name="id" value={product.id}/>
                            <label htmlFor="name"> Nombre del producto </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="p-2 rounded-sm outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-700"
                                placeholder="Ingrese el nombre del producto. Ej. Sombrero de dama"
                                autoComplete="off"
                                defaultValue={product.name}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="price"> Precio </label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                className="p-2 rounded-sm outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-700"
                                placeholder="Ingrese el precio. Ej. 150"
                                defaultValue={product.price}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="availability">Disponibilidad</label>
                            <select
                                name="availability"
                                id="availability"
                                className="p-2 rounded-sm outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-700"
                                defaultValue={product.available.toString()}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="true">Disponible</option>
                                <option value="false">No disponible</option>
                            </select>
                        </div>
                        <input
                            type="submit"
                            value="Guardar cambios"
                            className="w-[80%] mx-auto p-2 rounded-sm text-white font-bold bg-indigo-500 hover:bg-indigo-700 hover:cursor-pointer"
                        />
                    </div>
                </Form>
            }
        </>
    )
}

export default UpdateProductPage

export {
    loader,
    action
}
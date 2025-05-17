import { Form, ActionFunctionArgs, useActionData, redirect, useNavigation } from "react-router"
import { addProduct } from "../services/productService"
import {toast} from "react-toastify"
import { useEffect, useMemo } from "react"
import { Spinner } from "../components/circularSpinner/Spinner"

export const action = async ({request}: ActionFunctionArgs) => {
    const productData = Object.fromEntries(await request.formData())

    if(Object.values(productData).includes('')){
        return {success: false, message: 'Todos los campos son obligatorios'}
    }

    const productCreated = await addProduct(productData)

    if(productCreated.success) return redirect('/')
    
    return productCreated
}

const AddProductPage = () => {

    const data = useActionData()
    const {state} = useNavigation()

    const isSubmitting = useMemo(() => state === 'submitting', [state])

    useEffect(() => {
        if(data){
            toast(data.message, {
                type: 'error',
                position:'bottom-right',
                pauseOnHover: false,
                autoClose: 2000
            })
        }
    }, [data])
    return(
        <>
            <h2 className="text-2xl font-black text-slate-500">Registrar producto</h2>
            {isSubmitting ? <Spinner/> :
                <Form
                    className="mt-5"
                    method="POST"
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="name">Nombre del producto</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Ej. Sombrero de dama"
                                className="p-2 rounded-sm outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-700"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="price">Precio</label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                placeholder="Ej. 150"
                                className="p-2 rounded-sm outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-700"
                                required
                            />
                        </div>
                        <input
                            type="submit"
                            value="Registrar producto"
                            className="p-2 rounded-sm bg-indigo-500 text-white font-bold w-[80%] mx-auto hover:bg-indigo-700 hover:cursor-pointer"
                        />
                    </div>
                </Form>
            }
        </>
    )
}

export default AddProductPage
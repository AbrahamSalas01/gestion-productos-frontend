import { DraftProductSchema, ProductSchema, ProductsSchema } from "../schemas/productSchema"
import { Product, ProductData, ApiResponse } from "../types/index"
import { safeParse } from "valibot"
import { apiRequest } from "./apiRequest"

export const addProduct = async (productData : ProductData) : Promise<ApiResponse<Product>> => {
    const result = safeParse(DraftProductSchema, {
        name: productData.name,
        price: +productData.price
    })

    if(!result.success){
        return {success: false, message: 'Los tipos no son correctos'}
    }

    return await apiRequest<Product>({
        url: '/api/products',
        method: 'POST',
        data: result.output
    })
}

export const getProducts = async () : Promise<ApiResponse<Product[]>> => {

    const response =  await apiRequest<Product[]>({
        url: '/api/products',
        method: 'GET'
    })

    if(!response.success) return response // no se pudieron obtener los datos

    const result = safeParse(ProductsSchema, response?.data)

    if(!result.success){
        return {success: false, message: 'Respuesta del servidor desconocida'}
    }

    return response // ya tiene data
}

export const getProduct = async (id: Product['id']) : Promise<ApiResponse<Product>> => {
    return await apiRequest<Product>({
        url: `/api/products/${id}`,
        method: 'GET'
    })
}

export const updateProduct = async (productData : ProductData) : Promise<ApiResponse<Product>>=> {
    
    const result = safeParse(ProductSchema,
        {
            id: +productData.id,
            name: productData.name,
            price: +productData.price,
            available: productData.availability === 'true' ? true : productData.availability === 'false' ? false : null
        }
    )

    if(!result.success){
        return {success: false, message: 'Los datos ingresados no son válidos'}
    }

    return apiRequest<Product>({
        url: `/api/products/${result.output.id}`,
        method: 'PUT',
        data: {
            name: result.output.name,
            price: result.output.price,
            available: result.output.available
        }
    })
}

export const deleteProduct = async (id: Product['id']) : Promise<ApiResponse<null>> => {
    return apiRequest<null>({
        url: `/api/products/${id}`,
        method: 'DELETE'
    })
}

export const updateAvailability = async (id: Product['id']) : Promise<ApiResponse<Product>> => {
    return apiRequest<Product>({
        url: `/api/products/${id}`,
        method: 'PATCH'
    })
}
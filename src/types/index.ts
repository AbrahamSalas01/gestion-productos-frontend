import { InferInput } from "valibot"
import { ProductSchema, ProductsSchema } from "../schemas/productSchema"

export type DraftProduct = {
    name: string
    price: number
}

export type ProductData = {
    [k: string]: FormDataEntryValue
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T
}

export type BackendError = {
    type: string
    value?: string
    msg: string
    path: string
    location: string
}

/* Infered types */
export type Product = InferInput<typeof ProductSchema>

export type Products = InferInput<typeof ProductsSchema>
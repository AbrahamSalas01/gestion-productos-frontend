import {
    object,
    string,
    number,
    boolean,
    array,
} from "valibot"

export const DraftProductSchema = object({
    name: string(),
    price: number()
})

export const ProductSchema = object({
    id: number(),
    name: string(),
    price: number(),
    available: boolean()
})

export const ProductsSchema = array(ProductSchema)
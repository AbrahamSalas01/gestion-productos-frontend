import { createBrowserRouter } from "react-router";
import Layout from "./Layouts/Layout";
import IndexPage, { action as updateAvailablityAction } from "./Views/IndexPage";
import AddProductPage, {action as addProductAction} from "./Views/AddProductPage";
import { loader as productsLoader } from "./Views/IndexPage";
import UpdateProductPage, {loader as productLoader, action as updateProductAction} from "./Views/UpdateProductPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <IndexPage/>,
                loader: productsLoader
            },
            {
                path: '/productos/registrar',
                element: <AddProductPage/>,
                action: addProductAction
            },
            {
                path: '/productos/:id/actualizar', // manera correcta de hacerlo
                element: <UpdateProductPage/>,
                loader: productLoader,
                action: updateProductAction
            },
            {
                path: '/productos/:id/disponibilidad',
                action: updateAvailablityAction
            }
        ]
    }
])
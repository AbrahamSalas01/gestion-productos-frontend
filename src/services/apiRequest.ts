import axios, { AxiosRequestConfig, isAxiosError } from "axios";
import { ApiResponse, BackendError } from "../types";

const axiosInstance = axios.create({
    timeout: 10000,
    baseURL: import.meta.env.VITE_API_URL
})

export const apiRequest = async <T>(config: AxiosRequestConfig) : Promise<ApiResponse<T>> => {
    if(!navigator.onLine){
        return {
            success: false,
            message: 'No tienes conexión a internet. Inténtalo más tarde'
        }
    }

    try {
        const {data} = await axiosInstance.request(config)
        // aqui no estoy tipando la respuesta
        return data
    } catch (error) {
        if(isAxiosError(error)){
            let backendResponse : string = ''
            switch(error.response?.status){
                case 400:
                    let backendErrors : BackendError[]
                    backendErrors = error.response.data.errors
                    const checkedPaths : string[] = []
                    backendErrors.forEach(error => {
                        if(!checkedPaths.includes(error.path)){
                            backendResponse += `${error.msg}. `
                            checkedPaths.push(error.path)
                            return error.msg
                        }
                    })
                break;

                case 404: backendResponse = error.response.data.message ?? 'Producto no encontrado'; break;
                case 500: backendResponse = error.response.data.message ?? 'Internal Server Error'; break;
                default: backendResponse = error.message; break;
            }

            return { success: false, message: backendResponse}
        }

        return{
            success: false,
            message: error instanceof Error ? error.message : 'Error desconocido'
        }
    }
}
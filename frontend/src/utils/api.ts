import axios, { AxiosError } from "axios" 

export const api = async <TypeDataResponse>(
    endpoint: string,
    method: 'get' | 'post' | 'put' | 'delete' = 'get',
    data?: object,
    authToken?: string
): Promise<{
    data: TypeDataResponse,
    errorMessage?: string,
    errorCode?: string
}> => {

    let params = method == 'get' ? data : {}
    let body = (['post', 'put', 'delete'].includes(method)) ? data : {}
    let headers = {}

    if (authToken) headers = { "Authorization": `Bearer ${authToken}` }

    try {
        const request = await axios<TypeDataResponse>({
            url: `http://127.0.0.1:8000/api/v1/${endpoint}`,
            method,
            params,
            data: body,
            headers: headers
        })

        return {
            data: request.data
        }
    } catch (e) {
        const error = e as AxiosError<{ message: string, error: string }>

        return {
            data:  null as TypeDataResponse,
            errorMessage: error.response?.data.message || error.message,
            errorCode: error.response?.data.error || error.code
        } 
    }
}
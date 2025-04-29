import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../../store/configureStore";
import { BasketResponse } from "../models/ApiResponse";

// for sleep => dealy
const sleep = () => new Promise(reslove => setTimeout(reslove, 1000));



axios.defaults.baseURL = 'https://localhost:7253/api/';
axios.defaults.withCredentials = true;


const currentLang = localStorage.getItem('language');


// send current lang to server
axios.defaults.headers.common['Accept-Language'] = currentLang;



// to get response
const responsBody = (response: AxiosResponse) => response.data;


// Get Token  1
axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.data.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})



// all data base from here to check if there any error then diplay in website
axios.interceptors.response.use(async response => {
    await sleep();
    //console.log(response);
    const pagination = response.headers['pagination'];
    if (pagination) {
        //console.log('Pagination Header:', pagination);
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        //console.log('Processed Response Data:', response.data); 

        return response;
    }
    
    return response
}, (error: AxiosError) => {

    const { data, status } = error.response as AxiosResponse;

    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErros: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) { 
                        modelStateErros.push(data.errors[key])
                }
            }
            throw modelStateErros.flat();
    }

            toast.error(data.title)
            break;
        case 401:
            toast.error(data.title)
            break;
        case 404:
            toast.error(data.title)
            break;
        case 500:
            router.navigate('/server-error', { state: {error: data}});
            break;
        default:
            break;
    }



    return Promise.reject(error.response);
})


 /* function responseBodeFn(response: AxiosResponse) {
    return response.data;
} */


// Api Generla
const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responsBody),
    post: (url: string, body: object) => axios.post(url, body).then(responsBody),
    put: (url: string, body: object) => axios.put(url, body).then(responsBody),
    delete: (url: string) => axios.delete(url).then(responsBody),
    postForm: (url: string, data: FormData) => axios.post(url, data, {
        headers: { 'Content-type': 'multipart/form-data' }
    }).then(responsBody),
    putForm: (url: string, data: FormData) => axios.put(url, data, {
        headers: { 'Content-type': 'multipart/form-data' }
    }).then(responsBody)

}


// Error
const TestErros = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),

}



// Api  Product
const Product = {
    list: (params: URLSearchParams) => requests.get('products',params),
    details: (id: number) => requests.get(`products/${id}`),
    fillter: () => requests.get('products/filters'),
}
// Api  Basket
const Basket = {
    get: async (): Promise<BasketResponse> => {
        return requests.get('basket');
    },
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
}
// Api Account
const Account = {
    login: (values: any) => requests.post('account/login', values),

    googleLogin: (values: any) => requests.post('account/googleSignIn',values),
    currentUser: () => requests.get('account/currentUser'),

    register: (values: any) => {
        const response =  requests.post('account/register', values);
        return response;
    },
    fetchAddress: () => requests.get('account/saveAddress'),
}

// Api Order

const Orders = {
    create: (values: any) => requests.post('orders', values),
    list: () => requests.get('orders/list'),
    AllOrders: () => requests.get('orders/all'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    update: (id: number, orderStatus: string) => requests.put('orders', { Id: id, OrderStatus: orderStatus }),
}


//Payments
const Payments = {
    createPaymentIntent: () => requests.post('Payments/payments', {}),
}

function createFormData(item: any) {
    const formData = new FormData();
    for (const key in item) {
        formData.append(key, item[key])
    }
    return formData;
}

// Admin
const Admin = {
    createProduct: (product: any) => requests.postForm('products', createFormData(product)),
    updateProduct: (product: any) => requests.putForm('products', createFormData(product)),
    deleteProduct: (id: number) => requests.delete(`products/${id}`)
}



const agent = {

    Product,
    TestErros,
    Basket,
    Account,
    Orders,
    Payments,
    Admin
}

export default agent;
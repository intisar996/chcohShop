import { Basket } from "./Basket";

export interface User {

    data: UserDate,
    roles?: string[]
}

interface UserDate {
    email: string,
    token: string,
    basket?: Basket
}
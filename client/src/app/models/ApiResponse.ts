import { Basket } from "./Basket";
import { Order } from "./order";
import { Product } from "./product";

 interface ApiResponse<T> {

    success: boolean;
    code: number;
    description: string;
     data: T;
     items?: string[];


}

export type ProductResponse = ApiResponse<Product[]>;

export type SingleProductResponse = ApiResponse<Product>;

export type OrderResponse = ApiResponse<Order[]>;

export type SingleOrderResponse = ApiResponse<Order>;

export type BasketResponse = ApiResponse<Basket | null>;








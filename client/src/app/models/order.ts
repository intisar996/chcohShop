﻿export interface Order {
    id: number;
    buyerId: string;
    shippingAddress: ShippingAddress;
    orderDate: string;
    orderItems: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    orderStatus: string;
    paymentStatus:string;
    total: number;
}

export interface ShippingAddress {
    fullName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

export interface OrderItem {
    productId: number;
    nameEn: string;
    nameAr: string;
    pictuerUrl: string;
    price: number;
    quantity: number;
}

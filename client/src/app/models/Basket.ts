export interface Basket {
    id: number;
    buyerId: string;
    items: Item[];
    paymentIntendId?: string;
    clientSecret?: string;
}

export interface Item {
    productId: number
    nameEn: string
    nameAr: string
    price: number
    picterUrl: string
    ptype: string
    pbrand: string
    quantity: number
}


export interface Product {
    id: number;
    nameEn: string;
    nameAr: string;
    descriptionEn: string;
    descriptionAr: string;
    price: number;
    picterUrl: string;
    type: number;
    typeName: string;
    brand: string;
    quantityStock: number;
    size: string;
    sugar: string;
    fat: string;
}



export interface ProductParams {
    orderBy: string;
    searchTerm?: string;
    types: string[];
    brands: string[];
    pageNumber: number;
    pageSize: number;
}

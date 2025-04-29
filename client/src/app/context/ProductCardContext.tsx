import { createContext, useContext } from "react";
import { Product } from "../models/product";


interface ProductCardContextValue {

    products : Product[],
}

export const ProductContext = createContext<ProductCardContextValue | null>(null);

export function useProductContext() {

    const context = useContext(ProductContext);

    if (context === null) {
        throw new Error("useProductContext must be used within a ProductContext.Provider");
    }
    return context;
}

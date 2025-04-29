import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import { fetchProductsAsync, fetchfillterAsync, productSelectors } from "../features/Product/productSlice";

export default function useProducts() {
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, filterLoaded, brands, types, metaData } = useAppSelector(state => state.product);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])

    useEffect(() => {
        if (!filterLoaded) dispatch(fetchfillterAsync());
    }, [dispatch, filterLoaded]);

    return {
        products,
        productsLoaded,
        filterLoaded,
        brands,
        types,
        metaData
    }
}
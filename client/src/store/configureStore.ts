import { configureStore } from "@reduxjs/toolkit";
import { counterSlices } from "../features/contact/CounterSlices";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../features/Basket/BasketSlice";
import { productSlice } from "../features/Product/productSlice";
import { accountSlice } from "../features/Account/accountSlice";
import { orderSlice } from "../features/orders/OrderSlice";

/* export function configureStore() {

    return createStore(counterReducer)

} */


export const store = configureStore({

    reducer: {
        counter: counterSlices.reducer,
        basket: basketSlice.reducer,
        product: productSlice.reducer,
        account: accountSlice.reducer,
        order: orderSlice.reducer,
    }


})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

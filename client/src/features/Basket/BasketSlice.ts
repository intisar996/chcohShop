import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/Basket";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/utill/utill";
import { toast } from "react-toastify";
import { BasketResponse } from "../../app/models/ApiResponse";




// 1- set Data Type For value Like data:number ,Title:string
interface BasketState {
    basket: Basket | null;
    status: string;
    success?: boolean;
    code?: number;
    description?: string,
}


// 2- set intialState Like data:1,Title:"New Title"
const initialState: BasketState = {
    basket: { id: 0, buyerId: '', items: [] },
    status: 'idle',
    success: false,
    code: undefined,
    description: undefined

}


export const addBasketItemAsync = createAsyncThunk<BasketResponse, { productId: number, quantity? : number}>(

    'basket/addBasketItemAsync',
    async ({ productId, quantity = 1 }, thunkAPI) => {

        try {

            const response = await agent.Basket.addItem(productId, quantity);
            //console.log("Response from addItem:", response);
            return response;


        } catch (error: any) {
            console.log(error);
            return thunkAPI.rejectWithValue({ description: 'Failed to fetch Basket' });
        }

    }

)




export const removeBasketItemAsync = createAsyncThunk<void,{ productId: number, quantity: number, name?:string }>(

    'basket/removeBasketItemAsync',
    async ({ productId, quantity}, thunkAPI) => {

        try {
            return await agent.Basket.removeItem(productId, quantity);

        } catch(error : any) {

            return thunkAPI.rejectWithValue({error:error.data})
        }
    }
)


export const fetchBasketAsync = createAsyncThunk<BasketResponse>(

    'basket/fetchBasketAsync',
    async (_, thunkAPI) => {

        try {

            const response = await agent.Basket.get();
            console.log("resonse items data from BasketSlice", response.data)

            return response;
        }
        catch(error: any)
        {
            console.log(error);
            return thunkAPI.rejectWithValue({ description: 'Failed to fetch Basket' });
        }
    },

    {
        condition: () => {

            if (!getCookie('buyerId')) return false;
        }

    }


)









// 3- Create Slice
export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers :{
        setBasket: (state, action) => {
            state.basket = action.payload
        },
        clearBasket : (state) => {
            state.basket = null;
        }
        },

        extraReducers: (builder => {
            builder.addCase(addBasketItemAsync.pending, (state, action) => {
                state.status = 'pendingAddItem' + action.meta.arg.productId;
            });
            builder.addCase(removeBasketItemAsync.pending, (state, action) => {
                state.status = 'pendingRmoveItem' + action.meta.arg.productId + action.meta.arg.name;
            });

            builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
                const { productId, quantity } = action.meta.arg;
                // get all items of Product Id Want remove
                const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);
                // check if there no item with selected product
                if (itemIndex === -1 || itemIndex === undefined) return;
                // remove if found item one quqntity
                state.basket!.items[itemIndex].quantity -= quantity;
                // delete product from basket if quqntity become 0
                if (state.basket?.items[itemIndex].quantity === 0)
                    state.basket.items.splice(itemIndex, 1)  // splice use like arr=[1,2,3]  -- splice(0,2)=(index,number of index want remove) ===output[3]

                state.status = 'idle'

            });

            builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
                state.status = 'idel';
                console.log(action.payload);
                toast.error("something wrong try again");

            });

            builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
                const { success, code, description, data } = action.payload;             
                Object.assign(state, {
                    success,
                    code,
                    description,
                    status: 'idle',
                    basket: data
                })
                //console.log("Updated basket in Redux:", state.basket);
                state.status = 'idle';
            });
            builder.addCase(fetchBasketAsync.pending, (state) => {
                state.status = 'pendingfetchBasketAsync';
            });

            builder.addCase(fetchBasketAsync.fulfilled, (state, action) => {
                const { success, code, description, data } = action.payload;             
                Object.assign(state, {
                    success,
                    code,
                    description,
                    status: 'idle',
                    basket: data
                })
                console.log("state.basket xxx", data);



            });
            builder.addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action) => {
                state.status = 'idle';
                console.log(action.payload);
                toast.error("nothing add to basket try again");

            });

        })
})








// export action

export const { setBasket, clearBasket } = basketSlice.actions;




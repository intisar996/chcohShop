import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../store/configureStore";
import { MetaData } from "../../app/models/pagination";
import { ProductResponse, SingleProductResponse } from "../../app/models/ApiResponse";
import { toast } from "react-toastify";




interface ProductState {
    success?: boolean;
    code?: number;
    description?:string,
    productsLoaded: boolean;
    filterLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;

}


const productAdapter = createEntityAdapter<Product>();


function getAxiosParams(productParams: ProductParams) {

    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy);


    if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);

    if (productParams.brands?.length > 0) params.append('brands', productParams.brands.toString());
    if (productParams.types?.length > 0) params.append('types', productParams.types.toString());

    return params;


}




export const fetchProductsAsync = createAsyncThunk<ProductResponse, void, {state:RootState}>(

    'product/fetchProductsAsync',

     async (_,thunkAPI) => {

         const params = getAxiosParams(thunkAPI.getState().product.productParams);

         try {

             const response = await agent.Product.list(params);
             //console.log('Response MetaData:', response.metaData);
             thunkAPI.dispatch(setMetaData(response.metaData));
             console.log('Response data for list product:', response.items.data);

             return response.items;

         }
         catch (error: any) {
             console.log(error);
             return thunkAPI.rejectWithValue({ description: 'Failed to fetch products'});


             

         }
     }

)


export const fetchProductAsync = createAsyncThunk<SingleProductResponse,number>(

    'fetch/fetchProductAsync',

    async (productId, thunkAPI) => {

        try {

            return await agent.Product.details(productId);

        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }

    }
)


export const fetchfillterAsync = createAsyncThunk(

    'fetch/fetchfillterAsync',
    async (_,thunkAPI) => {

        try {

            //console.log("this is filter", )

            return await agent.Product.fillter();

        } catch (error: any) {
            return thunkAPI.rejectWithValue({error:error.data})
        }
    }

)



function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
        brands: [],
        types: []
    }
}






export const productSlice = createSlice({

    name: 'product',
    initialState: productAdapter.getInitialState<ProductState>({
        success: false,
        code: undefined,
        description: undefined,
        productsLoaded: false,
        filterLoaded:false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams(),
        metaData: null

    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload, pageNumber:1}
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload}
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload;
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        },
        setProduct: (state, action) => {
            productAdapter.upsertOne(state, action.payload);
            state.productsLoaded = false;
        },
        removeProduct: (state, action) => {
            productAdapter.removeOne(state, action.payload);
            state.productsLoaded = false;
        }
    },
       extraReducers: (builder => {
           builder.addCase(fetchProductsAsync.pending, (state) => {
               state.status = 'pendingfetchProductsAsync';
            });
           builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
               const { success, code, description, data } = action.payload;
               state.success = success;
               state.code = code;
               state.description = description;
               console.log("data from product slice", data);

               productAdapter.setAll(state, data);
               state.status = description;
               state.productsLoaded = true;
           });

           builder.addCase(fetchProductsAsync.rejected, (state, action) => {

               if (action.payload) {
                   const { description } = action.payload as { description: string };
                   state.description = description;
                   toast.error(`Error: ${description}`);
                   console.log(action.payload);
                   state.status = 'idle';
               }


           });

           builder.addCase(fetchProductAsync.pending, (state) => {
               state.status = 'pendingfetchProductAsync';

           });
           builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
               const { success, code, description, data } = action.payload;
               //console.log("data from product slice", action.payload);
               state.success = success;
               state.code = code;
               state.description = description;
               productAdapter.upsertOne(state, data);
               state.status = 'idle';
               state.productsLoaded = true;

           });
           builder.addCase(fetchProductAsync.rejected, (state, action) => {
               if (action.payload) {
                   const { description } = action.payload as { description: string };
                   state.description = description || "Something went wrong";
                   toast.error(`Error: ${description} || 'Unknown error occurred'`);
                   console.log(action.payload);
                   state.status = 'idle';
               }

           });

           builder.addCase(fetchfillterAsync.pending, (state) => {
               state.status = 'pendingFetchFillter';
           });

           builder.addCase(fetchfillterAsync.fulfilled, (state, action) => {
               state.brands = action.payload.data.brands;
               state.types = action.payload.data.types;
               state.status = 'idale';
               state.filterLoaded = true;
           });
           builder.addCase(fetchfillterAsync.rejected, (state, action) => {
              console.log(action.payload);
               state.status = 'idle';

           });



        })
    
})




export const productSelectors = productAdapter.getSelectors((state:RootState) => state.product);

export const { setProductParams, resetProductParams, setMetaData, setPageNumber, setProduct, removeProduct } = productSlice.actions;

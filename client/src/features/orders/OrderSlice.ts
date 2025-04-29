import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { OrderResponse, SingleOrderResponse } from "../../app/models/ApiResponse";
import { Order } from "../../app/models/order";
import { RootState } from "../../store/configureStore";

interface OrderState {
  success?: boolean;
  code?: number; 
  description?: string;
  myOrdersLoaded: boolean;
  allOrdersLoaded: boolean;
  orderDetailesLoaded:boolean;
  status: string;
  myOrders: ReturnType<typeof OrderAdapter.getInitialState>;
  allOrders: ReturnType<typeof OrderAdapter.getInitialState>;
  orderDetailes: ReturnType<typeof OrderAdapter.getInitialState>;
}

const OrderAdapter = createEntityAdapter<Order>();

export const fetchOrdersAsync = createAsyncThunk<OrderResponse, void, { state: RootState }>(
  "order/fetchOrdersAsync",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Orders.list();
      console.log("my orders: ", response.data);
      return response;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue({ description: "Failed to fetch My Orders" });
    }
  }
);

export const fetchAllOrdersAsync = createAsyncThunk<OrderResponse, void, { state: RootState }>(
  "order/fetchAllOrdersAsync",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Orders.AllOrders();
      console.log("all orders: ", response.data);
      return response;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue({ description: "Failed to fetch All Orders" });
    }
  }
);

export const fetchOrderAsync = createAsyncThunk<SingleOrderResponse, number>(
  "order/fetchOrderAsync",
  async (orderId, thunkAPI) => {
    try {
      return await agent.Orders.fetch(orderId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    success: false,
    code: undefined,
    description: undefined,
    myOrdersLoaded: false,
    allOrdersLoaded: false,
    status: "idle",
    myOrders: OrderAdapter.getInitialState(),
    allOrders: OrderAdapter.getInitialState(),
    orderDetailes :OrderAdapter.getInitialState(),
  } as OrderState, 
  reducers: {},
  extraReducers: (builder) => {
    // fetchOrdersAsync 
    builder.addCase(fetchOrdersAsync.pending, (state) => {
      state.status = "pendingFetchOrdersAsync";
    });
    builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
      const { success, code, description, data } = action.payload;
      state.success = success;
      console.log("success from my orders slice:", success);
      state.code = code;
      state.description = description;
      console.log("data from my orders slice:", data);
      OrderAdapter.setAll(state.myOrders, data);
      state.status = "idle";
      state.myOrdersLoaded = true;
    });
    builder.addCase(fetchOrdersAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
      state.myOrdersLoaded = false;
    });

    //  fetchAllOrdersAsync  
    builder.addCase(fetchAllOrdersAsync.pending, (state) => {
      state.status = "pendingFetchAllOrdersAsync";
    });
    builder.addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
      const { success, code, description, data } = action.payload;
      state.success = success;
      console.log("success from all orders slice:", success);
      state.code = code;
      state.description = description;
      console.log("data from all orders slice:", data);
      OrderAdapter.setAll(state.allOrders, data);
      state.status = "idle";
      state.allOrdersLoaded = true;
    });
    builder.addCase(fetchAllOrdersAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
      state.allOrdersLoaded = false;
    });

    // User Order Detailes
    builder.addCase(fetchOrderAsync.pending, (state) => {
      state.status = "pendingFetchOrderAsync";
    });
    builder.addCase(fetchOrderAsync.fulfilled, (state, action) => {
      const { success, code, description, data } = action.payload;
      state.success = success;
      console.log("success from order details slice:", success);
      state.code = code;
      state.description = description;
      console.log("data from order details slice:", data);
      OrderAdapter.upsertOne(state.orderDetailes, data);
      state.status = "idle";
      state.orderDetailesLoaded = true;
    });
    builder.addCase(fetchOrderAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
  },
});

export const myOrderSelectors = OrderAdapter.getSelectors(
  (state: RootState) => state.order.myOrders
);
export const allOrderSelectors = OrderAdapter.getSelectors(
  (state: RootState) => state.order.allOrders
);
export const orderDetailesSelectors = OrderAdapter.getSelectors(
  (state: RootState) => state.order.orderDetailes
);
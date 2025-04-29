import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {

    data: number;
    title: string;

}



const initialState: CounterState = {
    data: 42,
    title: 'With redux tool kit'
}




export const counterSlices = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            state.data += action.payload
        },
            decrement: (state, action) => {
                state.data -= action.payload
            }
    }

})


export const { increment, decrement } = counterSlices.actions;





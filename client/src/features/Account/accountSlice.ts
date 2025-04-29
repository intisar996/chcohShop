import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/User";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { Register } from "../../app/models/Register";
import { setBasket } from "../Basket/BasketSlice";


interface AccountState {
    user: User | null;
    status: string;

}

const initialState :AccountState = {
    user: null,
   status: 'idle',

}




export const SignInAsync = createAsyncThunk<User, FieldValues >(

    'User/SignInAsync',

    async (data, thunkAPI) => {

        try {

            const userDto = await agent.Account.login(data);
            const { basket, ...user } = userDto.data
            if (basket) thunkAPI.dispatch(setBasket(basket))

            // to store token in browser and save even we refresh page
            localStorage.setItem('user', JSON.stringify({ data: user }));
            return { data: user };

        }
        catch(error: any)
        {
            return thunkAPI.rejectWithValue({ error : error.data});
        }
    }


)


export const GoogleSignIn = createAsyncThunk<User, string>(

    'User/GoogleSignIn',

    async (idToken, thunkAPI) => {

        
        try {
            const UserDto = await agent.Account.googleLogin({ idToken });
            const { basket, ...user } = UserDto.data 
            if (basket) thunkAPI.dispatch(setBasket(basket))
            // to store token in browser and save even we refresh page
            localStorage.setItem('user', JSON.stringify({ data: user }));
            return { data: user };

        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)



export const  fetchCurrentAsync = createAsyncThunk<User>(

    'User/fetchCurrentAsync',

    async (_,thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));

        try {

            const userDto = await agent.Account.currentUser();
            const { basket, ...user } = userDto.data;
            if (basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify({ data: user }));
            // console.log("current user", user);
            return { data: user };

        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    },

    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }


)



export const RegisterAsync = createAsyncThunk<Register, FieldValues>(
    'User/RegisterAsync',

    async (data, thunkAPI) => {

        try {

            return await agent.Account.register(data);

        } catch (error: any) {

            return thunkAPI.rejectWithValue({error: error.data});
        }

    }
)





export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        },
        setUser: (state, action) => {
            const claims = JSON.parse(atob(action.payload.data.token.split('.')[1]));
            const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = { ...action.payload, roles: typeof (roles) === 'string' ? [roles] : roles };
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentAsync.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again');
            signOut();
            router.navigate('/');
        })

        builder.addCase(GoogleSignIn.pending, (state) => {
            state.status = 'pendingGoogleSignIn';
        })
        builder.addCase(GoogleSignIn.fulfilled, (state, action) => {
            state.user = action.payload;
            //console.log("GoogleSignInfulfilled", action.payload);
            toast.success('login successful');
        })
        builder.addCase(GoogleSignIn.rejected, (state, action) => {
            // console.log("GoogleSignInaction.payload",action.payload);
            state.status = 'idle';

        })
        builder.addCase(fetchCurrentAsync.fulfilled, (state, action) => {
            const claims = JSON.parse(atob(action.payload.data.token.split('.')[1]));
            const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = { ...action.payload, roles: typeof (roles) === 'string' ? [roles] : roles };
        })

        // هنا ما سوينا لودر لانه رياكت هوك فورم فيها كل شي


        builder.addMatcher(isAnyOf(SignInAsync.fulfilled), (state, action) => {
            const claims = JSON.parse(atob(action.payload.data.token.split('.')[1]));
            const roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = { ...action.payload, roles: typeof (roles) === 'string' ? [roles] : roles };
        })

        builder.addMatcher(isAnyOf(SignInAsync.rejected, fetchCurrentAsync.rejected,RegisterAsync.rejected), (_, action) => {
            throw action.payload;
        })

       

    })
})




export const { signOut, setUser } = accountSlice.actions;




import {createSlice} from '@reduxjs/toolkit'

const initialState= {
    status:false,
    userData : null
}
export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        // inside reducer all these functions are actions
        loginUser: (state,action) => {
         state.status = true;
         state.userData = action.payload;

        },
        logoutUser:(state)=> {
            state.status = false,
            state.userData = null
        } 
    }
})


export default authSlice.reducer;

export const {loginUser,logoutUser}=  authSlice.actions;

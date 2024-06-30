import {createSlice} from '@reduxjs/toolkit'


const initialState= {
    status:false,
    adminData : null
}
export const adminSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {
        // inside reducer all these functions are actions
        loginAdmin: (state,action) => {
         state.status = true;
         state.adminData = action.payload;

        },
        logoutAdmin:(state)=> {
            state.status = false,
            state.adminData = null
        } 
    }
})


export default adminSlice.reducer;

export const {loginAdmin,logoutAdmin}=  adminSlice.actions;

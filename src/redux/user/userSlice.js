import { createSlice } from '@reduxjs/toolkit'

const userSlice=createSlice({
    name:"user",
    initialState:{
      currentUser:null,
      error:null,
      loading:false
    },
    reducers:{
       signInStart:(state)=>{
          state.loading=true
       },
       signInSuccess:(state,action)=>{
          state.currentUser=action.payload;
          state.error=null;
          state.loading=false;
       },
       signInFailure:(state,action)=>{
        state.error=action.payload;
        state.loading=false;
       },
       deleteUsersuccess:(state)=>{
         state.currentUser=null;
         state.error=null;
         state.loading=false;
       },
       signOut:(state)=>{
         state.currentUser=null;
         state.error=null;
         state.loading=false;
       }
    }
})

export default userSlice.reducer;
export const {signInStart,signInSuccess,signInFailure,deleteUsersuccess,signOut}=userSlice.actions;
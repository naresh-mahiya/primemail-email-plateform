import {createSlice} from '@reduxjs/toolkit'
const appSlice=createSlice({
    name:"app",
    initialState:{
        open:false,
        user:null,
        inboxEmails:[],
        sentEmails:[],
        selectedEmail:null,
        searchText:""
    },
    reducers:{
        //actions
        setOpen:(state,action)=>{
            state.open=action.payload;
        },
        setAuthUser:(state,action)=>{
            state.user=action.payload;
        },
        setSentEmails:(state,action)=>{
            state.sentEmails=action.payload;
        },
        setInboxEmails:(state,action)=>{
            state.inboxEmails=action.payload;
        },
        setSelectedEmail:(state,action)=>{
            state.selectedEmail=action.payload;
        },
        setSearchText:(state,action)=>{
            state.searchText=action.payload
        }
    }
})
//createSlice returns what???
export const {setOpen,setAuthUser,setInboxEmails,setSentEmails,setSelectedEmail,setSearchText}=appSlice.actions
export default appSlice.reducer;
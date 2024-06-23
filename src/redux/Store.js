import { configureStore,combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducers=combineReducers({user:userReducer});//combine all reducers
const persistConfig={
    key:'root',
    storage,
    version:1
}//root reducers stored in localstorage with key "root"
const persistedReducer=persistReducer(persistConfig,rootReducers);


export const store=configureStore({
    reducer:persistedReducer
});

export const persistor=persistStore(store);
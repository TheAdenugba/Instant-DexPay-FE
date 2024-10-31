import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import addressSlice from './slices/addressSlice';
import traderSlice from './slices/traderSlice';
import countrySlice from './slices/countrySlice';

const rootReducer = combineReducers({
    userReducer: userSlice,
    addressReducer: addressSlice,
    tradeReducer: traderSlice,
    countryReducer: countrySlice,
});
export const store = () => {
    return configureStore({
        reducer: rootReducer,
    })
}

// export type RootState = ReturnType<typeof rootReducer>;
// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']


// export type RootState = ReturnType<typeof rootReducer>;
// export type AppStore = ReturnType<typeof store>;
// export type AppDispatch = AppStore["dispatch"];
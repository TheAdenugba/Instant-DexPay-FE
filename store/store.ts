import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use local storage
import userSlice from './slices/userSlice'
import addressSlice from './slices/addressSlice';
import traderSlice from './slices/traderSlice';
import countrySlice from './slices/countrySlice';

const persistConfig = {
    key: 'root',
    storage,
};
const rootReducer = combineReducers({
    userReducer: userSlice,
    addressReducer: addressSlice,
    tradeReducer: traderSlice,
    countryReducer: countrySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
})


// export type RootState = ReturnType<typeof rootReducer>;
// Infer the type of makeStore
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof rootReducer>;
// export type AppStore = ReturnType<typeof store>;
// export type AppDispatch = AppStore["dispatch"];
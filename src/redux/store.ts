
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";


import accountSlice from "./slices/account";


const rootReducer = combineReducers({
  // posts: postsSlice,
 
  // users: userSlice,
  account: accountSlice,
  
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredPaths: [],
      },
    }).concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

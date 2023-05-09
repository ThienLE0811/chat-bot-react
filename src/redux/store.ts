import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import storiesSlice from "./slices/stories";
import accountSlice from "./slices/account";

const rootReducer = combineReducers({
  // posts: postsSlice,

  stories: storiesSlice,
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

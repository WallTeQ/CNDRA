import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import authReducer from "./slices/auth/authSlice";
import recordReducer from "./slices/records/recordsSlice";

const appReducer = combineReducers({
  auth: authReducer,
  records: recordReducer,

});

// Handle logout to clear persisted state
const rootReducer = (state: any, action: any) => {
  if (
    action.type === "auth/logout/fulfilled" ||
    action.type === "USER_FORCE_LOGOUT"
  ) {
    storage.removeItem("persist:root");
    state = undefined;
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  // Optional: only persist specific slices
  whitelist: ["auth"], // Only persist auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
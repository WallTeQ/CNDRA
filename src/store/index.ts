import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "./slices/auth/authSlice";
import documentsReducer from "./slices/document/documentSlice";
import uiReducer from "./slices/ui/uiSlice";
import recordReducer from "./slices/records/recordsSlice"
import departmentsReducer from "./slices/depatments/departmentSlice"
import collectionReducer from "./slices/collections/collectionSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentsReducer,
    ui: uiReducer,
    records: recordReducer,
    departments: departmentsReducer,
    collections: collectionReducer,
    

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

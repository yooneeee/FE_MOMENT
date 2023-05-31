import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/es/storage/session";
import user from "../modules/user";

const reducers = combineReducers({
  user: user,
});
const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["user"],
};
const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;

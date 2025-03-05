import { configureStore } from '@reduxjs/toolkit';
import scanResultsReducer from './features/scanResults/scanResultsSlice';

export const store = configureStore({
  reducer: {
    scanResults: scanResultsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
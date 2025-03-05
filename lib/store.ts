import { configureStore } from '@reduxjs/toolkit';
import foodItemsReducer from './features/foodItems/foodItemsSlice';

export const store = configureStore({
  reducer: {
    foodItems: foodItemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
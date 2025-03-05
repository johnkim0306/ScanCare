import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FoodItem {
  name: string;
  expiry: number;
}

interface Recipe {
  name: string;
  image: string;
  category: string;
  description: string;
  instructions: string;
}

interface FoodItemsState {
  items: FoodItem[];
  recipes: Recipe[];
}

const initialState: FoodItemsState = {
  items: [],
  recipes: [],
};

const foodItemsSlice = createSlice({
  name: 'foodItems',
  initialState,
  reducers: {
    setFoodItems(state, action: PayloadAction<FoodItem[]>) {
      const newItems = action.payload.filter(
        (item) => !state.items.some((existingItem) => existingItem.name === item.name)
      );
      state.items = [...state.items, ...newItems];
    },
    addFoodItem(state, action: PayloadAction<FoodItem>) {
      if (!state.items.some((item) => item.name === action.payload.name)) {
        state.items.push(action.payload);
      }
    },
    removeFoodItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.name !== action.payload);
    },
    setRecipes(state, action: PayloadAction<Recipe[]>) {
      state.recipes = action.payload;
    },
  },
});

export const { setFoodItems, addFoodItem, removeFoodItem, setRecipes } = foodItemsSlice.actions;
export default foodItemsSlice.reducer;

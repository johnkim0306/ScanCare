"use client";

import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { setRecipes } from '@/lib/features/foodItems/foodItemsSlice';
import UserInput from "@/components/UserInput";
import { useQuery } from '@tanstack/react-query';

interface Recipe {
  name: string;
  image: string;
  category: string;
  description: string;
  instructions: string;
}

const fetchRecipes = async (foodItems: string[]): Promise<Recipe[]> => {
  const response = await fetch("/api/find-recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ foodItems }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log("API Response:", result);
  return result.recipes;
};

const MainPage: React.FC = () => {
  const foodItems = useSelector((state: RootState) => state.foodItems.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const shelves = useMemo(() => {
    const newShelves = [];
    for (let i = 0; i < foodItems.length; i += 4) {
      newShelves.push(foodItems.slice(i, i + 4).map(item => item.name));
    }
    return newShelves;
  }, [foodItems]);

  const { data: recipes, error, isLoading, refetch } = useQuery({
    queryKey: ['recipes', foodItems.join(',')], 
    queryFn: () => fetchRecipes(foodItems.map(item => item.name)),  
    enabled: false, // Disable automatic fetching
  });

  // Handle side effects after the query succeeds
  useEffect(() => {
    if (recipes) {
      console.log("Recipes fetched successfully. Storing in Redux...");
      dispatch(setRecipes(recipes)); // Store recipes in Redux
      console.log("Recipes stored in Redux. Navigating to /find-recipes...");
      router.push('/find-recipes'); // Navigate to /find-recipes
    }
  }, [recipes, dispatch, router]);

  const handleFindRecipes = () => {
    console.log("Find Recipes button clicked. Fetching recipes...");
    refetch(); // Manually trigger the query
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return (
    <div>
      Error fetching recipes: {error.message}
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-start justify-center bg-gray-100 p-4 gap-8 mt-16">
        <div className="shelf-container w-full p-4">
          <h1 className="text-3xl font-bold mb-16">Food Shelf</h1>
          {shelves.map((shelf, index) => (
            <div key={index} className="shelf mt-16 mb-16">
              <div className="books grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8">
                {shelf.map((item, idx) => (
                  <div key={idx} className="food-item bg-green-200 p-4 m-4 rounded flex flex-col items-center">
                    <img src={`/images/${item}.jpg`} alt={item} className="w-24 h-24 object-cover mb-2" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleFindRecipes}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
            disabled={foodItems.length === 0}
            title={foodItems.length === 0 ? "Add food items to find recipes" : ""}
          >
            Find Recipes
          </button>
        </div>
        <div className="flex flex-row items-start gap-4">
          <UserInput />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
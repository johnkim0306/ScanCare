"use client";

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import RecipeCard from '@/components/RecipeCard';

interface Recipe {
  name: string;
  image: string;
  category: string;
  description: string;
  instructions: string;
}

const FindRecipesPage: React.FC = () => {
  const recipes = useSelector((state: RootState) => state.foodItems.recipes);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-16 mb-16">Top 5 Budget-Friendly Recipes</h1>
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              name={recipe.name}
              image={recipe.image}
              category={recipe.category}
              description={recipe.description}
              instructions={recipe.instructions}
            />
          ))}
        </div>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
};

export default FindRecipesPage;

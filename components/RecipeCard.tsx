import React from 'react';

interface Recipe {
  name: string;
  image: string;
  category: string;
  description: string;
  instructions: string;
}

const RecipeCard: React.FC<Recipe> = ({ name, image, category, description, instructions }) => {
  const imageUrl = image === "haracter(0" ? "/images/banana.jpg" : image;

  return (
    <div className="recipe-card bg-white shadow-md rounded-lg p-4 m-4 w-full max-w-md">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover rounded-t-lg" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600 mb-2"><strong>Category:</strong> {category}</p>
        <p className="text-gray-600 mb-2"><strong>Description:</strong> {description}</p>
        <p className="text-gray-600"><strong>Instructions:</strong> {instructions}</p>
      </div>
    </div>
  );
};

export default RecipeCard;

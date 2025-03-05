import pandas as pd
import joblib
import ast
import sys
import json
import os

data_path = os.path.join(os.path.dirname(__file__), 'preprocessed_data.pkl')
data = joblib.load(data_path)
ingredients_of_interest = ['tofu', 'soy sauce', 'garlic', 'onions', 'cardamom']  # Example ingredients

model_path = os.path.join(os.path.dirname(__file__), 'food_recommendation_model.pkl')
model = joblib.load(model_path)

# Function to recommend recipes based on ingredients
def recommend_recipes(user_ingredients):
    user_input_features = pd.DataFrame([1 if ingredient in user_ingredients else 0 for ingredient in ingredients_of_interest]).T
    user_input_features.columns = ingredients_of_interest
    
    predicted_categories = model.predict(user_input_features)
    
    # Get the top 5 recipes that match the predicted categories
    recommended_recipes = data[data['RecipeCategory'].isin(predicted_categories)].head(5)
    
    recipes = []
    for _, recipe in recommended_recipes.iterrows():
        # Correctly format the image URLs
        images = recipe['Images'].strip('c("').strip('")').split('", "')
        recommended_image = images[0] if images else ""
        
        # Clean up and format the recipe instructions
        instructions = recipe['RecipeInstructions'].strip('c("').strip('")').split('", "')
        formatted_instructions = " ".join([f"{i+1}. {instruction}" for i, instruction in enumerate(instructions)])
        
        recipes.append({
            "name": recipe['Name'],
            "image": recommended_image,
            "category": recipe['RecipeCategory'],
            "description": recipe['Description'],
            "instructions": formatted_instructions
        })
    
    return recipes

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_ingredients = json.loads(sys.argv[1])
    else:
        # Provide default ingredients for testing
        user_ingredients = ['tofu', 'soy sauce', 'garlic']
    
    recipes = recommend_recipes(user_ingredients)
    print(json.dumps({"recipes": recipes}))

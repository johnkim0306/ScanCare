import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import ast

# Load data
data = pd.read_csv('recipes.csv')

# Convert RecipeIngredientParts to list
def parse_ingredients(ingredient_string):
    try:
        return ast.literal_eval(ingredient_string)
    except:
        return []

# Apply to the dataset
data['IngredientsList'] = data['RecipeIngredientParts'].apply(parse_ingredients)

# Save the preprocessed data
preprocessed_data_path = '/home/john_kim/nofoodwaste/python_env/preprocessed_data.pkl'
joblib.dump(data, preprocessed_data_path)

# Define features of interest
ingredients_of_interest = ['tofu', 'soy sauce', 'garlic', 'onions', 'cardamom']  # Example ingredients

# Create binary columns for the presence of each ingredient
for ingredient in ingredients_of_interest:
    data[ingredient] = data['IngredientsList'].apply(lambda x: 1 if ingredient in x else 0)

# Ensure the 'RecipeCategory' column exists
if 'RecipeCategory' not in data.columns:
    raise KeyError("The 'RecipeCategory' column is missing from the dataset")

# Handle NaN values
data = data.dropna(subset=ingredients_of_interest + ['RecipeCategory'])

# Define features and labels
features = data[ingredients_of_interest]  # The binary features
labels = data['RecipeCategory']  # Example target label

# Split into training and testing sets
train_data, test_data = train_test_split(data, test_size=0.2, random_state=42)

# Train a model
model = RandomForestClassifier()
model.fit(train_data[ingredients_of_interest], train_data['RecipeCategory'])

# Save the model
model_path = '/home/john_kim/nofoodwaste/python_env/food_recommendation_model.pkl'
joblib.dump(model, model_path)

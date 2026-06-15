import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error, root_mean_squared_error

# Beginner Note: This script trains our Machine Learning model.
# It uses the data generated previously to learn patterns (e.g. rain = higher price).

def train_and_save_model():
    print("Starting Model Training Process...")
    
    # 1. Load the dataset (Pandas)
    file_path = os.path.join(os.path.dirname(__file__), 'ride_data.csv')
    if not os.path.exists(file_path):
        print("Error: ride_data.csv not found. Please run generate_data.py first.")
        return
        
    df = pd.read_csv(file_path)
    print(f"Loaded {len(df)} rows of data.")
    
    # 2. Separate Features (Input) and Target (Output)
    # Features (X) are the things we know: demand, supply, time, traffic, weather
    X = df[['demand', 'supply', 'time', 'traffic', 'weather']]
    
    # Target (y) is what we want to predict: surge
    y = df['surge']
    
    # 3. Convert categories (One-Hot Encoding)
    # Machine learning models only understand numbers.
    # 'morning', 'rainy' are words. We use OneHotEncoder to turn them into numbers (0s and 1s).
    categorical_features = ['time', 'traffic', 'weather']
    
    # ColumnTransformer applies the OneHotEncoder only to our categorical columns
    # and passes through the numerical columns ('demand', 'supply') untouched.
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough'
    )
    
    # 4. Split data (train/test)
    # We use 80% of data to train the model, and keep 20% hidden to test how well it learned.
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 5. Build the pipeline and train model (RandomForest)
    # We combine the preprocessor (encoding) and the model into one "Pipeline".
    # This makes it super easy to use later because the pipeline handles the encoding automatically.
    from sklearn.pipeline import Pipeline
    
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    print("Training the Random Forest model...")
    # This is where the actual learning happens!
    model_pipeline.fit(X_train, y_train)
    
    # 6. Evaluate
    # Let's see how well it did on the 20% test data we hid from it.
    predictions = model_pipeline.predict(X_test)
    
    mae = mean_absolute_error(y_test, predictions)
    rmse = root_mean_squared_error(y_test, predictions)
    
    print("\nEvaluation Results:")
    print(f"   Mean Absolute Error (MAE): {mae:.4f} (Average mistake in surge multiplier)")
    print(f"   Root Mean Squared Error (RMSE): {rmse:.4f}")
    
    # 7. Save model (model.pkl)
    # We save the entire pipeline so it remembers how to encode AND predict.
    model_save_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    joblib.dump(model_pipeline, model_save_path)
    
    print(f"\nModel successfully saved to: {model_save_path}")

if __name__ == '__main__':
    train_and_save_model()

import pandas as pd
import numpy as np
import random
import os

# Beginner Note: This script generates fake historical ride data to train our Machine Learning model.
# In a real company like Uber, this data would come from the database over years of operation.

def generate_data(num_rows=1000):
    np.random.seed(42) # Set seed so we get the same random data every time
    random.seed(42)

    data = []
    
    times = ['morning', 'afternoon', 'evening', 'night']
    traffics = ['low', 'medium', 'high']
    weathers = ['clear', 'rainy', 'storm', 'snow']
    
    for _ in range(num_rows):
        # 1. Generate random base inputs
        demand = random.randint(30, 300) # Number of people looking for cabs
        supply = random.randint(10, 200) # Number of cabs available
        time_of_day = random.choice(times)
        traffic_level = random.choice(traffics)
        weather = random.choice(weathers)
        
        # 2. Start with a base surge of 1.0 (no surge)
        surge = 1.0
        
        # 3. Apply business logic rules to simulate real-world pricing
        
        # Rule 1: High Demand + Low Supply = High Surge
        ratio = demand / (supply + 1) # Add 1 to avoid division by zero
        if ratio > 2:
            surge += 0.5
        elif ratio > 1:
            surge += 0.2
        else:
            surge -= 0.1 # Discount if supply is much higher than demand
            
        # Rule 2: Weather conditions
        if weather == 'storm' or weather == 'snow':
            surge += 0.4
        elif weather == 'rainy':
            surge += 0.2
            
        # Rule 3: Traffic conditions
        if traffic_level == 'high':
            surge += 0.3
        elif traffic_level == 'medium':
            surge += 0.1
            
        # Rule 4: Time of day (Night usually has fewer drivers, evening is peak)
        if time_of_day == 'night':
            surge += 0.3
        elif time_of_day == 'evening':
            surge += 0.2
            
        # 4. Add a little bit of random noise (because real life isn't perfect)
        surge += random.uniform(-0.1, 0.1)
        
        # Ensure surge is never below 1.0 (we don't go below base price)
        surge = max(1.0, round(surge, 2))
        
        # 5. Append to our dataset
        data.append({
            'demand': demand,
            'supply': supply,
            'time': time_of_day,
            'traffic': traffic_level,
            'weather': weather,
            'surge': surge
        })
        
    # Convert list of dictionaries to a Pandas DataFrame
    df = pd.DataFrame(data)
    
    # Save the dataframe to a CSV file
    # We save it in the current directory (ml_model folder)
    file_path = os.path.join(os.path.dirname(__file__), 'ride_data.csv')
    df.to_csv(file_path, index=False)
    print(f"Generated {num_rows} rows of sample data and saved to {file_path}")

if __name__ == '__main__':
    generate_data(1500) # Generate 1500 rows

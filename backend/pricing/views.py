from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import RideRequest
from .serializers import RideRequestSerializer
import joblib
import pandas as pd
import os
import random

# Load ML model once when the server starts
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml_model', 'model.pkl')
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("ML Model loaded successfully!")
    else:
        print("Warning: model.pkl not found. Please train the model first.")
except Exception as e:
    print(f"Error loading model: {e}")

@api_view(['POST'])
def predict_price(request):
    """
    This is the 'V' (View) in MVT.
    It takes user input, passes it to the ML model, and saves the result to the DB.
    """
    data = request.data
    
    try:
        # 1. Extract data from request
        demand = int(data.get('demand', 0))
        supply = int(data.get('supply', 0))
        time_of_day = data.get('time_of_day', 'morning')
        traffic_level = data.get('traffic_level', 'low')
        weather = data.get('weather', 'clear')
        pickup = data.get('pickup', 'Unknown')
        drop = data.get('drop', 'Unknown')
        
        # 2. Dynamic Base Price Calculation
        # In a real app, distance API (Google Maps) would give this. 
        # We will simulate it here based on length of strings + some randomness for demo.
        distance_km = max(5, abs(len(pickup) - len(drop)) * 2 + random.randint(1, 10))
        base_price_per_km = 12 # Rs 12 per km
        base_price = distance_km * base_price_per_km
        
        surge_multiplier = 1.0
        
        # 3. Use ML Model for prediction
        if model:
            # Create a dataframe from input because our pipeline expects a dataframe
            input_df = pd.DataFrame([{
                'demand': demand,
                'supply': supply,
                'time': time_of_day,
                'traffic': traffic_level,
                'weather': weather
            }])
            
            surge_multiplier = float(model.predict(input_df)[0])
            # Ensure surge isn't completely unreasonable
            surge_multiplier = max(1.0, round(surge_multiplier, 2))
        else:
            # Fallback if model isn't loaded
            if demand > supply:
                surge_multiplier = 1.5
            
        # 4. Calculate Final Price
        final_price = round(base_price * surge_multiplier, 2)
        
        # 5. Save to Database (MVT Flow)
        ride_request = RideRequest.objects.create(
            pickup=pickup,
            drop=drop,
            demand=demand,
            supply=supply,
            time_of_day=time_of_day,
            traffic_level=traffic_level,
            weather=weather,
            base_price=base_price,
            surge_multiplier=surge_multiplier,
            predicted_price=final_price
        )
        
        # 6. Return Response to Frontend
        serializer = RideRequestSerializer(ride_request)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
def get_history(request):
    """
    Returns past predictions for the Analytics Dashboard.
    """
    # Get last 50 requests, ordered by newest first
    requests = RideRequest.objects.all().order_by('-timestamp')[:50]
    serializer = RideRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_history(request):
    """
    Returns past predictions for the Analytics Dashboard.
    """
    # Get last 50 requests, ordered by newest first
    requests = RideRequest.objects.all().order_by('-timestamp')[:50]
    serializer = RideRequestSerializer(requests, many=True)
    return Response(serializer.data)S

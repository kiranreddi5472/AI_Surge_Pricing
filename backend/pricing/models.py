from django.db import models

class RideRequest(models.Model):
    # This is the 'M' in MVT - It represents our database table
    pickup = models.CharField(max_length=255)
    drop = models.CharField(max_length=255)
    demand = models.IntegerField()
    supply = models.IntegerField()
    
    # Categorical fields
    time_of_day = models.CharField(max_length=50)
    traffic_level = models.CharField(max_length=50)
    weather = models.CharField(max_length=50)
    
    # Output fields (predicted by our ML model)
    predicted_price = models.FloatField(null=True, blank=True)
    surge_multiplier = models.FloatField(null=True, blank=True)
    base_price = models.FloatField(null=True, blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pickup} to {self.drop} at {self.timestamp}"

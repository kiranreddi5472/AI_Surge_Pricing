from django.urls import path
from . import views

urlpatterns = [
    path('predict-price/', views.predict_price, name='predict_price'),
    path('history/', views.get_history, name='get_history'),
]

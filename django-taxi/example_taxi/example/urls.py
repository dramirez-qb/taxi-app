from django.urls import path, re_path
from .apis import TripView

urlpatterns = [
    path('', TripView.as_view({'get': 'list'}), name='trip_list'),
    re_path(r'(?P<trip_nk>\w{32})/', TripView.as_view({'get': 'retrieve'}), name='trip_detail'),
]

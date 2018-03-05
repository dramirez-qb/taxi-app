from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from .auth import TokenAuthMiddleware
from trip.consumers import TaxiConsumer

application = ProtocolTypeRouter({
    'websocket': TokenAuthMiddleware(
        URLRouter([
            path('taxi/', TaxiConsumer),
        ])
    )
})

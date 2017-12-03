from channels.generic.websockets import JsonWebsocketConsumer

from .serializers import TripSerializer


class TripConsumer(JsonWebsocketConsumer):
    def connect(self, message, **kwargs):
        self.message.reply_channel.send({'accept': True})


class DriverConsumer(TripConsumer):
    pass


class RiderConsumer(TripConsumer):
    def receive(self, content, **kwargs):
        # Create a new trip record.
        serializer = TripSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        trip = serializer.create(serializer.validated_data)

        # Broadcast the serialized trip data.
        self.send(content=TripSerializer(trip).data)

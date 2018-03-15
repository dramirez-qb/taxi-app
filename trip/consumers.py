import asyncio

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import Trip
from .serializers import TripSerializer


class TaxiConsumer(AsyncJsonWebsocketConsumer):

    def __init__(self, scope):
        super().__init__(scope)
        self.trips = set()

    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:
            await self.accept()
        channel_groups = []
        user_group = await self._get_user_group(self.scope['user'])
        if user_group == 'driver':
            channel_groups.append(self.channel_layer.group_add(group='drivers', channel=self.channel_name))
        self.trips = set(await self._get_trips(self.scope['user']))
        for trip in self.trips:
            channel_groups.append(self.channel_layer.group_add(group=trip, channel=self.channel_name))
        asyncio.gather(*channel_groups)

    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        if message_type == 'create.trip':
            await self.create_trip(content)
        elif message_type == 'update.trip':
            await self.update_trip(content)
        else:
            await self.echo_message(content)

    async def echo_message(self, event):
        await self.send_json(event)

    async def create_trip(self, event):
        trip = await self._create_trip(event.get('data'))
        trip_data = TripSerializer(trip).data
        await self.channel_layer.group_send(group='drivers', message=trip_data)
        if trip.nk not in self.trips:
            self.trips.add(trip.nk)
            await self.channel_layer.group_add(group=trip.nk, channel=self.channel_name)
        await self.send_json(trip_data)

    async def update_trip(self, event):
        trip = await self._update_trip(event.get('data'))
        trip_data = TripSerializer(trip).data
        await self.channel_layer.group_send(group=trip.nk, message=trip_data)
        if trip.nk not in self.trips:
            self.trips.add(trip.nk)
            await self.channel_layer.group_add(group=trip.nk, channel=self.channel_name)
        await self.send_json(trip_data)

    async def disconnect(self, code):
        channel_groups = [
            self.channel_layer.group_discard(group=trip, channel=self.channel_name)
            for trip in self.trips
        ]
        user_group = await self._get_user_group(self.scope['user'])
        if user_group == 'driver':
            channel_groups.append(
                self.channel_layer.group_discard(group='drivers', channel=self.channel_name)
            )
        asyncio.gather(*channel_groups)
        self.trips.clear()
        await super().disconnect(code)

    @database_sync_to_async
    def _create_trip(self, content):
        serializer = TripSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        trip = serializer.create(serializer.validated_data)
        return trip

    @database_sync_to_async
    def _get_trips(self, user):
        if not user.is_authenticated:
            raise Exception('User is not authenticated.')
        user_groups = user.groups.values_list('name', flat=True)
        if 'driver' in user_groups:
            return user.trips_as_driver.exclude(status=Trip.COMPLETED).only('nk').values_list('nk', flat=True)
        else:
            return user.trips_as_rider.exclude(status=Trip.COMPLETED).only('nk').values_list('nk', flat=True)

    @database_sync_to_async
    def _get_user_group(self, user):
        if not user.is_authenticated:
            raise Exception('User is not authenticated.')
        return user.groups.first().name

    @database_sync_to_async
    def _update_trip(self, content):
        instance = Trip.objects.get(nk=content.get('nk'))
        serializer = TripSerializer(data=content)
        serializer.is_valid(raise_exception=True)
        trip = serializer.update(instance, content)
        return trip

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
        user_group = await get_user_group(self.scope['user'])
        channel_groups = []
        if user_group == 'driver':
            channel_groups.append(self.channel_layer.group_add('drivers', self.channel_name))
        self.trips = set(await get_trips(self.scope['user']))
        for trip in self.trips:
            channel_groups.append(self.channel_layer.group_add(trip, self.channel_name))
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
        trip = await create_trip(event.get('data'))
        trip_data = TripSerializer(trip).data
        await self.channel_layer.group_send('drivers', trip_data)
        if trip.nk not in self.trips:
            self.trips.add(trip.nk)
            await self.channel_layer.group_add(trip.nk, self.channel_name)
        await self.send_json(trip_data)

    async def update_trip(self, event):
        trip = await update_trip(event.get('data'))
        trip_data = TripSerializer(trip).data
        await self.channel_layer.group_send(trip.nk, trip_data)
        if trip.nk not in self.trips:
            self.trips.add(trip.nk)
            await self.channel_layer.group_add(trip.nk, self.channel_name)
        await self.send_json(trip_data)

    async def disconnect(self, code):
        channel_groups = [
            self.channel_layer.group_discard(trip, self.channel_name)
            for trip in self.trips
        ]
        user_group = await get_user_group(self.scope['user'])
        if user_group == 'driver':
            channel_groups.append(
                self.channel_layer.group_discard('drivers', self.channel_name)
            )
        asyncio.gather(*channel_groups)
        self.trips.clear()
        await super().disconnect(code)


@database_sync_to_async
def get_trips(user):
    if not user.is_authenticated:
        raise Exception('User is not authenticated.')
    user_groups = user.groups.values_list('name', flat=True)
    if 'driver' in user_groups:
        return user.trips_as_driver.exclude(status=Trip.COMPLETED).only('nk').values_list('nk', flat=True)
    else:
        return user.trips_as_rider.exclude(status=Trip.COMPLETED).only('nk').values_list('nk', flat=True)


@database_sync_to_async
def get_trip_or_error(trip_nk, user):
    if not user.is_authenticated:
        raise Exception('User is not authenticated.')
    try:
        trip = Trip.objects.get(nk=trip_nk)
    except Trip.DoesNotExist:
        raise Exception('Trip does not exist.')
    return trip


@database_sync_to_async
def get_user_group(user):
    if not user.is_authenticated:
        raise Exception('User is not authenticated.')
    return user.groups.first().name


@database_sync_to_async
def create_trip(content):
    serializer = TripSerializer(data=content)
    serializer.is_valid(raise_exception=True)
    trip = serializer.create(serializer.validated_data)
    return trip


@database_sync_to_async
def update_trip(content):
    instance = Trip.objects.get(nk=content.get('nk'))
    serializer = TripSerializer(data=content)
    serializer.is_valid(raise_exception=True)
    trip = serializer.update(instance, content)
    return trip

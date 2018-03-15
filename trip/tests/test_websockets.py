from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db import IntegrityError
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.testing import WebsocketCommunicator
from nose.tools import assert_equal, assert_is_none, assert_is_not_none, assert_regexp_matches, assert_true
import pytest
from rest_framework.authtoken.models import Token
from trip.models import Trip
from trip.serializers import TripSerializer
from taxi.routing import application


@database_sync_to_async
def create_user_token(
    *,
    username='user@example.com',
    password='pAssw0rd!',
    group='rider'
):
    # Create user.
    try:
        user = get_user_model().objects.create_user(
            username=username,
            password=password
        )
    except IntegrityError:
        user = get_user_model().objects.get(username=username)

    # Create user group.
    user_group, _ = Group.objects.get_or_create(name=group)
    user.groups.add(user_group)
    user.save()

    # Create token.
    token, _ = Token.objects.get_or_create(user=user)
    return token


@database_sync_to_async
def create_trip(**kwargs):
    return Trip.objects.create(**kwargs)


async def auth_connect(token):
    headers = [('Authorization', f'Token {token.key}')]
    communicator = WebsocketCommunicator(
        application=application,
        path='/taxi/',
        headers=headers
    )
    connected, _ = await communicator.connect()
    assert_true(connected)
    return communicator


async def connect_and_create_trip(
    token,
    pick_up_address='A',
    drop_off_address='B'
):
    communicator = await auth_connect(token)
    await communicator.send_json_to({
        'type': 'create.trip',
        'data': {
            'pick_up_address': pick_up_address,
            'drop_off_address': drop_off_address,
            'rider': token.user.id,
        }
    })
    return communicator


async def connect_and_update_trip(token, trip, status):
    communicator = await auth_connect(token)
    await communicator.send_json_to({
        'type': 'update.trip',
        'data': {
            **TripSerializer(trip).data,
            'driver': token.user.id,
            'status': status,
        }
    })
    return communicator


@pytest.mark.asyncio
@pytest.mark.django_db
class TestWebsockets:

    @pytest.mark.skip('Temporary skip...')
    async def test_can_create_token(self):
        token = await create_user_token(
            username='rider@example.com',
            group='rider'
        )
        assert_regexp_matches(token.pk, r'[0-9a-f]{32}')
        assert_equal('rider@example.com', token.user.username)
        assert_equal('rider', token.user.group)

    @pytest.mark.skip('Temporary skip...')
    async def test_authorized_user_can_connect(self):
        token = await create_user_token(
            username='rider@example.com',
            group='rider'
        )
        communicator = await auth_connect(token)
        await communicator.disconnect()

    @pytest.mark.skip('Temporary skip...')
    async def test_rider_can_create_trips(self):
        token = await create_user_token(username='rider2@example.com', group='rider')
        communicator = await connect_and_create_trip(token)
        response = await communicator.receive_json_from()
        assert_is_not_none(response['id'])
        assert_is_not_none(response['nk'])
        assert_equal('A', response['pick_up_address'])
        assert_equal('B', response['drop_off_address'])
        assert_equal(Trip.REQUESTED, response['status'])
        assert_is_none(response['driver'])
        assert_equal(token.user.id, response['rider'])
        await communicator.disconnect()

    @pytest.mark.skip('Temporary skip...')
    async def test_rider_is_added_to_trip_group_on_create(self):
        token = await create_user_token(username='rider3@example.com', group='rider')
        communicator = await connect_and_create_trip(token)
        response = await communicator.receive_json_from()
        trip_nk = response['nk']
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send(group=trip_nk, message=message)
        response = await communicator.receive_json_from()
        assert_equal(message, response)
        await communicator.disconnect()

    @pytest.mark.skip('Temporary skip...')
    async def test_rider_is_added_to_trip_groups_on_connect(self):
        token = await create_user_token(username='rider3@example.com', group='rider')
        trip1 = await create_trip(pick_up_address='A', drop_off_address='B', rider=token.user)
        trip2 = await create_trip(pick_up_address='B', drop_off_address='C', rider=token.user)
        communicator = await auth_connect(token)
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send(group=trip1.nk, message=message)
        response = await communicator.receive_json_from()
        assert_equal(message, response)
        await channel_layer.group_send(group=trip2.nk, message=message)
        response = await communicator.receive_json_from()
        assert_equal(message, response)
        await communicator.disconnect()

    @pytest.mark.skip('Temporary skip...')
    async def test_driver_can_update_trips(self):
        trip = await create_trip(pick_up_address='A', drop_off_address='B')
        token = await create_user_token(username='driver1@example.com', group='driver')
        communicator = await connect_and_update_trip(token=token, trip=trip, status=Trip.IN_PROGRESS)
        response = await communicator.receive_json_from()
        assert_equal(trip.id, response['id'])
        assert_equal(trip.nk, response['nk'])
        assert_equal('A', response['pick_up_address'])
        assert_equal('B', response['drop_off_address'])
        assert_equal(Trip.IN_PROGRESS, response['status'])
        assert_equal(token.user.id, response['driver'])
        assert_equal(None, response['rider'])
        await communicator.disconnect()

    @pytest.mark.skip('Temporary skip...')
    async def test_driver_is_added_to_trip_group_on_update(self):
        trip = await create_trip(pick_up_address='A', drop_off_address='B')
        token = await create_user_token(username='driver@example.com', group='driver')
        communicator = await connect_and_update_trip(token=token, trip=trip, status=Trip.IN_PROGRESS)
        response = await communicator.receive_json_from()
        trip_nk = response['nk']
        message = {
            'type': 'echo.message',
            'data': 'This is a test message.'
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send(group=trip_nk, message=message)
        response = await communicator.receive_json_from()
        assert_equal(message, response)
        await communicator.disconnect()

    @pytest.mark.skip('Temporary skip...')
    async def test_driver_is_alerted_on_trip_create(self):
        channel_layer = get_channel_layer()
        await channel_layer.group_add(group='drivers', channel='test_channel')
        token = await create_user_token(username='rider2@example.com', group='rider')
        communicator = await connect_and_create_trip(token)
        response = await channel_layer.receive('test_channel')
        assert_is_not_none(response['nk'])
        assert_equal(token.user.id, response['rider'])
        await communicator.disconnect()

    @pytest.mark.skip('Temporary skip...')
    async def test_rider_is_alerted_on_trip_update(self):
        trip = await create_trip(pick_up_address='A', drop_off_address='B')
        channel_layer = get_channel_layer()
        await channel_layer.group_add(group=trip.nk, channel='test_channel')
        token = await create_user_token(username='driver3@example.com', group='driver')
        communicator = await connect_and_update_trip(token=token, trip=trip, status=Trip.IN_PROGRESS)
        response = await channel_layer.receive('test_channel')
        assert_equal(trip.nk, response['nk'])
        assert_equal(token.user.id, response['driver'])
        await communicator.disconnect()

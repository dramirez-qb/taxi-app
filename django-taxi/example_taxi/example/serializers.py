from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import serializers

from .models import Trip


class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    group = serializers.CharField()

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError('Passwords must match.')
        return data

    def create(self, validated_data):
        group_data = validated_data.pop('group')
        group, _ = Group.objects.get_or_create(name=group_data)
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
        user = self.Meta.model.objects.create_user(**data)
        user.groups.add(group)
        user.save()
        return user

    class Meta:
        model = get_user_model()
        fields = (
            'id', 'username', 'password1', 'password2', 'first_name',
            'last_name', 'group',
        )
        read_only_fields = ('id',)


class PrivateUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = list(UserSerializer.Meta.fields) + ['auth_token']


class ReadOnlyUserSerializer(serializers.ModelSerializer):
    # Without the validator, serialization will fail for users
    # that already exist.
    username = serializers.CharField(validators=[lambda value: value])
    group = serializers.CharField()

    def create(self, validated_data):
        raise NotImplementedError

    def update(self, instance, validated_data):
        raise NotImplementedError

    class Meta:
        model = get_user_model()
        fields = read_only_fields = (
            'id', 'username', 'first_name', 'last_name', 'group',
        )


class TripSerializer(serializers.ModelSerializer):
    rider = ReadOnlyUserSerializer(allow_null=True, required=False)
    driver = ReadOnlyUserSerializer(allow_null=True, required=False)

    def create(self, validated_data):
        data = validated_data.pop('rider', None)
        trip = super().create(validated_data)
        if data:
            trip.rider = \
                get_user_model().objects.get(username=data['username'])
        trip.save()
        return trip

    def update(self, instance, validated_data):
        data = validated_data.pop('driver', None)
        if data:
            instance.driver = \
                get_user_model().objects.get(username=data['username'])
        instance = super().update(instance, validated_data)
        return instance

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'nk', 'created', 'updated',)

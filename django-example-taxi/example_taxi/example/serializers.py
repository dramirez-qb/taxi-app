from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Trip


class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username',)


class PrivateUserSerializer(PublicUserSerializer):
    class Meta(PublicUserSerializer.Meta):
        fields = list(PublicUserSerializer.Meta.fields) + ['auth_token']


class TripSerializer(serializers.ModelSerializer):
    rider = PublicUserSerializer(allow_null=True, required=False)

    def create(self, validated_data):
        data = validated_data.pop('rider', None)
        trip = super().create(validated_data)
        if data:
            trip.rider = get_user_model().objects.get(**data)
        trip.save()
        return trip

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'nk', 'created', 'updated',)

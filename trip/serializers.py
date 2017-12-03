from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Trip


class PublicUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(validators=[lambda value: value])
    groups = serializers.SlugRelatedField(slug_field='name', many=True, read_only=True)

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'groups',)


class PrivateUserSerializer(PublicUserSerializer):
    class Meta(PublicUserSerializer.Meta):
        fields = list(PublicUserSerializer.Meta.fields) + ['auth_token']


class TripSerializer(serializers.ModelSerializer):
    driver = PublicUserSerializer(allow_null=True, required=False)
    rider = PublicUserSerializer(allow_null=True, required=False)

    def create(self, validated_data):
        data = validated_data.pop('rider', None)
        trip = super().create(validated_data)
        if data:
            trip.rider = get_user_model().objects.get(**data)
        trip.save()
        return trip

    def update(self, instance, validated_data):
        data = validated_data.pop('driver', None)
        if data:
            instance.driver = get_user_model().objects.get(**data)
        instance.nk = validated_data.get('nk', instance.nk)
        instance.pick_up_address = validated_data.get('pick_up_address', instance.pick_up_address)
        instance.drop_off_address = validated_data.get('drop_off_address', instance.drop_off_address)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'nk', 'created', 'updated',)

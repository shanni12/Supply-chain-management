from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from .models import Product, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('owner', 'product_name', 'product_quantity', 'product_details', 'is_available')

    def create(self, validated_data):
        print(validated_data)
        User.objects.get(validated_data['user'])


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user',)


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        profile = Profile(type_of_user=self.initial_data.get("type", "farmer"))
        if password is not None:
            instance.set_password(password)
            profile.user = instance
        instance.save()
        profile.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')
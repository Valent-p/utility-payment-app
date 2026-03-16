from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=6)

    class Meta:
        model = Customer
        fields = ['id', 'account_number', 'password', 'name', 'phone', 'address', 'meter_number', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password', ''))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)


from django.contrib.auth.models import User
from rest_framework import serializers 

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password' : {'write_only':True}
        }
        
    
    def create(self, validate_date):
        user = User.objects.create_user(
            username = validate_date['username'],
            email = validate_date['email'],
            password = validate_date['password']
        )
        return user
    
    
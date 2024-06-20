from rest_framework.serializers import ModelSerializer
from rest_framework  import serializers 
from user_auth.models import UserModel
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re 
import random
from datetime import datetime , timedelta
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


class UserSerializer(ModelSerializer):
    password1 = serializers.CharField(
        write_only = True,
        min_length = settings.MIN_PASSWORD_LENGTH,
        error_messages = {
            "min_length":"password must be longer than {} characters".format(
                settings.MIN_PASSWORD_LENGTH
            )
        }
    )

    password2 = serializers.CharField(
        write_only = True,
        min_length = settings.MIN_PASSWORD_LENGTH,
        error_messages = {
            "min_length":"password must be longer than {} characters".format(
                settings.MIN_PASSWORD_LENGTH
            )
        }
    )
    password_pattern = r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"

    
    
    class Meta:
        model = UserModel
        fields = (
            "id",
            "username",
            "email",
            "password1",
            "password2"
        )
        read_only_fields = ["id"]

    def validate(self , data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("passsword do not match")
        
        if not re.match(self.password_pattern, data["password1"]):
            raise serializers.ValidationError("password Must be strong")
        
        if len(data["username"])  < 3:
            raise serializers.ValidationError("Username must be 3 character")
        
        if len(data["username"]) > 20:
            raise serializers.ValidationError("Username cannot be more than 20 character")

        return data
    
    def create(self , validated_data):
        otp = random.randint(1000,9999)
        otp_expiry = datetime.now() + timedelta(minutes=5)
        user = UserModel(
            username = validated_data["username"],
            email = validated_data["email"],
            otp = otp,
            otp_expiry = otp_expiry,
            max_otp_try = settings.MAX_OTP_TRY
        )
        
        user.set_password(validated_data["password1"])
        user.save()
        username = validated_data["username"]
        email = validated_data["email"]
        subject = 'YOUR ACCOUNT VERIFICATION EMAIL'
        message = f'{otp}'
        email_from = settings.EMAIL_HOST_USER
        context ={
            "username":username,
            "otp_message":message
        }
        html_messages = render_to_string("email.html",context=context)
        plain_message = strip_tags(html_messages)
        message = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=email_from,
            to=[email]
        )
        message.attach_alternative(html_messages,"text/html")
        message.send()
        return user


class CustomerTokenObtainPairSerialzer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_admin'] =user.is_superuser
        token['id'] = user.id
        token['username'] = user.username
        token['email'] = user.email
        token['is_active'] = user.is_active
        return token
    
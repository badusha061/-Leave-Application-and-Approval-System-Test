from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings
# Create your models here.


class UserModel(AbstractUser):
    otp = models.CharField( max_length=6 , null = True)
    otp_expiry = models.DateTimeField(blank = True,null = True)
    max_otp_try = models.CharField(default = settings.MAX_OTP_TRY , max_length=2)
    otp_time_out = models.DateTimeField(blank = True,null = True)
    is_active = models.BooleanField(default= False)
    email = models.EmailField(unique=True)
    def __str__(self) -> str:
        return self.username
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set', 
        blank=True,
        help_text=('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        verbose_name=('groups')
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set_permissions',  
        blank=True,
        help_text=('Specific permissions for this user.'),
        verbose_name=('user permissions')
    )

    class Meta:
        db_table = "user_auth_usermodel"    
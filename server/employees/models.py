from django.db import models
from user_auth.models import UserModel
# Create your models here.


DEPARTMENT_CHOICES = ( 
    ("HR", "human resource"), 
    ("IT", "Information technology"), 
    ("FINANCE", "finance departments"), 
    ("OPM", "Operations Management"), 
    ("OTHERS", "Others"), 
)

TYPE_OF_LEAVE_CHOICES = ( 
    ("AL", "Annual Leave"), 
    ("SL", "Sick Leave"), 
    ("CL", "Casual Leave"), 
    ("ML", "Maternity Leave"), 
    ("PL", "Paternity Leave"), 
    ("MAL", "Marriage Leave"), 
    ("OTHERS", "Others"), 
)


class EmployeeLeave(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserModel , on_delete=models.CASCADE)
    department = models.CharField(max_length=50,choices=DEPARTMENT_CHOICES)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    type_of_leave = models.CharField(max_length=50,choices=TYPE_OF_LEAVE_CHOICES)
    reason = models.TextField()
    first_day_of_absence = models.DateField()
    last_day_of_absence = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    leave_approval = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.user.username
    

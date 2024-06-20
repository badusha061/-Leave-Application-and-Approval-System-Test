from employees.models import EmployeeLeave
from rest_framework.serializers import ModelSerializer
from user_auth.api.serializers import UserSerializer


class EmployeeLeaveSerializerList(ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = EmployeeLeave
        fields = ['id','user','department','phone','email','type_of_leave','reason','first_day_of_absence','last_day_of_absence','created_at','leave_approval']    





class EmployeeLeaveSerializer(ModelSerializer):
    class Meta:
        model = EmployeeLeave
        fields = ['id','user','department','phone','email','type_of_leave','reason','first_day_of_absence','last_day_of_absence','created_at']
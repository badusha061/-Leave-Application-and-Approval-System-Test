from .serializers import EmployeeLeaveSerializer , EmployeeLeaveSerializerList
from rest_framework.generics import ListCreateAPIView , CreateAPIView 
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from rest_framework.decorators import permission_classes
from employees.models import EmployeeLeave
from user_auth.models import UserModel
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q



# @permission_classes(IsAuthenticated)
class CreteEmployeeForm(CreateAPIView):
    serializer_class =  EmployeeLeaveSerializer
    queryset = EmployeeLeave.objects.all()



# @permission_classes(IsAdminUser)
class ListAllForm(ListCreateAPIView):
    serializer_class = EmployeeLeaveSerializerList
    queryset = EmployeeLeave.objects.all()


# @permission_classes(IsAuthenticated)
class ListIndivualEmployee(APIView):
    def get(self,*args,**kwargs):
        try:
            user_instance = UserModel.objects.get(id = self.kwargs['user_id'])
        except Exception as e:
            message = {
                "message":"User Not Found"
            }
            return Response(status=status.HTTP_400_BAD_REQUEST,data= message)

        try:
            employee_leave_instance = EmployeeLeave.objects.filter(user = user_instance)
        except Exception as e:
            message = {
                "message":"Employees Leave Form Not Found"
            }
            return Response(status=status.HTTP_400_BAD_REQUEST,data=message)
        print('the employee leave instance ', employee_leave_instance)
        serilzer_data = EmployeeLeaveSerializerList(employee_leave_instance,many=True)
        return Response(status=status.HTTP_200_OK,data=serilzer_data.data)



# @permission_classes(IsAdminUser)
class ApprovalLeaveForm(APIView):
    def put(self,*args,**kwargs):
        employee_leave_id = self.kwargs['id']
        try:
            employee_leave_instance = EmployeeLeave.objects.get(id = employee_leave_id)
        except Exception as e:
            message = {
                "message":"Employees Leave Form Not Found"
            }
            return Response(status=status.HTTP_400_BAD_REQUEST,data=message)
        employee_leave_instance.leave_approval = True
        employee_leave_instance.save()
        message = {
            "message":"Successfully Approved Leave"
        }
        return Response(data=message,status=status.HTTP_200_OK)
    


# @permission_classes([IsAuthenticated])
class TotalLeavesReport(APIView):
    def get(self,*args , **kwargs):
        leaves = EmployeeLeave.objects.values('user__username', 'type_of_leave').annotate(
            total_leaves=Count('id'),
            approved_leaves=Count('id', filter=Q(leave_approval=True)),
            pending_leaves=Count('id', filter=Q(leave_approval=False)),
        )
        response_data = {}
        for leave in leaves:
            username = leave['user__username']
            if username not in response_data:
                response_data[username] = {}
            leave_type = leave['type_of_leave']
            response_data[username][leave_type] = {
                'total': leave['total_leaves'],
                'approved': leave['approved_leaves'],
                'pending': leave['pending_leaves']
            }
        return Response(status=status.HTTP_200_OK,data=response_data)

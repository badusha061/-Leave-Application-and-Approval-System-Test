from django.urls import path
from .views import * 

urlpatterns = [
    path('create/',CreteEmployeeForm.as_view(), name='employee-form-list'),
    path('list/<int:user_id>/',ListIndivualEmployee.as_view(), name='list-employees'),
    path('manager-list/',ListAllForm.as_view(), name='list-all-leave'),
    path('approval/<int:id>/', ApprovalLeaveForm.as_view(), name='approval-leave'),
    path('totalleave/',TotalLeavesReport.as_view(), name='total-leaves')
]

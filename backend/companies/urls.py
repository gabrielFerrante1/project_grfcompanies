from django.urls import path

from .views.employees import Employees, EmployeeDetail, EmployeeGroupsDetail
from .views.groups import Groups, GroupsDetail
from .views.permissions import PermssionsDetail
from .views.tasks import Tasks, TaskDetail

urlpatterns = [
    # Employees Endpoints
    path('employees', Employees.as_view()),
    path('employees/<int:employee_id>', EmployeeDetail.as_view()),
    path('employees/<int:employee_id>/groups/<int:group_id>', EmployeeGroupsDetail.as_view()),

    # Groups Endpoints
    path('groups', Groups.as_view()),
    path('groups/<int:group_id>', GroupsDetail.as_view()),
    path('permissions', PermssionsDetail.as_view()),

    # Tasks Endpoints
    path('tasks', Tasks.as_view()),
    path('tasks/<int:task_id>', TaskDetail.as_view())
]

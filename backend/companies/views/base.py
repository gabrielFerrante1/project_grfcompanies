from rest_framework.views import APIView
from ..utils.exceptions import NotFoundEmployee, NotFoundGroup, NotFoundTaskStatus, NotFoundTask

from accounts.models import Group

from ..models import Employee, Enterprise, TaskStatus, Task

class Base(APIView):
    # Functions use in all class
    def get_enterprise_id(self, user_id) -> int:
        employee_enterprise = Employee.objects.filter(user_id=user_id).first()
        owner_enterprise = Enterprise.objects.filter(user_id=user_id).first()

        if employee_enterprise:
            return employee_enterprise.enterprise_id
        else:
            return owner_enterprise.id
 
    def get_employee(self, employee_id, user_id) -> Employee:
        enterprise_id = self.get_enterprise_id(user_id)

        employee = Employee.objects.filter(
            id=employee_id, enterprise_id=enterprise_id).first()

        if not employee or not enterprise_id:
            raise NotFoundEmployee

        return employee

    def get_group(self, group_id, enterprise_id) -> dict[str, str]: 
        try:
            group = Group.objects.values('name').filter(
                id=group_id, enterprise_id=enterprise_id).first()

            if not group:
                raise NotFoundGroup
        except:
            raise NotFoundGroup

        return group
    
    def get_status(self, status_id) -> TaskStatus:
        status = TaskStatus.objects.filter(id=status_id).first()

        if not status:
            raise NotFoundTaskStatus
        
        return status

    def get_task(self, task_id, enterprise_id):
        task = Task.objects.filter(id=task_id, enterprise_id=enterprise_id).first()

        if not task:
            raise NotFoundTask
        
        return task

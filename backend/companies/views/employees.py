# Base
from .base import Base

from rest_framework.views import Response, status
from rest_framework.exceptions import APIException

from ..utils.permissions import EmployeesPermission, GroupsPermission

from ..models import Employee, Enterprise

from accounts.auth import Authentication
from accounts.models import User, User_Groups

from ..serializers import EmployeesSerializer, EmployeeSerializer
 
class Employees(Base):
    permission_classes = [EmployeesPermission]

    def get(self, request):
        enterprise_id = self.get_enterprise_id(request.user.id)

        # Get owner of enterprise
        owner_id = Enterprise.objects.values('user_id').filter(
            id=enterprise_id).first()['user_id']

        employees = Employee.objects.filter(enterprise_id=enterprise_id) \
            .exclude(user_id=owner_id).all()

        serializer = EmployeesSerializer(employees, many=True)

        return Response({"employees": serializer.data})

    def post(self, request): 
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password') 
      
        enterprise_id = self.get_enterprise_id(request.user.id)
        signup_user = Authentication.signup(
            self,
            name=name,
            email=email,
            password=password,
            type_account='employee',
            company_id=enterprise_id
        )
 
        if isinstance(signup_user, User):
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        else:
            return Response(signup_user, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetail(Base):
    permission_classes = [EmployeesPermission]

    def get(self, request, employee_id):
        employee = self.get_employee(employee_id, request.user.id)

        serializer = EmployeeSerializer(employee)

        return Response(serializer.data)
    
    def put(self, request, employee_id):
        groups =  request.data.get('groups')

        employee  = self.get_employee(employee_id, request.user.id) 

        name =  request.data.get('name') or employee.user.name
        email = request.data.get('email') or employee.user.email
     
        if email != employee.user.email and User.objects.filter(email=email).exists():
            raise APIException("Esse email já está em uso", code="email_already_use")

        User.objects.filter(id=employee.user.id).update(
            name=name,
            email=email
        )

        User_Groups.objects.filter(user_id=employee.user.id).delete()

        if groups:
            groups = groups.split(',') 

            for group_id in groups:
                self.get_group(group_id, employee.enterprise.id)
                User_Groups.objects.create(
                    group_id=group_id,
                    user_id=employee.user.id
                )

        return Response({"success": True})

    def delete(self, request, employee_id):
        employee = self.get_employee(employee_id, request.user.id)
 
        check_if_owner = User.objects.filter(
            id=employee.user.id, is_owner=1).exists()
        if check_if_owner:
            raise APIException('Você não pode demitir o dono da empresa')

        employee.delete()

        User.objects.filter(id=employee.user.id).delete()

        return Response({'success': True})


class EmployeeGroupsDetail(Base):
    permission_classes = [GroupsPermission]

    """def post(self, request, employee_id, group_id):
        # Check employee_id
        self.get_employee(employee_id, request.user.id)

        enterprise_id = self.get_enterprise_id(employee_id)
        self.get_group(group_id, enterprise_id)

        if not User_Groups.objects.filter(group_id=group_id, user_id=employee_id).exists():
            User_Groups.objects.create(
                group_id=group_id,
                user_id=employee_id,
            )

        return Response({"success": True})

    def delete(self, request, employee_id, group_id):
        # Check employee_id
        self.get_employee(employee_id, request.user.id)

        enterprise_id = self.get_enterprise_id(employee_id)
        self.get_group(group_id, enterprise_id)

        user_group = User_Groups.objects.filter(
            group_id=group_id, user_id=employee_id).first()
        if user_group:
            user_group.delete()

        return Response({"success": True})"""

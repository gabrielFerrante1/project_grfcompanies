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
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        enterprise_id = self.get_enterprise_id(request.user.id)
        signup_user = Authentication.signup(
            self,
            name=name,
            email=email,
            password=password,
            type_account='employee',
            company_id=enterprise_id
        )

        if signup_user == True:
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        else:
            return Response(signup_user, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetail(Base):
    permission_classes = [EmployeesPermission]

    def get(self, request, employee_id):
        employee = self.get_employee(employee_id, request.user.id)

        serializer = EmployeeSerializer(employee)

        return Response(serializer.data)

    def delete(self, request, employee_id):
        # Check employee_id
        self.get_employee(employee_id, request.user.id)

        check_if_owner = User.objects.filter(
            id=employee_id, is_owner=1).exists()
        if check_if_owner:
            raise APIException('Você não pode demitir o dono da empresa')

        enterprise_id = self.get_enterprise_id(employee_id)

        employee = Employee.objects.filter(
            user_id=employee_id, enterprise_id=enterprise_id).first()
        employee.delete()

        User.objects.filter(id=employee_id).delete()

        return Response({'success': True})


class EmployeeGroupsDetail(Base):
    permission_classes = [GroupsPermission]

    def post(self, request, employee_id, group_id):
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

        return Response({"success": True})

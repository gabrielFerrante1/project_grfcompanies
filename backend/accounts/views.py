from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework import status

from accounts.auth import Authentication
from accounts.models import User_Groups, Group_Permissions, User

from companies.models import Employee, Enterprise

class AccountLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = Authentication.signin(self, email=email, password=password)

        enterprise = get_enterprise_user(user.id)

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },
            "enterprise": enterprise,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })


class AccountCreate(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')

        signup_user = Authentication.signup(
            self, name=name, email=email, password=password)

        if signup_user == True:
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        else:
            return Response(signup_user, status=status.HTTP_400_BAD_REQUEST)


class AccountGetUser(APIView):
    def get(self, request):
        user = User.objects.filter(id=request.user.id).first()
        enterprise = get_enterprise_user(user.id)

        return Response({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },
            "enterprise": enterprise 
        })

def get_enterprise_user(user_id):
    enterprise = {
        "is_owner": False,
        "permissions": []
    }
    enterprise['is_owner'] = Enterprise.objects.filter(
        user_id=user_id).exists()
    
    get_employee = Employee.objects.filter(user_id=user_id).first()

    if not get_employee and not enterprise['is_owner']:
        raise APIException('Este funcionário não está registrado em nenhuma empresa', code='company_not_exists' )

    if not enterprise['is_owner']:
        groups = User_Groups.objects.filter(user_id=user_id).all() 

        for group in groups: 
            gp_permission = Group_Permissions.objects.filter(group_id=group.group.id).all()

            for permission in gp_permission:
                enterprise['permissions'].append({
                    "id": permission.permission.id,
                    "label": permission.permission.name,
                    "codename": permission.permission.codename
                })
    
    return enterprise
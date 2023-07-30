from accounts.models import User
from rest_framework import exceptions 
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password 
from companies.models import Enterprise, Employee

class Authentication():
    def signin(self, email=None, password=None): 
        exception_auth = exceptions.AuthenticationFailed(
            'Email e/ou senha incorretos')
     
        if not User.objects.filter(email=email).exists():
            raise exception_auth

        user = User.objects.get(email=email)
        user_password = user.password
        if check_password(password, user_password):
            return user
        else:
            raise exception_auth

    def signup(self, name, email, password, type_account='owner', company_id=False): 
        errors = {}

        if not name or name == '':
            errors['name'] = ['Este campo é obrigatório']
        if not email or email == '':
            errors['email'] = ['Este campo é obrigatório']
        if not password or password == '':
            errors['password'] = ['Este campo é obrigatório']
        if type_account == 'employee' and not company_id:
            errors['company_id'] = ['Este campo é obrigatório']

        if len(errors.keys()) > 0:
            return errors

        user = User 
        if user.objects.filter(email=email).exists():
            errors['email'] = ['Este email já existe na plataforma']

            return errors

        password = make_password(password) 

        created_user = user.objects.create(
            name=name,
            email=email,
            password=password,
            is_owner=0 if type_account == 'employee' else 1
        )

        if type_account == 'owner':
            created_enterprise = Enterprise.objects.create(
                name='Nome da empresa', 
                user_id=created_user.id
            )

        if type_account == 'employee':
            Employee.objects.create(
                enterprise_id=company_id or created_enterprise.id,
                user_id=created_user.id
            ) 

        return True
from rest_framework import serializers
from .models import Employee

from accounts.models import User, User_Groups, Group, Group_Permissions

from django.contrib.auth.models import Permission

class EmployeesSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField() 

    class Meta:
        model = Employee
        fields = ( 
            'id',
            'name',
            'email', 
        )
    
    def get_id(self, obj):
        return obj.user.id
    
    def get_name(self, obj):
        return obj.user.name

    def get_email(self, obj):
        return obj.user.email
    

class EmployeeSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ( 
            'id',
            'name',
            'email', 
            'groups'
        )
    
    def get_id(self, obj):
        return obj.user.id
    
    def get_name(self, obj):
        return obj.user.name

    def get_email(self, obj):
        return obj.user.email
    
    def get_groups(self, obj):
        groupsDB = User_Groups.objects.filter(user_id=obj.user.id).all()
        groups = []
 
        for gpI in groupsDB:
            groups.append({
                "id": gpI.group.id,
                "name": gpI.group.name
            })

        return groups
 
class GroupsSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = (
            'id',
            'name',
            'permissions'
        )
 
    def get_permissions(self, obj):
        groups = Group_Permissions.objects.filter(group_id=obj.id).all()
        permissions = []

        for group in groups:
            permissions.append({
            "id": group.permission.id,
            "label": group.permission.name,
            "codename": group.permission.codename
        })

        return permissions 

class PermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = (
            'id',
            'name',
            'codename'
        )
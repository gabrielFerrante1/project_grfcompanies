# Base
from .base import Base

from django.contrib.auth.models import Permission
from rest_framework.views import Response, status
from rest_framework.exceptions import APIException

from ..utils.permissions import GroupsPermission
from ..utils.exceptions import RequiredFields

from accounts.models import Group, Group_Permissions

from ..serializers import GroupsSerializer

import json

class Groups(Base):
    permission_classes = [GroupsPermission]

    def get(self, request):
        enterprise_id = self.get_enterprise_id(request.user.id)
        groups = Group.objects.filter(enterprise_id=enterprise_id).all()

        serializer = GroupsSerializer(groups, many=True)

        return Response({"groups": serializer.data})

    def post(self, request): 
        body = json.loads(request.body)

        enterprise_id = self.get_enterprise_id(request.user.id)

        name = body.get('name')
        permissions = body.get('permissions')

        if not name:
            raise RequiredFields 

        created_group = Group.objects.create(
            name=name,
            enterprise_id=enterprise_id
        )

        if permissions:
            permissions = permissions.split(",")

            try:
                for item in permissions:
                    permission = Permission.objects.filter(id=item).exists()
                    if not permission:
                        created_group.delete()
                        raise APIException(
                            "A permissão {p} não existe".format(p=item))
                    if not Group_Permissions.objects.filter(group_id=created_group.id, permission_id=item).exists():
                        Group_Permissions.objects.create(
                            group_id=created_group.id, permission_id=item)
            except ValueError:
                created_group.delete()
                raise APIException("Envie as permissões no padrão correto")

        return Response({"success": True})


class GroupsDetail(Base):
    permission_classes = [GroupsPermission]

    def get(self, request, group_id):
        enterprise_id = self.get_enterprise_id(request.user.id)

        self.get_group(group_id, enterprise_id)
        group = Group.objects.filter(id=group_id).first()

        serializer = GroupsSerializer(group)

        return Response({"group": serializer.data})


    def put(self, request, group_id):
        body = json.loads(request.body)

        enterprise_id = self.get_enterprise_id(request.user.id)
        self.get_group(group_id, enterprise_id)

        name = body.get('name')
        permissions = body.get('permissions')

        if name:
            Group.objects.filter(id=group_id).update(
                name=name,
            )

        if permissions:
            permissions = permissions.split(",")

            Group_Permissions.objects.filter(group_id=group_id).delete()

            try:
                for item in permissions:
                    permission = Permission.objects.filter(id=item).exists()

                    if not permission:
                        raise APIException(
                            "A permissão {p} não existe".format(p=item))

                    if not Group_Permissions.objects.filter(group_id=group_id, permission_id=item).exists():
                        Group_Permissions.objects.create(
                            group_id=group_id, permission_id=item)

            except ValueError:
                raise APIException("Envie as permissões no padrão correto")

        return Response({"success": True})
    
    def delete(self, request, group_id):
        enterprise_id = self.get_enterprise_id(request.user.id)

        Group.objects.filter(id=group_id, enterprise_id=enterprise_id).delete()

        return Response({"sucess": True})

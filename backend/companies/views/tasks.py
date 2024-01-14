from companies.views.base import Base
from companies.utils.permissions import TasksPermission
from companies.serializers import TasksSerializer, TaskSerializer
from companies.models import Task, TaskStatus

from rest_framework.response import Response
from rest_framework.exceptions import APIException

import datetime

class Tasks(Base):
    permission_classes = [TasksPermission]

    def get(self, request):
        enterprise_id = self.get_enterprise_id(request.user.id)

        tasks = Task.objects.filter(enterprise_id=enterprise_id).all()

        serializer = TasksSerializer(tasks, many=True)

        return Response({"tasks": serializer.data})
    
    def post(self, request):
        employee_id = request.data.get('employee_id')
        title = request.data.get('title')
        description = request.data.get('description')
        status_id= request.data.get('status_id')
        due_date = request.data.get('due_date')

        employee = self.get_employee(employee_id, request.user.id)
        status = self.get_status(status_id)

        # Validators
        if not title:
            raise APIException('Envie um título válido, para esta tarefa')

        if len(title) > 125:
            raise APIException('O título não pode ter mais de 125 caracteres', 'title_excessive')
        
        if due_date:
            try:
                due_date = datetime.datetime.strptime(due_date, "%d/%m/%Y %H:%M")
            except ValueError:
                raise APIException('A data deve ter o padrão d/m/Y H:M', 'date_invalid')

        task = Task.objects.create(
            title=title,
            description=description,
            due_date=due_date,
            employee_id=employee_id,
            enterprise_id=employee.enterprise.id,
            status_id=status_id
        )

        serializer = TaskSerializer(task)

        return Response({"task": serializer.data})
    

class TaskDetail(Base):
    permission_classes = [TasksPermission]

    def get(self, request, task_id):
        enterprise_id = self.get_enterprise_id(request.user.id)

        task = self.get_task(task_id, enterprise_id)

        serializer = TaskSerializer(task)

        return Response({"task": serializer.data})

    def put(self, request, task_id):

        enterprise_id = self.get_enterprise_id(request.user.id)
        task = self.get_task(task_id, enterprise_id)

        title = request.data.get('title', task.title)
        description = request.data.get('description', task.description)
        status_id = request.data.get('status_id',  task.status.id)
        due_date = request.data.get('due_date', task.due_date) 
        employee_id = request.data.get('employee_id', task.employee.id)

        # Validators
        self.get_status(status_id)
        self.get_employee(employee_id, request.user.id)

        data = {
            "title": title,
            "description": description,  
            "due_date": due_date
        }

        serializer = TaskSerializer(task, data=data , partial=True)

        if not serializer.is_valid(): 
            raise APIException("Não foi possível, editar a tarefa")
        
        serializer.update(task, serializer.validated_data)
        
        task.status_id = status_id
        task.employee_id = employee_id
        task.save()

        return Response({"task": serializer.data})

    def delete(self, request, task_id):
        enterprise_id = self.get_enterprise_id(request.user.id)

        task = self.get_task(task_id, enterprise_id)
        task.delete()

        return Response({"success": True})

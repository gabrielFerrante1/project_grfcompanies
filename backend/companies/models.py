from django.db import models

# Create your models here.
class Enterprise(models.Model):
    name = models.CharField(max_length=155)
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)

class Employee(models.Model):
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    enterprise = models.ForeignKey(Enterprise, on_delete=models.CASCADE)

class TaskStatus(models.Model):
    name = models.TextField()
    codename = models.TextField()

    class Meta:
        db_table = 'companies_task_status'

class Task(models.Model):
    title = models.TextField()
    description = models.TextField(null=True)
    due_date = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)
    status = models.ForeignKey(TaskStatus, on_delete=models.CASCADE)
    enterprise = models.ForeignKey(Enterprise, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)

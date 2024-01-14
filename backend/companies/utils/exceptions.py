from rest_framework.exceptions import APIException

class NotFoundEmployee(APIException):
    status_code = 404
    default_detail = 'O funcionário não pode ser encontrado'
    default_code = 'not_found_employee' 

class NotFoundGroup(APIException):
    status_code = 404
    default_detail = 'O grupo não pode ser encontrado'
    default_code = 'not_found_group'

class RequiredFields(APIException):
    status_code = 400
    default_detail = 'Os campos obrigátorios não foram enviados'
    default_code = 'required_field'

class NotFoundTaskStatus(APIException):
    status_code = 404
    default_detail = 'O status da tarefa é inexistente'
    default_code = 'not_found_task_status'

class NotFoundTask(APIException):
    status_code = 404
    default_detail = 'Essa tarefa não existe'
    default_code = 'not_found_task'
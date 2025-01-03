# app/task_routes.py

from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Task

task_routes = Blueprint('tasks', __name__)

# GET /tasks - Get all tasks
@task_routes.route('/', methods=['GET'])
@login_required
def get_tasks():

  tasks = Task.query.filter_by(user_id = current_user.id).all()
  return jsonify([task.to_dict() for task in tasks])

# POST /tasks - Create new task
@task_routes.route('/', methods=['POST'])
@login_required

def create_task():
  data = request.get_json()

  if not current_user.is_authenticated:
    return jsonify({"errors": {"message": "Unauthorized"}}), 401

  task = Task(
    user_id = current_user.id,
    name = data['name'],
    # Default to empty string if not provided
    description = data.get('description',''),
    priority = data.get('priority', 'low'),  # Add this line
  )

  db.session.add(task)
  db.session.commit()

  # result = task.to_dict()
  # print("Created task:", result)  # Debug log
  # return jsonify(result), 201


  return jsonify(task.to_dict()), 201


# GET /tasks/<id> - Get specific task
@task_routes.route('/<int:task_id>',methods=['GET'])
@login_required
def get_the_task(task_id):

  task = Task.query.filter_by(
    id = task_id,
    user_id = current_user.id
  ).first_or_404()

  return jsonify(task.to_dict())


# PUT /tasks/<id> - Update task
@task_routes.route('/<int:task_id>', methods=['PUT'])
@login_required
def update_task(task_id):
  task = Task.query.filter_by(
    id = task_id,
    user_id = current_user.id
  ).first_or_404()

  data = request.get_json()

  task.name = data.get('name', task.name)
  task.description = data.get('description', task.description)

  db.session.commit()
  return jsonify(task.to_dict())

# DELETE /tasks/<id> - Delete task
@task_routes.route('/<int:task_id>', methods=['DELETE'])
@login_required
def delete_task(task_id):
  task = Task.query.filter_by(
    id = task_id,
    user_id = current_user.id
  ).first_or_404()

  db.session.delete(task)
  db.session.commit()
  return jsonify({'message': 'Task deleted successfully!'})

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import db, Notebook

notebook_routes = Blueprint('notebooks', __name__, url_prefix="/api/notebooks")

@notebook_routes.route('', methods=['GET'])
@login_required
def get_notebooks():
    notebooks = Notebook.query.filter_by(owner_id=current_user.id).all()
    return jsonify([
        {
            'id': notebook.id,
            'name': notebook.name,
            'owner_id': notebook.owner_id,
            'created_at': notebook.created_at.isoformat() if notebook.created_at else None,
            'updated_at': notebook.updated_at.isoformat() if notebook.updated_at else None
        }
        for notebook in notebooks
    ])

@notebook_routes.route('', methods=['POST'])
@login_required
def create_notebook():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Notebook name is required'}), 400
    notebook = Notebook(
        name=name,
        owner_id=current_user.id
    )
    db.session.add(notebook)
    db.session.commit()
    return jsonify({
        'id': notebook.id,
        'name': notebook.name,
        'owner_id': notebook.owner_id,
        'created_at': notebook.created_at,
        'updated_at': notebook.updated_at
    }), 201

@notebook_routes.route('/<int:notebook_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def handle_notebook(notebook_id):
    notebook = Notebook.query.filter_by(
        id=notebook_id,
        owner_id=current_user.id
    ).first_or_404()
    if request.method == 'GET':
        return jsonify({
            'id': notebook.id,
            'name': notebook.name,
            'owner_id': notebook.owner_id,
            'created_at': notebook.created_at,
            'updated_at': notebook.updated_at,
            'notes': [
                {
                    'id': note.id,
                    'title': note.title,
                    'content': note.content,
                    'created_at': note.created_at,
                    'updated_at': note.updated_at
                }
                for note in notebook.notes
            ] if notebook.notes else []
        })
    elif request.method == 'PUT':
        data = request.get_json()
        name = data.get('name')
        if not name:
            return jsonify({'error': 'Notebook name is required'}), 400
        notebook.name = name
        db.session.commit()
        return jsonify({
            'id': notebook.id,
            'name': notebook.name,
            'owner_id': notebook.owner_id,
            'created_at': notebook.created_at,
            'updated_at': notebook.updated_at
        })
    elif request.method == 'DELETE':
        db.session.delete(notebook)
        db.session.commit()
        return jsonify({'message': 'Notebook deleted successfully'}), 204
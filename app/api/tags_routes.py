# # app/api/tags_routes.py
# from flask import Blueprint, jsonify, request
# from flask_login import login_required, current_user
# from app.models import db, Tag, Note, Notebook

#tag_routes = Blueprint('tags', __name__)

# GET /tags - Get all tags for the current user
# @tag_routes.route('', methods=['GET'])
# @login_required
# def get_tags():
#     # Get all tags associated with the current user's notebooks
#     tags = Tag.query.join(Tag.notes).join(Note.notebook).distinct().all()

#     # Prepare the response data with note counts for each tag
#     return jsonify([{
#         'id': tag.id,
#         'name': tag.name,
#         'note_count': len([note for note in tag.notes if note.notebook.owner_id == current_user.id])
#     } for tag in tags])

# # POST /tags - Create a new tag
# @tag_routes.route('/', methods=['POST'])
# @login_required
# def create_tag():
#     data = request.get_json()

#     # Validate the request data
#     if not data or 'name' not in data:
#         return jsonify({'error': 'Tag name is required'}), 400

#     # Check if the tag already exists for the current user
#     existing_tag = Tag.query.filter_by(name=data['name']).first()
#     if existing_tag:
#         # Ensure the existing tag belongs to the current user
#         if any(note.notebook.owner_id == current_user.id for note in existing_tag.notes):
#             return jsonify({
#                 'id': existing_tag.id,
#                 'name': existing_tag.name,
#                 'note_count': len([note for note in existing_tag.notes if note.notebook.owner_id == current_user.id])
#             })
    
#     # Create a new tag if not found
#     tag = Tag(name=data['name'])
#     db.session.add(tag)
#     db.session.commit()

#     return jsonify({
#         'id': tag.id,
#         'name': tag.name,
#         'note_count': 0
#     }), 201

# # DELETE /tags/<id> - Delete a tag by ID for the current user's notes
# @tag_routes.route('/<int:tag_id>', methods=['DELETE'])
# @login_required
# def delete_tag(tag_id):
#     # Get the tag by ID or return a 404 error if not found
#     tag = Tag.query.get_or_404(tag_id)

#     # Remove the tag from the current user's notes
#     user_notes_with_tag = [note for note in tag.notes if note.notebook.owner_id == current_user.id]
#     for note in user_notes_with_tag:
#         note.tags.remove(tag)

#     # If the tag is no longer associated with any notes, delete it
#     if not tag.notes:
#         db.session.delete(tag)

#     db.session.commit()

#     return jsonify({'message': 'Tag deleted successfully'})


# # GET /notes/<note_id>/tags - Get all tags associated with a specific note
# @tag_routes.route('/notes/<int:note_id>/tags', methods=['GET'])
# @login_required
# def get_tags_for_note(note_id):
#     note = Note.query.get_or_404(note_id)

#     # Ensure the note belongs to the current user
#     if note.notebook.owner_id != current_user.id:
#         return jsonify({'error': 'You do not have permission to view this note'}), 403

#     # Get the tags associated with the note
#     tags = note.tags

#     return jsonify([{
#         'id': tag.id,
#         'name': tag.name
#     } for tag in tags])


# # POST /note_tags - Add a tag to a note
# @tag_routes.route('/note_tags', methods=['POST'])
# @login_required
# def add_tag_to_note():
#     data = request.get_json()

#     if not data or 'note_id' not in data or 'tag_id' not in data:
#         return jsonify({'error': 'Note ID and Tag ID are required'}), 400

#     note = Note.query.get_or_404(data['note_id'])
#     tag = Tag.query.get_or_404(data['tag_id'])

#     # Ensure the note belongs to the current user
#     if note.notebook.owner_id != current_user.id:
#         return jsonify({'error': 'You do not have permission to edit this note'}), 403

#     # Check if the tag is already assigned to the note
#     if tag in note.tags:
#         return jsonify({'message': 'Tag already assigned to this note'}), 400

#     # Add the tag to the note
#     note.tags.append(tag)
#     db.session.commit()

#     return jsonify({
#         'message': 'Tag added to note',
#         'note_id': note.id,
#         'tag_id': tag.id
#     }), 201


# # DELETE /note_tags - Remove a tag from a note
# @tag_routes.route('/note_tags', methods=['DELETE'])
# @login_required
# def remove_tag_from_note():
#     data = request.get_json()

#     if not data or 'note_id' not in data or 'tag_id' not in data:
#         return jsonify({'error': 'Note ID and Tag ID are required'}), 400

#     note = Note.query.get_or_404(data['note_id'])
#     tag = Tag.query.get_or_404(data['tag_id'])

#     # Ensure the note belongs to the current user
#     if note.notebook.owner_id != current_user.id:
#         return jsonify({'error': 'You do not have permission to edit this note'}), 403

#     # Remove the tag from the note
#     if tag not in note.tags:
#         return jsonify({'error': 'Tag is not associated with this note'}), 404

#     note.tags.remove(tag)
#     db.session.commit()

#     return jsonify({
#         'message': 'Tag removed from note',
#         'note_id': note.id,
#         'tag_id': tag.id
#     })


# from flask import Blueprint, jsonify, request
# from flask_login import login_required, current_user
# from app.models import db, Tag, Note, Notebook  # Correct import syntax

# tag_routes = Blueprint('tags', __name__)

# # GET /tags - Get all tags for the current user
# @tag_routes.route('/', methods=['GET'])
# @login_required
# def get_tags():
#     # Get all tags associated with the current user's notebooks
#     tags = Tag.query.join(Tag.notes).join(Note.notebook).filter(
#         Notebook.owner_id == current_user.id
#     ).distinct().all()

#     # Prepare the response data with note counts for each tag
#     return jsonify([{
#         'id': tag.id,
#         'name': tag.name,
#         'note_count': len([note for note in tag.notes if note.notebook.owner_id == current_user.id])
#     } for tag in tags])

# # POST /tags - Create a new tag
# @tag_routes.route('/', methods=['POST'])
# @login_required
# def create_tag():
#     data = request.get_json()

#     # Validate the request data
#     if not data or 'name' not in data:
#         return jsonify({'error': 'Tag name is required'}), 400

#     # Check if the tag already exists for the current user
#     existing_tag = Tag.query.filter_by(name=data['name']).first()
#     if existing_tag:
#         # Ensure the existing tag belongs to the current user
#         if any(note.notebook.owner_id == current_user.id for note in existing_tag.notes):
#             return jsonify({
#                 'id': existing_tag.id,
#                 'name': existing_tag.name,
#                 'note_count': len([note for note in existing_tag.notes if note.notebook.owner_id == current_user.id])
#             })
    
#     # Create a new tag if not found
#     tag = Tag(name=data['name'])
#     db.session.add(tag)
#     db.session.commit()

#     return jsonify({
#         'id': tag.id,
#         'name': tag.name,
#         'note_count': 0
#     }), 201

# # DELETE /tags/<id> - Delete a tag by ID for the current user's notes
# @tag_routes.route('/<int:tag_id>', methods=['DELETE'])
# @login_required
# def delete_tag(tag_id):
#     # Get the tag by ID or return a 404 error if not found
#     tag = Tag.query.get_or_404(tag_id)

#     # Remove the tag from the current user's notes
#     user_notes_with_tag = [note for note in tag.notes if note.notebook.owner_id == current_user.id]
#     for note in user_notes_with_tag:
#         note.tags.remove(tag)

#     # If the tag is no longer associated with any notes, delete it
#     if not tag.notes:
#         db.session.delete(tag)

#     db.session.commit()

#     return jsonify({'message': 'Tag deleted successfully'})


from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Tag, Note, Notebook  #this is the correct syntax (app.models)

tag_routes = Blueprint('tags', __name__)

@tag_routes.route('', methods=['GET'])  
@login_required
def get_tags():
    tags = Tag.query.all() 
                # Removed from tags query call .join(Tag.notes).join(Note.notebook)
                #Removed this from query call - .filter(Notebook.owner_id == current_user.id).distinct()
    return jsonify([{
        'id': tag.id,
        'name': tag.name,
        #'note_count': sum(1 for note in tag.notes if note.notebook.owner_id == current_user.id)
    } for tag in tags])


@tag_routes.route('', methods=['POST'])
@login_required
def create_tag():
    data = request.get_json()
    
    # Check if 'name' is provided in the request data
    if not data or 'name' not in data:
        return jsonify({'error': 'Tag name is required'}), 400

    existing_tag = Tag.query.filter_by(name=data['name']).first()
    if existing_tag:
        return jsonify({
            'id': existing_tag.id,
            'name': existing_tag.name,
            'note_count': len(existing_tag.notes)
        })

    # Create and save new tag
    tag = Tag(name=data['name'])
    db.session.add(tag)
    db.session.commit()
    return jsonify({
        'id': tag.id,
        'name': tag.name,
        'note_count': 0
    }), 201

# tag_routes.py
# @tag_routes.route('', methods=['GET'])  
# @login_required
# def get_tags():
#     # Fetch all tags created by the current user, regardless of note association
#     tags = Tag.query.filter(Tag.user_id == current_user.id).all()

#     # Prepare response, including the note count for each tag if desired
#     tag_list = [{
#         'id': tag.id,
#         'name': tag.name,
#         'note_count': sum(1 for note in tag.notes if note.notebook.owner_id == current_user.id)
#     } for tag in tags]

#     return jsonify(tag_list)

# @tag_routes.route('', methods=['POST'])
# @login_required
# def create_tag():
#     data = request.get_json()
    
#     if not data or 'name' not in data:
#         return jsonify({'error': 'Tag name is required'}), 400

#     # Check if the tag already exists for the current user
#     existing_tag = Tag.query.filter_by(name=data['name'], user_id=current_user.id).first()
#     if existing_tag:
#         return jsonify({
#             'id': existing_tag.id,
#             'name': existing_tag.name,
#             'note_count': len(existing_tag.notes)
#         })

#     # Create and save new tag with the user association
#     tag = Tag(name=data['name'], user_id=current_user.id)
#     db.session.add(tag)
#     db.session.commit()

#     return jsonify({
#         'id': tag.id,
#         'name': tag.name,
#         'note_count': 0
#     }), 201

@tag_routes.route('/<int:tag_id>', methods=['DELETE'])
@login_required
def delete_tag(tag_id):
    # I commented all this out
    tag = Tag.query.get_or_404(tag_id)
    db.session.delete(tag)
    db.session.commit()
    return jsonify({'message': 'Tag deleted successfully'}), 204
    
    # # Remove tag only from the current user's notes
    # user_notes_with_tag = [note for note in tag.notes if note.notebook.owner_id == current_user.id]
    # for note in user_notes_with_tag:
    #     note.tags.remove(tag)

    # # Delete the tag only if it's no longer associated with any notes
    # if not tag.notes:
        # db.session.delete(tag)
        # db.session.commit()
        # return jsonify({'message': 'Tag deleted successfully'}), 204
    

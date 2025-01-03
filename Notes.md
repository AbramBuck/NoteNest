# NoteNest
# API Endpoints
Authentication
POST /signup - Create new user account
POST /login - User login
GET /logout - User logout

Notes
GET /notes - Get all notes for current user
POST /notes - Create new note
GET /notes/<id> - Get specific note
PUT /notes/<id> - Update note
DELETE /notes/<id> - Delete note

Notebooks
GET /notebooks - Get all notebooks
POST /notebooks - Create new notebook
GET /notebooks/<id> - Get specific notebook
PUT /notebooks/<id> - Update notebook
DELETE /notebooks/<id> - Delete notebook

Tasks
GET /tasks - Get all tasks
POST /tasks - Create new task
GET /tasks/<id> - Get specific task
PUT /tasks/<id> - Update task
DELETE /tasks/<id> - Delete task

Tags
GET /tags - Get all tags
POST /tags - Create new tag
DELETE /tags/<id> - Delete tag
POST /notes/<note_id>/tags - Add tag to note
DELETE /notes/<note_id>/tags/<tag_id> - Remove tag from note



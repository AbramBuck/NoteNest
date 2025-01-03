from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .user import User



note_tags = db.Table('note_tags',
    db.Model.metadata,                 
    db.Column('note_id', db.Integer, db.ForeignKey(add_prefix_for_prod('notes.id')), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey(add_prefix_for_prod('tags.id')), primary_key=True)
)
if environment == "production":
    note_tags.schema = SCHEMA

class Notebook(db.Model):
    __tablename__ = 'notebooks'

    if environment == "production":
     __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = db.relationship('User', back_populates='notebooks')
    notes = db.relationship('Note', back_populates='notebook')

    def __repr__(self):
        return f"<Notebook(id={self.id}, name={self.name})>"

    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'notes': [note.to_dict() for note in self.notes] 
        }

class Note(db.Model):
    __tablename__ = 'notes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    notebook_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('notebooks.id')), nullable=False)
    title = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    notebook = db.relationship('Notebook', back_populates='notes')
    tags = db.relationship('Tag', secondary=note_tags, back_populates='notes')

    def __repr__(self):
        return f"<Note(id={self.id}, title={self.title})>"

    def to_dict(self):
        return {
            'id': self.id,
            'notebook_id': self.notebook_id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'tags': [tag.to_dict() for tag in self.tags] 
        }

class Tag(db.Model):
    __tablename__ = 'tags'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    notes = db.relationship('Note', secondary=note_tags, back_populates='tags')

    def __repr__(self):
        return f"<Tag(id={self.id}, name={self.name})>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

# class Tag(db.Model):
#     __tablename__ = 'tags'

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(80), nullable=False)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Associate tag with user

#     # Define relationships
#     notes = db.relationship('Note', secondary=note_tags, back_populates='tags')
#     user = db.relationship('User', back_populates='tags')  # Back-reference to User model

#     # Define composite unique constraint on user_id and name
#     __table_args__ = (
#         db.UniqueConstraint('user_id', 'name', name='unique_user_tag'),
#     )

#     def __repr__(self):
#         return f"<Tag(id={self.id}, name={self.name}, user_id={self.user_id})>"

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'name': self.name,
#             'user_id': self.user_id
#         }


class Task(db.Model):
    __tablename__ = 'tasks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=True)
    priority = db.Column(db.String(10), default='low')  # Add this line

    created_at = db.Column(db.DateTime, default=lambda: datetime.now())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(), onupdate=lambda: datetime.now())


    # created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    user = db.relationship('User', back_populates='tasks')

    def __repr__(self):
        return f"<Task(id={self.id}, name={self.name})>"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'priority': self.priority,  # Add this line
            'created_at': self.created_at.strftime('%m/%d/%Y') if self.created_at else None,  
            'updated_at': self.updated_at.strftime('%m/%d/%Y') if self.updated_at else None,  
            # 'created_at': self.created_at,
            # 'updated_at': self.updated_at,
            'user_id': self.user_id,
            'user': self.user.to_dict()  
        }

 
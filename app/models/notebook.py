from .db import db
from datetime import datetime
from flask_login import UserMixin

class Notebook(db.Model, UserMixin):
    __tablename__ = 'notebooks'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
  
    user = db.relationship('User', back_populates='notebooks')

from app.models import db, Note, Tag, environment, SCHEMA
from sqlalchemy.sql import text

def seed_note_tags():
    
    notes = Note.query.all()
    tags = Tag.query.all()

  
    if len(notes) > 0 and len(tags) > 0:
        notes[0].tags.append(tags[0])  
        notes[1].tags.append(tags[1])  
        notes[2].tags.append(tags[2])  
        notes[3].tags.append(tags[1])
        notes[4].tags.append(tags[0])  
        notes[5].tags.append(tags[2])  
        notes[0].tags.append(tags[3])  
        notes[4].tags.append(tags[4])  

  
    db.session.commit()

def undo_note_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.note_tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM note_tags"))
    
    db.session.commit()

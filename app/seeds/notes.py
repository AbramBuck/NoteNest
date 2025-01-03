from app.models import db, Note, Notebook, environment, SCHEMA
from sqlalchemy.sql import text


def seed_notes():
   
    notebooks = Notebook.query.all()

    
    note1 = Note(
        title='My First Note in Personal Notebook',
        content='This is the content of my first personal note.',
        notebook_id=notebooks[0].id 
    )
    note2 = Note(
        title='Work Task - Setup Meeting',
        content='This is a task to set up the next meeting.',
        notebook_id=notebooks[1].id  
    )
    note3 = Note(
        title='Project X - Brainstorming Ideas',
        content='Brainstorming ideas for Project X.',
        notebook_id=notebooks[2].id  
    )
    note4 = Note(
        title='Work Task - Follow up on emails',
        content='Follow up on the emails sent for the project.',
        notebook_id=notebooks[1].id  
    )
    note5 = Note(
        title='Personal Thoughts on Recent Events',
        content='Reflecting on recent events in my personal life.',
        notebook_id=notebooks[0].id  
    )
    note6 = Note(
        title='Project X - Progress Update',
        content='Update on the progress of Project X.',
        notebook_id=notebooks[2].id 
    )

    db.session.add(note1)
    db.session.add(note2)
    db.session.add(note3)
    db.session.add(note4)
    db.session.add(note5)
    db.session.add(note6)


    db.session.commit()


def undo_notes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notes"))
    
    db.session.commit()
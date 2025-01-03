from app.models import db, Notebook, environment, SCHEMA
from sqlalchemy.sql import text

def seed_notebooks():
    notebook1 = Notebook(
        name='Personal Notebook', 
        owner_id=1  
    )
    notebook2 = Notebook(
        name='Work Notebook', 
        owner_id=2 
    )
    notebook3 = Notebook(
        name='Project X Notebook', 
        owner_id=3 
    )
    notebook4 = Notebook(
        name='Daily Notes', 
        owner_id=1  
    )
    notebook5 = Notebook(
        name='Weekly Notes', 
        owner_id=1  
    )
    notebook6 = Notebook(
        name='Journaling', 
        owner_id=1  
    )

    db.session.add(notebook1)
    db.session.add(notebook2)
    db.session.add(notebook3)
    db.session.add(notebook4)
    db.session.add(notebook5)
    db.session.add(notebook6)

    
    db.session.commit()


def undo_notebooks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notebooks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notebooks"))
    
    db.session.commit()

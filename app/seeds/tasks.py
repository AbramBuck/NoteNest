from app.models import db, Task, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_tasks():
    task1 = Task(
        name='Complete project report', 
        description='Finish and submit the final project report', 
        priority ='medium',
        user_id=1,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    task2 = Task(
        name='Team meeting',
        description='Discuss project progress with the team',
        priority ='high',
        user_id=2,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    task3 = Task(
        name='Client call',
        description='Follow up with the client regarding feedback',
        priority ='low',
        user_id=3,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(task1)
    db.session.add(task2)
    db.session.add(task3)
    db.session.commit()


def undo_tasks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tasks"))
        
    db.session.commit()

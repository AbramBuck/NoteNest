from app.models import db, Tag, environment, SCHEMA
from sqlalchemy.sql import text


def seed_tags():
    tag1 = Tag(name='Personal')
    tag2 = Tag(name='Work')
    tag3 = Tag(name='ProjectX')
    tag4 = Tag(name='Ideas')
    tag5 = Tag(name='Tasks')

    db.session.add(tag1)
    db.session.add(tag2)
    db.session.add(tag3)
    db.session.add(tag4)
    db.session.add(tag5)

    db.session.commit()


def undo_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tags"))
    
    db.session.commit()

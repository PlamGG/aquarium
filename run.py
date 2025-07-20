from app import create_app, db
from app.models import Teacher, Subject, Room, ClassSchedule

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Teacher': Teacher, 'Subject': Subject, 'Room': Room, 'ClassSchedule': ClassSchedule}

if __name__ == '__main__':
    app.run(debug=True)

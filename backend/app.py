from flask import Flask, render_template, redirect, url_for, request
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:arjun@localhost/booklet'
db = SQLAlchemy(app)
CORS(app)


# create class of user table, book table
class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(80))

    def __init__(self, username, password, email):
        self.username = username,
        self.email = email
        self.password = password,


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(10000), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    recommendTo = db.Column(db.String(200), nullable=False)
    recommendedBy = db.Column(db.String(200), nullable=False)
    lifeLessons = db.Column(db.String(10000), nullable=False)
    quotes = db.Column(db.String(10000), nullable=False)
    notes = db.Column(db.String(10000), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)

    def __repr__(self):
        return f"Event: {self.description, self.title, self.author, self.recommendTo, self.recommendedBy, self.lifeLessons, self.quotes, self.notes, self.user_id}"

    def __init__(self, description, title, author, recommendTo, recommendedBy, lifeLessons, quotes, notes, user_id):
        self.description = description
        self.title = title
        self.author = author
        self.recommendTo = recommendTo
        self.recommendedBy = recommendedBy
        self.lifeLessons = lifeLessons
        self.notes = notes
        self.quotes = quotes
        self.user_id = user_id


# return the event passed into an easier format
def format_event(event):
    return {
        "description": event.description,
        "title": event.title,
        "author": event.author,
        "recommendTo": event.recommendTo,
        "recommendedBy": event.recommendedBy,
        "lifeLessons": event.lifeLessons,
        "quotes": event.quotes,
        "notes": event.notes,
        "id": event.id,
        "created_at": event.created_at,
        "user_id": event.user_id
    }


# index
@app.route('/')
def index():
    return


# create event
@app.route('/event', methods=['POST'])
def create_event():
    description = request.json['description']
    title = request.json['title']
    author = request.json['author']
    recommendTo = request.json['recommendTo']
    recommendedBy = request.json['recommendedBy']
    lifeLessons = request.json['lifeLessons']
    notes = request.json['notes']
    quotes = request.json['quotes']
    user_id = request.json['user_id']

    event = Note(
        description,
        title,
        author,
        recommendTo,
        recommendedBy,
        lifeLessons,
        quotes,
        notes,
        user_id
    )
    print(event)
    db.session.add(event)
    db.session.commit()
    return format_event(event)


# get all events
@app.route('/events', methods=['GET'])
def get_events():
    events = Note.query.order_by(Note.created_at.asc()).all()
    event_list = []
    for event in events:
        event_list.append(format_event(event))
    return {'events': event_list}


# get one event
@app.route('/event/<id>', methods=['GET'])
def get_event(id):
    event = Note.query.filter_by(id=id).one()
    formatted_event = format_event(event)
    return {'event': formatted_event}


# delete an event
@app.route('/event/<id>', methods=['DELETE'])
def delete_event(id):
    event = Note.query.filter_by(id=id).one()
    db.session.delete(event)
    db.session.commit()
    return f'Event (id: {id}) deleted'


# Update event
@app.route('/event/<id>', methods=['PUT'])
def update_event(id):
    event = Note.query.filter_by(id=id)
    description = request.json['description']
    title = request.json['title']
    author = request.json['author']
    recommendTo = request.json['recommendTo']
    recommendedBy = request.json['recommendedBy']
    lifeLessons = request.json['lifeLessons']
    notes = request.json['notes']
    quotes = request.json['quotes']
    event.update(dict(description=description,
                      created_at=datetime.utcnow(),
                      title=title,
                      author=author,
                      recommendTo=recommendTo,
                      recommendedBy=recommendedBy,
                      lifeLessons=lifeLessons,
                      quotes=quotes,
                      notes=notes
                      ))
    db.session.commit()
    return {'event': format_event(event.one())}


# Create A User
@app.route('/sign_up', methods=['POST'])
def sign_up():
    email = request.json['email']
    username = request.json['username']
    password = request.json['password']
    emailTaken = User.query.filter_by(email=email).first()
    usernameTaken = User.query.filter_by(username=username).first()
    print(User.query.filter_by(email=email).first(),
          User.query.filter_by(username=username).first())
    if emailTaken or usernameTaken:
        return "Your username or email has already been taken"
    user = User(username, password, email)
    db.session.add(user)
    db.session.commit()
    return 'Signed Up'


# Login a user
@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user:
        if user.password == password:
            return f"{user.id}"
    return "Incorrect username or password"


# reset password
@app.route('/reset_password', methods=['POST'])
def reset_password():
    username = request.json['username']
    email = request.json['email']
    new_password = request.json['new_password']
    user = User.query.filter_by(username=username)
    if user:
        user.update(dict(
            username=username,
            email=email,
            password=new_password
        ))
        db.session.commit()
        return "Successfully reset password"
    return "Incorrect username or email"


# gets the password from a user
@app.route('/get_user', methods=['POST'])
def get_user():
    username = request.json['username']
    user = User.query.filter_by(username=username).first()
    if user:
        return user.password


# gets the id from a user
@app.route('/get_user_id', methods=['POST'])
def get_user_id():
    username = request.json['username']
    user = User.query.filter_by(username=username).first()
    if user:
        return f"{user.id} {type(user)}"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

from flask import Flask, render_template, redirect, url_for, request
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:arjun@localhost/booklet'
db = SQLAlchemy(app)
CORS(app)

# create class of user table, booktable, and joining table


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
    userNoteId = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(10000), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    quote1 = db.Column(db.String(100), nullable=False)
    quote2 = db.Column(db.String(100), nullable=False)
    quote3 = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)

    def __repr__(self):
        return f"Event: {self.description, self.title, self.author, self.quote1, self.quote2, self.quote3}"

    def __init__(self, description, title, author, quote1, quote2, quote3, userNoteId):
        self.description = description
        self.title = title
        self.author = author
        self.quote1 = quote1
        self.quote2 = quote2
        self.quote3 = quote3
        self.userNoteId = userNoteId


def format_event(event):
    return {
        "description": event.description,
        "title": event.title,
        "author": event.author,
        "quote1": event.quote1,
        "quote2": event.quote2,
        "quote3": event.quote3,
        "id": event.id,
        "created_at": event.created_at,
        "userNoteId": 1
    }


@app.route('/')
def index():
    return


# create event
@app.route('/event', methods=['POST'])
def create_event():
    description = request.json['description']
    title = request.json['title']
    author = request.json['author']
    quote1 = request.json['quote1']
    quote2 = request.json['quote2']
    quote3 = request.json['quote3']

    event = Note(description, title, author, quote1,
                 quote2, quote3, userNoteId=1)
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
    quote1 = request.json['quote1']
    quote2 = request.json['quote2']
    quote3 = request.json['quote3']
    event.update(dict(description=description,
                      created_at=datetime.utcnow(),
                      title=title,
                      author=author,
                      quote1=quote1,
                      quote2=quote2,
                      quote3=quote3,
                      userNoteId=1))
    db.session.commit()
    return {'event': format_event(event.one())}


# Create A User
@app.route('/signup', methods=['POST', 'GET'])
def signup():
    email = request.json['email']
    username = request.json['username']
    password = request.json['password']
    user = User(username, password, email)
    db.session.add(user)
    db.session.commit()
    return 'Signed Up'


@app.route('/login', methods=['POST', 'GET'])
def login():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    accountInfo = f"""
        Username: {user.username}
        Password: {user.password}
        Email: {user.email}
    """
    if user:
        if user.password == password:
            return "authenticated"
    return "Incorrect username or password"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

import axios from 'axios';
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import bookletLogo from "./images/bookletLogo.png"
import blobBlue from "./images/blobBlue.png"
import blobYellow from "./images/blobYellow.png"
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import noNotes from "./images/noNotes.png"
// start date, end date, who recommended, favorite character, life lessons, who I would recommend this book to

import './App.css';

const baseUrl = "http://127.0.0.1:5000"

function App() {
  /************\
  | USER NOTES |
  \************/
  const [description, setDescription] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const [title, setTitle] = useState("")
  const [editTitle, setEditTitle] = useState("")

  const [author, setAuthor] = useState("")
  const [editAuthor, setEditAuthor] = useState("")

  const [quote1, setQuote1] = useState("")
  const [editQuote1, setEditQuote1] = useState("")

  const [quote2, setQuote2] = useState("")
  const [editQuote2, setEditQuote2] = useState("")

  const [quote3, setQuote3] = useState("")
  const [editQuote3, setEditQuote3] = useState("")

  const [eventList, setEventList] = useState([])
  const [eventId, setEventId] = useState(null)

  const [userNoteId, setUserNoteId] = useState(1)

  /**********\
  | LOGIN IN |
  \**********/

  const [loggedIn, setLoggedIn] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  /***************\
  | MODAL WINDOWS |
  \***************/

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [viewShow, setViewShow] = useState(false);
  const handleViewClose = () => setViewShow(false);
  const handleViewShow = () => setViewShow(true);

  const [bookNoteDetails, setBookNoteDetails] = useState("")


  function handleChange(e, felid, felidName) {
    if (felidName === "description") {
      if (felid === 'edit') {
        setEditDescription(e.target.value)
      } else {
        setDescription(e.target.value)
      }
    } else if (felidName === "title") {
      if (felid === 'edit') {
        setEditTitle(e.target.value)
      } else {
        setTitle(e.target.value)
      }
    } else if (felidName === "author") {
      if (felid === 'edit') {
        setEditAuthor(e.target.value)
      } else {
        setAuthor(e.target.value)
      }
    } else if (felidName === "quote1") {
      if (felid === 'edit') {
        setEditQuote1(e.target.value)
      } else {
        setQuote1(e.target.value)
      }
    } else if (felidName === "quote2") {
      if (felid === 'edit') {
        setEditQuote2(e.target.value)
      } else {
        setQuote2(e.target.value)
      }
    } else if (felidName === "quote3") {
      if (felid === 'edit') {
        setEditQuote3(e.target.value)
      } else {
        setQuote3(e.target.value)
      }
    }
  }
  function handleLoginChange(e, felid) {
    if (felid == "username") {
      setUsername(e.target.value)
    } else if (felid == "password") {
      setPassword(e.target.value)
    }
  }
  async function fetchEvents() {
    const data = await axios.get(`${baseUrl}/events`)
    const { events } = data.data
    setEventList(events)
  }
  async function handleSubmit(e, eventFor) {
    e.preventDefault()
    let inputToValidate
    if (eventFor === 'add') {
      inputToValidate = document.getElementById("description")
    } else {
      inputToValidate = document.getElementById("editDescriptions")
    }
    let errorEl = eventFor === 'add' ? document.getElementById("error") : document.getElementById("editError")
    if (inputToValidate.value) {
      try {
        if (editDescription) {
          const data = await axios.put(`${baseUrl}/event/${eventId}`, {
            "description": editDescription,
            "title": editTitle,
            "author": editAuthor,
            "quote1": editQuote1,
            "quote2": editQuote2,
            "quote3": editQuote3
          })
          const updatedEvent = data.data.event
          const updatedList = eventList.map(event => {
            if (event.id === eventId) {
              return event = updatedEvent
            }
            return event
          })
          setEventList(updatedList)
        } else {
          const data = await axios.post(`${baseUrl}/event`, {
            "description": description,
            "title": title,
            "author": author,
            "quote1": quote1,
            "quote2": quote2,
            "quote3": quote3,
            "userNoteId": userNoteId
          })
          console.log(data.data, { description, title, author, quote1, quote2, quote3 },)
          setEventList([...eventList, data.data])
        }
        setDescription('')
        setEditDescription('')

        setTitle('')
        setEditTitle('')

        setAuthor('')
        setEditAuthor('')

        setQuote2('')
        setEditQuote2('')

        setQuote1('')
        setEditQuote1('')

        setQuote3('')
        setEditQuote3('')
        setEventId(null)
      } catch (err) {
        console.error(err.message)
      }
    } else {
      errorEl.innerHTML = "Please make sure you have entered <i>all</i> the felids"
    }

  }
  async function handleDelete(id) {
    try {
      await axios.delete(`${baseUrl}/event/${id}`)
      const updatedList = eventList.filter(event => event.id !== id)
      setEventList(updatedList)
    } catch (err) {
      console.error(err.message)
    }
  }
  function handleEdit(event) {
    setEventId(event.id)
    setEditDescription(event.description)
    setEditTitle(event.title)
    setEditAuthor(event.author)
    setEditQuote2(event.quote2)
    setEditQuote1(event.quote1)
    setEditQuote3(event.quote3)

  }
  function handleClick(event) {
    console.log(event.title)
    setBookNoteDetails(event)
  }
  useEffect(() => {
    fetchEvents()
  }, [])

  async function handleLogin(username, password) {
    const data = await axios.post(`${baseUrl}/login`, {
      "username": username,
      "password": password
    })
    const { test } = data.data
    return data.data
  }
  return (
    <div className="App">
      <img src={bookletLogo} alt="Booklet logo. A book with 'Booklet' next to it." />
      <img src={blobBlue} className="blueBlob" alt="" />
      <img src={blobYellow} className="yellowBlob" alt="" />
      {!loggedIn ?
        <form className="loginForm">
          <p id="loginError"></p>
          Username: <input type="text" id="username" onChange={(e) => handleLoginChange(e, "username")} /><br />
          Password: <input type="password" id="password" onChange={(e) => handleLoginChange(e, "password")} /><br />
          <a>Forget Password?</a><br /><br />
          <Button type="button" className="primaryBtn" onClick={() => {
            if (username && password) {
              setLoggedIn(true)
              console.log(handleLogin(username, password))
              setUsername("")
              setPassword("")
            } else {
              document.getElementById("loginError").innerHTML = "Please enter all of the felids"
            }
          }}>
            Submit
          </Button>
          <br /><br />
          <Button type="button" className="primaryBtn" onClick={() => console.log("hi")}>
            Sign Up
          </Button>
        </form>

        : <div>

          <br /><br /><br />
          <section>
            <Button type="button" className="primaryBtn" onClick={() => {
              setLoggedIn(false)
            }}>
              Logout
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>New Note</Modal.Title>
              </Modal.Header>
              <form onSubmit={(e) => { handleSubmit(e, 'add') }}>
                <Modal.Body>
                  <p className="error" id="error"></p>
                  <label><h5>Title of Book: </h5></label>
                  <input
                    type="text"
                    onChange={(e) => handleChange(e, "title", "title")}
                    name="title"
                    id="title"
                    placeholder="Title Of Book"
                    value={title}
                  /><br />
                  <label><h6>Author: </h6></label>
                  <input
                    onChange={(e) => handleChange(e, "author", "author")}
                    type="text"
                    name="author"
                    id="author"
                    placeholder="Author"
                    value={author}
                  /><br /><br />
                  <label>Summary/Description Of The Book:</label><br />
                  <textarea
                    className="textarea"
                    onChange={(e) => handleChange(e, "description", "description")}
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Describe"
                    value={description}
                  />
                  <br /><br />
                  <label htmlFor="description">Top Three Quotes: </label>
                  <ul>
                    <li>
                      <input
                        onChange={(e) => handleChange(e, "quote1", "quote1")}

                        type="text"
                        name="quote1"
                        id="quote1"
                        placeholder="Quote 1"
                        value={quote1}
                      /> <br />
                    </li>
                    <li>
                      <input
                        onChange={(e) => handleChange(e, "quote2", "quote2")}
                        type="text"
                        name="quote2"
                        id="quote2"
                        placeholder="Quote 2"
                        value={quote2}
                      /><br />
                    </li>
                    <li>
                      <input
                        onChange={(e) => handleChange(e, "quote3", "quote3")}
                        type="text"
                        name="quote3"
                        id="quote3"
                        placeholder="Quote 3"
                        value={quote3}
                      />
                    </li>
                  </ul>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="primaryBtn" type='submit' onClick={() => {
                    if (document.getElementById("description").value) {
                      handleClose()
                    }
                  }}>
                    Submit
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>
          </section>
          <section>
            {
              eventList.length === 0 ?
                <div className='noNotes'>
                  <img src={noNotes} width="300px" alt="person taking notes" />
                  <h3>Where did all your books notes go!</h3>
                  <h6>You don’t seem to have any book notes!</h6>
                </div> :
                ""
            }

            <ul>
              {eventList.map(event => {
                if (eventId === event.id) {
                  return (
                    <form onSubmit={(e) => { handleSubmit(e, 'add') }}>
                      <p className="error" id="error"></p>
                      <label><h5>Title of Book: </h5></label>
                      <input
                        type="text"
                        onChange={(e) => handleChange(e, "edit", "title")}
                        name="title"
                        id="title"
                        placeholder="Title Of Book"
                        value={editTitle}
                      /><br />
                      <label><h6>Author: </h6></label>
                      <input
                        onChange={(e) => handleChange(e, "edit", "author")}
                        type="text"
                        name="author"
                        id="author"
                        placeholder="Author"
                        value={editAuthor}
                      /><br /><br />
                      <label>Summary/Description Of The Book:</label><br />
                      <textarea
                        className="textarea"
                        onChange={(e) => handleChange(e, "edit", "description")}
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Describe"
                        value={editDescription}
                      />
                      <br /><br />
                      <label htmlFor="description">Top Three Quotes: </label>
                      <ul>
                        <li>
                          <input
                            onChange={(e) => handleChange(e, "edit", "quote1")}

                            type="text"
                            name="quote1"
                            id="quote1"
                            placeholder="Quote 1"
                            value={editQuote1}
                          /> <br />
                        </li>
                        <li>
                          <input
                            onChange={(e) => handleChange(e, "edit", "quote2")}
                            type="text"
                            name="quote2"
                            id="quote2"
                            placeholder="Quote 2"
                            value={editQuote2}
                          /><br />
                        </li>
                        <li>
                          <input
                            onChange={(e) => handleChange(e, "edit", "quote3")}
                            type="text"
                            name="quote3"
                            id="quote3"
                            placeholder="Quote 3"
                            value={editQuote3}
                          />
                        </li>
                      </ul>
                      <Button className="primaryBtn" type='submit' onClick={() => {
                        if (document.getElementById("description").value) {
                          handleClose()
                        }
                      }}>
                        Submit
                      </Button>
                    </form>

                  )
                } else {
                  return (
                    <div>

                      <li key={event.id} className="listItem" onClick={() => { handleClick(event); handleViewShow() }}>
                        {event.title}
                        <span className="listTimeStamp">{format(new Date(event.created_at), "MMM d, yyyy")}</span>
                        <span className="listBtnHolder">
                          <button className="listButton" onClick={() => handleEdit(event)}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                          <button className="listButton" onClick={() => handleDelete(event.id)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </span>
                      </li>
                      <Modal show={viewShow} onHide={handleViewClose}>
                        <Modal.Header closeButton><Modal.Title>{bookNoteDetails.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <h5>Summary:</h5>
                          {bookNoteDetails.description}<br /><br />
                          <h5>Top Three Quotes:</h5>
                          <strong>Quote 1: </strong>"{bookNoteDetails.quote1}"<br />
                          <strong>Quote 2: </strong>"{bookNoteDetails.quote2}"<br />
                          <strong>Quote 3: </strong>"{bookNoteDetails.quote3}"
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setViewShow(false)}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  )
                }
              })}
            </ul>
            <div className='btnContainer'>
              <Button className="primaryBtn addNoteBtn" onClick={handleShow}>
                New Note
              </Button>
            </div>
          </section >
        </div>
      }
    </div >
  );
}

export default App;
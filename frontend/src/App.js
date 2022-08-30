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
import ReactMde from "react-mde"
import ReactMarkdown from 'https://esm.sh/react-markdown@7'
import Showdown from "showdown"
import "react-mde/lib/styles/css/react-mde-all.css";
import './App.css';

const baseUrl = "http://127.0.0.1:5000"

function App() {
  /******************\
  | USER NOTE FIELDS |
  \******************/
  const [description, setDescription] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const [title, setTitle] = useState("")
  const [editTitle, setEditTitle] = useState("")

  const [author, setAuthor] = useState("")
  const [editAuthor, setEditAuthor] = useState("")

  const [quotes, setQuotes] = useState("")
  const [editQuotes, setEditQuotes] = useState("")

  const [recommendedBy, setRecommendedBy] = useState("")
  const [editRecommendedBy, setEditRecommendedBy] = useState("")

  const [lifeLessons, setLifeLessons] = useState("")
  const [editLifeLessons, setEditLifeLessons] = useState("")

  const [recommendTo, setRecommendTo] = useState("")
  const [editRecommendTo, setEditRecommendTo] = useState("")

  const [notes, setNotes] = useState(``)
  const [editNotes, setEditNotes] = useState("")

  const [eventList, setEventList] = useState([])
  const [eventId, setEventId] = useState(null)

  const [userNoteId, setUserNoteId] = useState(undefined)

  /**********\
   | LOGIN IN |
   \**********/

  const [loggedIn, setLoggedIn] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  /*********\
   | SIGN UP |
   \*********/

  const [signUp, setSignUp] = useState(false)

  const [signUpUsername, setSignUpUsername] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")

  /****************\
   | RESET PASSWORD |
   \****************/

  const [resetPassword, setResetPassword] = useState(false)

  const [newPassword, setNewPassword] = useState("")
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState("")
  const [forgetPasswordUsername, setForgetPasswordUsername] = useState("")

  /***************\
   | MODAL WINDOWS |
   \***************/

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [viewShow, setViewShow] = useState(false);
  const handleViewClose = () => setViewShow(false);
  const handleViewShow = () => setViewShow(true);

  const [editShow, setEditShow] = useState(false);
  const handleEditClose = () => setEditShow(false);
  const handleEditShow = () => setEditShow(true);

  const [bookNoteDetails, setBookNoteDetails] = useState("")

  /*****************\
   | MARKDOWN EDITOR |
   \*****************/

  const [selectedTab, setSelectedTab] = React.useState("write");

  const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
  })




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
    } else if (felidName === "quotes") {
      if (felid === 'edit') {
        setEditQuotes(e.target.value)
      } else {
        setQuotes(e.target.value)
      }
    } else if (felidName === "recommendTo") {
      if (felid === 'edit') {
        setEditRecommendTo(e.target.value)
      } else {
        setRecommendTo(e.target.value)
      }
    } else if (felidName === "recommendedBy") {
      if (felid === 'edit') {
        setEditRecommendedBy(e.target.value)
      } else {
        setRecommendedBy(e.target.value)
      }
    } else if (felidName === "lifeLessons") {
      if (felid === 'edit') {
        setEditLifeLessons(e.target.value)
      } else {
        setLifeLessons(e.target.value)
      }
    } else if (felidName === "notes") {
      if (felid === 'edit') {
        setEditNotes(e)
      } else {
        setNotes(e)
      }
    }
  }
  function handleLoginChange(e, felid) {
    if (felid === "username") {
      setUsername(e.target.value)
    } else if (felid === "password") {
      setPassword(e.target.value)
    }
  }
  function handleSignUpChange(e, felid) {
    if (felid === "username") {
      setSignUpUsername(e.target.value)
    } else if (felid === "password") {
      setSignUpPassword(e.target.value)
    } else if (felid === "email") {
      setSignUpEmail(e.target.value)
    }
  }

  function handleResetPasswordChange(e, felid) {
    if (felid === "username") {
      setForgetPasswordUsername(e.target.value)
    } else if (felid === "new_password") {
      setNewPassword(e.target.value)
    } else if (felid === "email") {
      setForgetPasswordEmail(e.target.value)
    }
  }

  async function fetchEvents() {
    const data = await axios.get(`${baseUrl}/events`)
    const { events } = data.data
    const filteredEvents = []
    for (let i = 0; i < events.length; i++) {
      if (events[i].user_id === userNoteId) {
        filteredEvents.push(events[i])
      }
    }
    setEventList(filteredEvents)
  }
  async function handleSubmit(e, eventFor) {
    e.preventDefault()
    let inputToValidate
    if (eventFor === 'add') {
      inputToValidate = title === "" && author === "" && description === ""
    } else {
      inputToValidate = editTitle === "" && editAuthor === "" && editDescription === ""
    }
    let errorEl = eventFor === 'add' ? document.getElementById("error") : document.getElementById("editError")
    if (inputToValidate === false) {
      try {
        if (editDescription) {
          const data = await axios.put(`${baseUrl}/event/${eventId}`, {
            "description": editDescription,
            "title": editTitle,
            "author": editAuthor,
            "recommendTo": editRecommendTo,
            "recommendedBy": editRecommendedBy,
            "lifeLessons": editLifeLessons,
            "quotes": editQuotes,
            "notes": editNotes
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
          const noteId = userNoteId
          const data = await axios.post(`${baseUrl}/event`, {
            "description": description,
            "title": title,
            "author": author,
            "quotes": quotes,
            "recommendTo": recommendTo,
            "recommendedBy": recommendedBy,
            "lifeLessons": lifeLessons,
            "notes": notes,
            "user_id": noteId
          })
          setEventList([...eventList, data.data])
        }
        setDescription('')
        setEditDescription('')

        setTitle('')
        setEditTitle('')

        setAuthor('')
        setEditAuthor('')

        setQuotes('')
        setEditQuotes('')

        setRecommendTo('')
        setEditRecommendTo('')

        setRecommendedBy('')
        setEditRecommendedBy('')

        setLifeLessons('')
        setEditLifeLessons('')

        setNotes('')
        setEditNotes('')

        setEventId(null)
      } catch (err) {
      }
    } else {
      errorEl.innerHTML = "Please make sure you have entered the <i>all required</i> felids"
    }

  }
  async function handleDelete(id) {
    handleViewClose()
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
    setEditQuotes(event.quotes)
    handleEditShow()
  }
  function handleClick(event) {
    setBookNoteDetails(event)
  }
  useEffect(() => {
    fetchEvents()
  }, [loggedIn])
  async function handleLogin(username, password) {
    const data = await axios.post(`${baseUrl}/login`, {
      "username": username,
      "password": password
    }).then(res => {
      return res.data
    })
    return data
  }

  async function handleSignUp(username, email, password) {
    const data = await axios.post(`${baseUrl}/sign_up`, {
      "username": username,
      "password": password,
      "email": email
    }).then(res => {
      return res.data
    })
    return data
  }

  async function handleResetPassword(username, email, new_password) {
    const data = await axios.post(`${baseUrl}/reset_password`, {
      "username": username,
      "email": email,
      "new_password": new_password
    }).then(res => {
      return res.data
    })
    return data
  }

  function generateBookNotePreview(details) {
    const title = details.title
    const author = details.author
    const description = <div><h5>Summary/Description Of The Book</h5>{details.description}<br /><br /></div>
    const recommendedBy = details.recommendedBy === '' ? <span></span> : <div><p>{details.recommendedBy} recommended <i>{details.title}</i> to me</p></div>
    const recommendTo = details.recommendTo === '' ? <span></span> : <div><p>I would recommend <i>{details.title}</i> to {details.recommendTo}</p></div>
    const lifeLessons = details.lifeLessons === '' ? <span></span> : <div><h5>Life Lessons</h5>{details.lifeLessons}<br /><br /></div>
    const quotes = details.quotes === '' ? <span></span> : <div><h5>Favorite Quotes</h5>{details.quotes}</div>
    const notes = details.notes === '' ? <span></span> : <div><h5>Your Notes:</h5><div className='preview-markdown-editor'><ReactMarkdown children={details.notes} className="markdown" /></div></div>
    return {
      "header": <span>{title} by {author}</span>,
      "content": <div>
        {description}
        {recommendedBy}
        {recommendTo}
        {lifeLessons}
        {quotes}
        {notes}
      </div>
    }
  }
  return (
    <div className="App">
      <img src={bookletLogo} alt="Booklet logo. A book with 'Booklet' next to it." />
      <Button type="button" className="primaryBtn " onClick={() => setLoggedIn(false)}>
        Logout
      </Button>
      <img src={blobBlue} className="blueBlob" alt="" />
      <img src={blobYellow} className="yellowBlob" alt="" />
      {signUp ? <form className="loginForm">
        <h3 className='loginFormHeader'>Sign Up</h3>
        <p id="loginErrorSignUp"></p>
        <div className='loginFormFields'>
          Username:<br /> <input type="text" id="signUpUsername" placeholder="Username" className="username" onChange={(e) => handleSignUpChange(e, "username")} /><br />
          Email:<br /> <input type="text" id="signUpEmail" placeholder="Email" className="email" onChange={(e) => handleSignUpChange(e, "email")} /><br />
          Password: <input type="password" id="signUpPassword" placeholder="Password" className="password" onChange={(e) => handleSignUpChange(e, "password")} /><br />
          <Button type="button" className="primaryBtn submitBtn" onClick={() => {
            if (signUpEmail && signUpPassword && signUpUsername) {
              handleSignUp(signUpUsername, signUpEmail, signUpPassword).then(res => {
                if (res === "Signed Up") {
                  setLoggedIn(false)
                  setSignUp(false)
                } else {
                  document.getElementById("loginErrorSignUp").innerHTML = "Your username or email has already been taken"
                }
              })
            } else {
              document.getElementById("loginErrorSignUp").innerHTML = "Please make sure you have entered <i>all</i> of the fields"
            }
          }}>
            Create Account
          </Button>
        </div>:


      </form> :
        resetPassword ?
          <form className="loginForm">
            <h3 className='loginFormHeader'>Reset Password</h3>
            <p id="resetPasswordError"></p>
            <div className='loginFormFields'>
              Username:<br /> <input type="text" id="resetUsername" className="username" placeholder="Username" onChange={(e) => { handleResetPasswordChange(e, "username") }} /><br />
              Email:<br /> <input type="text" id="resetEmail" className="email" placeholder="Email" onChange={(e) => { handleResetPasswordChange(e, "email") }} /><br />
              New Password: <br /><input type="resetPassword" id="password" className="password" placeholder="Password" onChange={(e) => { handleResetPasswordChange(e, "new_password") }} /><br />
              <Button type="button" className="primaryBtn submitBtn" onClick={() => {
                if (forgetPasswordEmail && forgetPasswordUsername && newPassword) {
                  handleResetPassword(forgetPasswordUsername, forgetPasswordEmail, newPassword).then(res => {
                    if (res === "Successfully reset password") {
                      setResetPassword(false)
                    } else {
                      document.getElementById("resetPasswordError").innerHTML = "Incorrect username or email"
                    }
                  })
                } else {
                  document.getElementById("resetPasswordError").innerHTML = "Please make sure you have entered <i>all</i> of the fields"
                }
              }}>
                Reset password
              </Button>
            </div>
          </form> :
          !loggedIn ?
            <form className="loginForm">
              <h3 className='loginFormHeader'>Login</h3>
              <p id="loginError"></p>
              <div className='loginFormFields'>
                Don't Have An Account? <span className="link" onClick={() => {
                  setSignUp(true)
                  setLoggedIn(true)
                }}>Sign Up</span><br /><br />
                Username:<br /> <input type="text" id="username" className="username" placeholder="Username" onChange={(e) => handleLoginChange(e, "username")} /><br />
                Password: <span className='forgetPassword link' onClick={() => { setResetPassword(true) }}>Forget Password?</span><br /><input type="password" id="password" className="username" placeholder="Password" onChange={(e) => handleLoginChange(e, "password")} /><br />
                <Button type="button" className="primaryBtn submitBtn" onClick={() => {
                  if (username && password) {
                    handleLogin(username, password).then(isAuthenticated => {
                      setUserNoteId(parseInt(isAuthenticated))
                      if (!(isNaN(parseInt(isAuthenticated)))) {
                        setLoggedIn(true)
                        setUsername("")
                        setPassword("")
                      } else {
                        document.getElementById("loginError").innerHTML = "Incorrect username or password"
                      }
                    })
                  } else {
                    document.getElementById("loginError").innerHTML = "Please enter all of the felids"
                  }
                }}>
                  Submit
                </Button>
              </div>
            </form>
            : <div>

              <br /><br /><br />
              <section>
                <Modal className="modal-window" show={show} onHide={handleClose} size="lg">
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
                        placeholder="Describe or summarize your book in at three sentences"
                        value={description}
                      ></textarea><br />
                      <b><h5>The Following Felids Are <i>Not</i> Required</h5></b>
                      <label>Who Recommended This Book To You:</label>
                      <input
                        onChange={(e) => handleChange(e, "recommendedBy", "recommendedBy")}

                        type="text"
                        name="recommendedBy"
                        id="recommendedBy"
                        placeholder="Tom Smith"
                        value={recommendedBy}
                      /> <br />
                      <label>Who Would You Recommended This Book To:</label>
                      <input
                        onChange={(e) => handleChange(e, "recommendTo", "recommendTo")}

                        type="text"
                        name="recommendTo"
                        id="recommendTo"
                        placeholder="Adventure lovers"
                        value={recommendTo}
                      /> <br />
                      <label>What Life Lessons Did You learn From This Book:</label><br />
                      <textarea
                        className="textarea"
                        onChange={(e) => handleChange(e, "lifeLessons", "lifeLessons")}
                        type="text"
                        name="lifeLessons"
                        id="lifeLessons"
                        placeholder="What was your takeaway after reading this book"
                        value={lifeLessons}
                      ></textarea><br />
                      <label>Favorite Quotes: </label><br />
                      <textarea
                        className="textarea"
                        onChange={(e) => handleChange(e, "quotes", "quotes")}
                        type="text"
                        name="quotes"
                        id="quotes"
                        placeholder="What were your favorite quotes? Why do you like them?"
                        value={quotes}
                      ></textarea><br />
                      <label><h5>Your Notes</h5></label>
                      <section className="pane editor">
                        <ReactMde
                          value={notes}
                          onChange={(event) => handleChange(event, "notes", "notes")}
                          selectedTab={selectedTab}
                          onTabChange={setSelectedTab}
                          generateMarkdownPreview={(markdown) =>
                            Promise.resolve(converter.makeHtml(markdown))
                          }
                          minEditorHeight={25}
                          minPreviewHeight={25}
                          heightUnits="vh"
                        />
                      </section>
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

                <ul className="noteList">
                  {eventList.map(event => {
                    if (event.user_id === userNoteId) {
                      if (eventId === event.id) {
                        return (
                          <Modal className="modal-window" key={event.id} show={editShow} onHide={handleEditClose} backdrop="static" size="lg">
                            <Modal.Header>
                              <Modal.Title>Edit Note</Modal.Title>
                            </Modal.Header>
                            <p className="error" id="editError"></p>
                            <form onSubmit={(e) => { handleSubmit(e, 'edit') }}>
                              <Modal.Body>
                                <label><h5>Title of Book: </h5></label>
                                <p className="error" id="error"></p>
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
                                <b><h5>The Following Felids Are <i>Not</i> Required</h5></b>
                                <label>Who Recommended This Book To You?</label>
                                <input
                                  onChange={(e) => handleChange(e, "edit", "recommendedBy")}
                                  type="text"
                                  name="recommendedBy"
                                  id="recommendedBy"
                                  placeholder="Tom Smith"
                                  value={editRecommendedBy}
                                /> <br />
                                <label>Who Would You Recommended This Book To?</label>
                                <input
                                  onChange={(e) => handleChange(e, "edit", "recommendTo")}
                                  type="text"
                                  name="recommendTo"
                                  id="recommendTo"
                                  placeholder="Adventure lovers"
                                  value={editRecommendTo}
                                /> <br />
                                <label>What Life Lessons Did You learn From This Book?</label><br />
                                <textarea
                                  className="textarea"
                                  onChange={(e) => handleChange(e, "edit", "lifeLessons")}
                                  type="text"
                                  name="lifeLessons"
                                  id="lifeLessons"
                                  placeholder="What was your takeaway after reading this book"
                                  value={editLifeLessons}
                                ></textarea>
                                <label>Favorite Quotes: </label>
                                <textarea
                                  className="textarea"
                                  onChange={(e) => handleChange(e, "edit", "quotes")}
                                  type="text"
                                  name="quotes"
                                  id="quotes"
                                  placeholder="What were your favorite quotes? Why do you like them?"
                                  value={editQuotes}
                                ></textarea>
                                <section className="pane editor">
                                  <ReactMde
                                    value={editNotes}
                                    onChange={(event) => handleChange(event, "edit", "notes")}
                                    selectedTab={selectedTab}
                                    onTabChange={setSelectedTab}
                                    generateMarkdownPreview={(markdown) =>
                                      Promise.resolve(converter.makeHtml(markdown))
                                    }
                                    minEditorHeight={25}
                                    minPreviewHeight={25}
                                    heightUnits="vh"
                                  />
                                </section>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button className="primaryBtn" type='submit' onClick={() => {
                                  handleViewClose()
                                  handleEditClose()
                                }}>
                                  Submit
                                </Button>
                              </Modal.Footer>
                            </form>
                          </Modal>

                        )
                      } else {
                        const notePreview = generateBookNotePreview(bookNoteDetails)
                        return (
                          <div key={event.id}>
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
                            <Modal className="modal-window" show={viewShow} onHide={handleViewClose} size="lg">
                              <Modal.Header closeButton><Modal.Title>{notePreview.header}</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                {notePreview.content}
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
                    }
                    return "all good"
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
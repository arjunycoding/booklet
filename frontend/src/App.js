import axios from 'axios';
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import React from 'react';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";

import './App.css';

const baseUrl = "http://127.0.0.1:5000"

function App() {
  const [description, setDescription] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [eventList, setEventList] = useState([])
  const [eventId, setEventId] = useState(null)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function handleChange(e, felid) {
    if (felid === 'edit') {
      setEditDescription(e.target.value)
    } else {
      setDescription(e.target.value)
    }
  }
  async function fetchEvents() {
    const data = await axios.get(`${baseUrl}/events`)
    const { events } = data.data
    setEventList(events)
  }
  async function handleSubmit(e, eventFor) {
    e.preventDefault()
    console.log(document.getElementById("description"), document.getElementById("editDescriptions"), "hi")
    let inputToValidate
    if (eventFor === 'add') {
      inputToValidate = document.getElementById("description")
    } else {
      inputToValidate = document.getElementById("editDescriptions")
    }

    console.log(inputToValidate)
    let errorEl = eventFor === 'add' ? document.getElementById("error") : document.getElementById("editError")
    if (inputToValidate.value) {
      try {
        if (editDescription) {
          const data = await axios.put(`${baseUrl}/event/${eventId}`, { description: editDescription })
          const updatedEvent = data.data.event
          const updatedList = eventList.map(event => {
            if (event.id === eventId) {
              return event = updatedEvent
            }
            return event
          })
          setEventList(updatedList)
        } else {
          const data = await axios.post(`${baseUrl}/event`, { description })
          setEventList([...eventList, data.data])
        }
        setDescription('')
        setEditDescription('')
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

  }
  useEffect(() => {
    fetchEvents()
  }, [])
  return (
    <div className="App">
      <section>
        <Button variant="primary" onClick={handleShow}>
          New Note
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>New Note</Modal.Title>
          </Modal.Header>
          <form onSubmit={(e) => { handleSubmit(e, 'add') }}>
            <Modal.Body>
              <p className="error" id="error"></p>
              <label htmlFor="description">Description: </label>
              <input
                onChange={(e) => handleChange(e, "description")}
                type="text"
                name="description"
                id="description"
                placeholder="Describe"
                value={description}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type='submit' onClick={() => {
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
        <ul>
          {eventList.map(event => {
            if (eventId === event.id) {
              return (
                <form onSubmit={(e) => { handleSubmit(e, 'edit') }} key={event.id} className="listItem">
                  <p className="error" id="editError"></p>
                  <input
                    onChange={(e) => handleChange(e, 'edit')}
                    type="text"
                    name="editDescription"
                    id="editDescriptions"
                    placeholder="update"
                    className='editInput'
                    value={editDescription}
                  />
                  <button type="submit">Submit</button>
                </form>
              )
            } else {
              return (
                <li key={event.id} className="listItem">
                  {event.description}
                  <span className="listTimeStamp">{format(new Date(event.created_at), "MMM/dd, p")}</span>
                  <button className="listButton" onClick={() => handleEdit(event)}>Edit</button>
                  <button className="listButton" onClick={() => handleDelete(event.id)}>Delete</button>
                </li>
              )
            }
          })}
        </ul>
      </section>
    </div >
  );
}

export default App;

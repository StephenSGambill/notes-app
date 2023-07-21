import React from "react"
import { useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import "./App.css"


export default function App() {
  const [notes, setNotes] = React.useState(() =>
    JSON.parse(localStorage.getItem("notes")) || "")
  // NB: the above addition of () => ensures that this runs only at the beginning when the app loads, not every time the page re-renders
  //This is called lazy State Initialization
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0]?.id) || ""
  )
  const currentNote = notes.find(note => note.id === currentNoteId)
    || notes[0]


  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);


  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    //next 4 line implements functionality of putting edited note at top of sidebar listing by finding the current note, making an array without it, then unshifting to put it on the front of the array, then setting notes to that new array
    // const currentNote = findCurrentNote()
    const newNoteArray = notes.filter(note => note.id !== currentNote.id)
    newNoteArray.unshift(currentNote)
    setNotes(newNoteArray)

    setNotes(oldNotes => oldNotes.map(oldNote => {
      return oldNote.id === currentNoteId
        ? { ...oldNote, body: text }
        : oldNote
    }))
  }
  //replaced this function which was called 3x to a variable definition above and replaced function call with variable name
  // function findCurrentNote() {
  //   return notes.find(note => {
  //     return note.id === currentNoteId
  //   }) || notes[0]
  // }

  function deleteNote(event, noteId) {
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
  }


  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              handleDelete={deleteNote}
            />
            {
              currentNoteId &&
              notes.length > 0 &&
              <Editor
                currentNote={currentNote}
                updateNote={updateNote}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  )
}

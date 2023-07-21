import React from "react"
import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
import "./App.css"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"


export default function App() {

  const [notes, setNotes] = useState([])
  const [currentNoteId, setCurrentNoteId] = useState("")
  const currentNote = notes.find(note => note.id === currentNoteId)
    || notes[0]
  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);
  const [tempNoteText, setTempNoteText] = useState("")


  useEffect(() => {
    //Websocket connection
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      //Sync up our local notes array with the snapshot data
      const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setNotes(notesArr)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id)
    }
  }, [notes])

  useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body)
    }
  }, [currentNote])

  //Debouncing is to make sure database isn't updated with every keystroke, thus using up Firestore usage limits
  //This implements debouncing, so that when changes are made, it only updates firestore database if there is no input for 1/2 second
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText)

      }
    }, 500)
    return () => { clearTimeout(timeoutId) }
  }, [tempNoteText])


  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const newNoteRef = await addDoc(notesCollection, newNote)
    setCurrentNoteId(newNote.id)
  }

  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId)
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true })
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId)
    await deleteDoc(docRef)
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
              notes={sortedNotes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              handleDelete={deleteNote}
            />

            <Editor
              tempNoteText={tempNoteText}
              setTempNoteText={setTempNoteText}
            />

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

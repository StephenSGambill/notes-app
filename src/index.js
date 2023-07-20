import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

import { createRoot } from "react-dom/client"

const rootElement = document.getElementById('root')
createRoot(rootElement).render(<App />)

// ReactDOM.render(<App />, document.getElementById("root"))

import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/:chatId",
    element: <App />
  }
])

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Failed to find the root element")
}

const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
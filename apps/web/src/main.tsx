import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppProd from './App.tsx'
import AppDemo from './App-demo.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {import.meta.env.VITE_DEMO === 'true' ? <AppDemo /> : <AppProd /> }
    </BrowserRouter>
  </React.StrictMode>,
)

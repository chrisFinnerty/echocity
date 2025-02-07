import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import EventList from './components/EventList/EventList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <BrowserRouter>
        <NavBar />
        <EventList />
      </BrowserRouter>
    </div>
  )
}

export default App

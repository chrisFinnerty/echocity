import { useState } from 'react'
import './App.css'

import EventList from './components/EventList/EventList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <EventList />
    </div>
  )
}

export default App

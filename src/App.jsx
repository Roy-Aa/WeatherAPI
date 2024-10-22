import { useState } from 'react'
import './App.css'
import Card from './assets/Card/Card.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="main">
        <Card></Card>
      </div>
    </>
  )
}

export default App
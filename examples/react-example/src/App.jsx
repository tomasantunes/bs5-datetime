import { useState } from 'react'
import './App.css'
import DateTimePicker from './libs/DateTimePicker.jsx';

function App() {
  const [datetime, setDatetime] = useState(null)

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <DateTimePicker value={datetime} onChange={setDatetime} locale="en-us" />
          </div>
        </div>
      </div>
      
    </>
  )
}

export default App

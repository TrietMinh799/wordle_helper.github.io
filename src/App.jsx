import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [green, setGreen] = useState([])
  const [yellow, setYellow] = useState([])
  const [black, setBlack] = useState([])

  const prev = black.length

  useEffect(() => {
  
  }, [])

  return (
    <div className="App">
      <input name="green" type="text" id="green" onChange={(e) => {setGreen(e.target.value)}} />
      <input name="yellow" type="text" id="yellow" onChange={(e) => {
        setYellow([...yellow, e.target.value])
      }} />
      <input name="discard" type="text" id='discard' onChange={(e) => {
        let current = e.target.value.length
        console.log(current + " " + prev)
        if(current < prev) {
          let new_discard = black.slice(0, black.length - 1) 
          setBlack(new_discard)
        } else 
          setBlack([...black, e.target.value.at(-1)])
      }} />
      {black.map((e, id) => {
        return (
          <div key={id}>
            <p>{e}</p>
          </div>
        )
      })}
    </div>
  );
}

export default App;

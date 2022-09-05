import './App.css';
import { useEffect, useState } from 'react';
import Treemap from './components/Treemap';

function App() {
  const [receivedData, setReceivedData] = useState(false);

  const getData = () => {
    fetch('data.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
    .then(response => response.json())
    .then(result => setReceivedData(result));
  }
  useEffect(()=>{
    if (!receivedData) {
      getData();
    }
    console.log("Data: ");
    console.log(receivedData);
  });

  return (
    <div className="App">
      { receivedData ?
      <div id="treemap-box">
        <Treemap width={window.innerWidth - 50} height={window.innerHeight - 50} data={receivedData}/>
        <ul>
          {receivedData.map((region, i) => 
            <li key={i}>
              <h3>{region.name}</h3>
              <ul>
                {region.children.map((centre, j) =>
                  <li key={j}>{centre.id} — {centre.size} people</li>
                )}
              </ul>
            </li>
          )}
        </ul>
      </div>
      : <h1>Loading...</h1>}
    </div>
  );
}

export default App;
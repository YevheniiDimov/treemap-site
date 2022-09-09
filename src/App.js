import './App.css';
import { useEffect, useState } from 'react';
import Treemap from './components/Treemap';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

function App(props) {
  const [tree, setTree] = useState(false);
  const [token, setToken] = useState(null);

  let updateTree = () => {
    fetch('http://idmvs.ugis.org.ua/api/dboard/get/regions', {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    )
    .then(response => response.json())
    .then(result => {
        let temp = JSON.parse(result).rows;
        console.log('Received tree: ' + temp);

        for (let i = 0; i < temp.length; i++) {
            fetch('http://idmvs.ugis.org.ua/api/dboard/get/offices', {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: {'id_region': temp[i].id_region}
            }
            )
            .then(response => response.json())
            .then(offices => {
                temp[i].offices = offices;
                console.log(`Received offices for ${temp[i].id_region}: ${temp[i].offices}}`);
            });
        }

        setTree(temp);
    });
  }
  let updateToken = () => {
    fetch('https://idmvs.ugis.org.ua/token', {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'scope': 'basic',
            'grant_type': 'client_credentials',
            'state': 'treemap1'
        }
    }
    )
    .then(response => response.json())
    .then(result => {
        setToken(result.access_token);
        console.log('Authorized token: ' + token);
        updateTree();
    });
  }

  useEffect(() => {
    if (token == null) {
      updateToken();
    }
  });

  return (
    <div className="App">
      { tree ?
      <div id="treemap-box">
        <Treemap width={window.innerWidth - 50} height={window.innerHeight - 50} data={tree}/>
      </div>
      : <h1>Loading...</h1>}
    </div>
  );
}

export default App;
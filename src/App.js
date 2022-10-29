import './App.css';
import { useEffect, useState } from 'react';
import ServicesDataController from './components/ServicesDataController'
import TreemapDataController from './components/TreemapDataController';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const options = ["avgm", "minm", "maxm", "cntslots"]
let token = null;

function App() {
  const [tree, setTree] = useState(null);
  const [screenSize, setScreenSize] = useState([window.innerWidth - 5, window.innerHeight - 130]);
  const [selectedOption, setSelectedOption] = useState("avgm");
  const [selectedOffice, setSelectedOffice] = useState(null);

  let updateTree = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    let formdata = new FormData();

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("https://idmvs.ugis.org.ua/api/dboard/get/regions", requestOptions)
    .then(response => response.json())
    .then(async result => {
        let temp = JSON.parse(result).rows.filter(region => region.id_region !== 24);
        let offices_promises = [];

        for (let i = 0; i < temp.length; i++) {
          let myHeaders = new Headers();
          myHeaders.append("Authorization", token);

          let formdata = new FormData();
          formdata.append("id_region", temp[i].id_region);

          let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
          };

          let p = new Promise(async (resolve, reject) => {
            await fetch("https://idmvs.ugis.org.ua/api/dboard/get/offices", requestOptions)
            .then(response => response.json())
            .then(offices => {
              temp[i].children = JSON.parse(offices).rows;
              resolve(0);
            })
            .catch(error => reject(error));
          });

          offices_promises.push(p);
        }

        Promise.all(offices_promises).then(values => {
          console.log('Values: ' + JSON.stringify(values));
          console.log(JSON.stringify(temp));
          setTree(temp.filter(r => r.children));
          //console.log('Received tree: ' + tree);
        })
    });
  }
  
  let updateToken = () => {
    let formdata = new FormData();
    formdata.append("grant_type", "client_credentials");
    formdata.append("client_secret", CLIENT_SECRET);
    formdata.append("client_id", CLIENT_ID);
    formdata.append("scope", "basic");
    formdata.append("state", "treemap1");

    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
      mode: "cors"
    };

    fetch("https://idmvs.ugis.org.ua/token/", requestOptions)
    .then(response => response.json())
    .then(result => {
        token = `${result.token_type} ${result.access_token}`;
        updateTree();
    });
  }

  useEffect(() => {
    if (token == null) {
      updateToken();
    }
  }, [selectedOffice]);

  console.log('Update2910: 0.8.7.5');

  window.addEventListener("resize", () => {
    //console.log("Screen Size change");
    setScreenSize([window.innerWidth - 10, window.innerHeight - 130]);
  });

  return (
    <div className="App">
      <Router>
        <nav className="navbar navbar-light bg-light">
          <div className='container col-4'>
            <NavLink className={({ isActive }) => 
              (isActive ? "nav-link fw-bold" : "nav-link")} to="/">Діаграма</NavLink>
            {selectedOffice ?
            <NavLink className={({ isActive }) => 
              (isActive ? "nav-link fw-bold" : "nav-link")} to="/services">Сервіси офіса {selectedOffice.offices_name}</NavLink>
            : ''}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<TreemapDataController tree={tree} screenSize={screenSize} options={options} 
            selectedOption={selectedOption} token={token} setSelectedOptionHandler={setSelectedOption} 
            setSelectedOfficeHandler={setSelectedOffice}
            />} />
          <Route path="/services" element={<ServicesDataController office_data={selectedOffice} token={token} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
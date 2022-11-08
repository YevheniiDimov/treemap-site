/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import './App.css';
import { useEffect, useState } from 'react';
import ServicesDataController from './components/ServicesDataController'
import TreemapDataController from './components/TreemapDataController';
import MenuImg from "./assets/menu-24px.svg"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
let token = null;

let closeNav = () => {
  let side = document.getElementById("mySidebar");
  side.classList.toggle("active");
  let maindiv = document.getElementById("main");
  maindiv.classList.toggle("mainactive");
  let buttonsdiv =document.getElementById("Buttons");
  if (buttonsdiv.style.display === 'block') {
    buttonsdiv.style.display = 'none';
  } else {
    buttonsdiv.style.display = 'block';
  }
 }

function App() {
  const [tree, setTree] = useState(null);
  const [screenSize, setScreenSize] = useState([window.innerWidth - 53, window.innerHeight - 100]);
  const [selectedOption, setSelectedOption] = useState("accuracy");
  const [options, setOptions] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);

  let updateTree = option => {
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

        let p = 'p_default';

        if (option === 'accuracy') {
          p = new Promise(async (resolve, reject) => {
            await fetch("https://idmvs.ugis.org.ua/api/dboard/get/offices", requestOptions)
            .then(response => response.json())
            .then(async offices => {
              temp[i].children = JSON.parse(offices).rows;
              await fetch("https://idmvs.ugis.org.ua/api/dboard/get/worktime", requestOptions)
              .then(response => response.json())
              .then(async result => {
                let times = JSON.parse(result).rows;
                let worktimes = {};

                for (let time of times) {
                  if (worktimes[time.office_id] !== undefined) {
                    worktimes[time.office_id].avg.push(parseFloat(time.kavg));
                    worktimes[time.office_id].services.push({'name': time.qname, 'avg': time.kavg});
                  } else {
                    worktimes[time.office_id] = {'avg': [], 'services': []};
                  }
                }

                let uniqueServiceNames = [];

                for (let j = 0; j < temp[i].children.length; j++) {
                  let total = 0;
                  let worktime = worktimes[temp[i].children[j].id_offices];
                  if (worktime) {
                    for (let k = 0; k < worktime.length; k++) {
                      total += worktime.avg[k];
                    }

                    let avg = total / worktime.avg.length;

                    for (let service of worktime.services) {
                      if (!uniqueServiceNames.includes(service.name)) {
                        uniqueServiceNames.push(service.name);
                        temp[i].children[j][service.name] = service.avg;
                      }
                    }
                
                    temp[i].children[j].worktime = avg;

                    setOptions(uniqueServiceNames);
                  }
                }
              }).catch(error => reject(error));
            }).catch(error => reject(error));
            resolve(0);
            return temp;
          });
        }

        offices_promises.push(p);
      }

      Promise.all(offices_promises).then(values => {
        //console.log('Values (With Worktime): ' + JSON.stringify(values));
        //console.log(JSON.stringify(temp));
        setTree(temp.filter(r => r.children));
      });
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
        updateTree(selectedOption);
    });
  }

  useEffect(() => {
    if (token == null) {
      updateToken();
    }
  }, [selectedOffice]);

  console.log('Update0611: 0.9');

  window.addEventListener("resize", () => 
    setScreenSize([window.innerWidth - 53, window.innerHeight - 130]));

  return (
    <div className="App text-bg-dark">
      <Router>
      <div>
        <div id="mySidebar" className="sidebar">
          <a className="closebtn" onClick={closeNav}><img src={MenuImg}></img></a>
          <div id='Buttons'>
            
          <button className="btn btn-dark dropdown-toggle" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false">Категорії</button>
          <ul className="collapse" id="collapseExample">
            <li><NavLink className={({ isActive }) => 
              (isActive ? "nav-link dropdown-item fw-bold" : "nav-link dropdown-item")} to="/">Діаграма</NavLink></li>
            {selectedOffice ?
            <li><NavLink className={({ isActive }) => 
              (isActive ? "nav-link dropdown-item fw-bold" : "nav-link dropdown-item")} to="/services">Офіс {selectedOffice.offices_n}</NavLink></li>
            : ''}
          </ul>
          
          <button className="btn btn-dark" href="#">Легенда</button>
          <button className="btn btn-dark" href="#">Гістограма</button>
          <button className="btn btn-dark" href="#">Карта центрів</button>
          </div>
        </div>

          <div id="main" className="text-bg-dark">
            <Routes>
              <Route path="/" element={<TreemapDataController tree={tree} screenSize={screenSize} options={options}
                selectedOption={selectedOption} token={token} setSelectedOptionHandler={setSelectedOption} 
                setSelectedOfficeHandler={setSelectedOffice}
                />} />
              <Route path="/services" element={<ServicesDataController office_data={selectedOffice} token={token} />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
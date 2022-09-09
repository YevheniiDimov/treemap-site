let updateTree = state => {
    fetch('http://idmvs.ugis.org.ua/api/dboard/get/regions', {
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${state.token}`
        }
    }
    )
    .then(response => response.json())
    .then(result => {
        state.tree = JSON.parse(result).rows;
        console.log('Received tree: ' + state.tree);
        for (let i = 0; i < state.tree.length; i++) {
            fetch('http://idmvs.ugis.org.ua/api/dboard/get/offices', {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${state.token}`
                },
                body: {'id_region': state.tree[i].id_region}
            }
            )
            .then(response => response.json())
            .then(offices => {
                state.tree[i].offices = offices;
                console.log(`Received offices for ${state.tree[i].id_region}: ${state.tree[i].offices}}`);
            });
        }
    });
  }
  let updateToken = state => {
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
        state.token = result.access_token;
        console.log('Authorized token: ' + state.token);
        this.updateTree();
    });
  }
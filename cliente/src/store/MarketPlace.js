import React, {Component} from 'react';
import {Stack, Container} from 'react-bootstrap';
import NavigationBar from '../common/NavigationBar.js';
import StoreBanner from './StoreBanner.js';
import config from '../common/config.js';
import axios from 'axios';

class MarketPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
    };
  }

  componentDidMount() {
    const options = {
      url: `${config.host}/store/all`,
      method: 'get',
      params: {
        includeScore: true,
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      console.log(res.data);
      this.setState({stores: res.data.response});
    });
  }

  getStores() {
    // const data = require('../common/stores.json');
    // const stores = data.stores;
    const stores = this.state.stores;
    return stores.map((item, index) => {
      return (<StoreBanner
        id_store={item.id_store}
        name={item.name}
        ownerName={item.ownerName}
        description={item.description}
        score={item.score}
        key={index}/>);
    });
  }

  render() {
    return (
      <div>
        <NavigationBar/>
        <Container className="mt-4">
          <div className="p-5">
            <Stack gap={3}>
              {this.getStores()}
            </Stack>
          </div>
        </Container>
      </div>
    );
  }
}

export default MarketPlace;



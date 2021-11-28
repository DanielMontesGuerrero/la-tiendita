import React, {Component} from 'react';
import {Stack, Container} from 'react-bootstrap';
import NavigationBar from '../common/NavigationBar.js';
import StoreBanner from './StoreBanner.js';

class MarketPlace extends Component {
  getStores() {
    const data = require('../common/stores.json');
    const stores = data.stores;
    return stores.map((item, index) => {
      return (<StoreBanner
        name={item.name}
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



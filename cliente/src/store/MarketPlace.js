import React, {Component} from 'react';
import {
  Stack,
  Row,
  Col,
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown,
  Container} from 'react-bootstrap';
import NavigationBar from '../common/NavigationBar.js';
import StoreBanner from './StoreBanner.js';
import config from '../common/config.js';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class MarketPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      searchName: '',
      orderBy: 'score',
      orderAsc: false,
    };
  }

  componentDidMount() {
    document.title = 'Tienditas';
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
    let stores = JSON.parse(JSON.stringify(this.state.stores));
    stores = stores.filter((item) => {
      const containsInput = item.name
          .toLowerCase()
          .includes(this.state.searchName.toLowerCase());
      return this.state.searchName === '' || containsInput;
    });
    stores = stores.sort((a, b) => {
      if (this.state.orderBy === 'score') {
        if (this.state.orderAsc) {
          return a.score - b.score;
        } else {
          return b.score - a.score;
        }
      } else {
        if (this.state.orderAsc) {
          return b.name.localeCompare(a.name);
        } else {
          return a.name.localeCompare(b.name);
        }
      }
    });
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
          <Row className="px-5">
            <Col>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Buscar"
                  onChange={(e) => this.setState({searchName: e.target.value})}
                />
                <DropdownButton
                  variant="outline-secondary"
                  title="Ordenar"
                  id="input-group-dropdown-2"
                  align="end"
                >
                  <Dropdown.Item href="#"
                    onClick={
                      () => this.setState({orderBy: 'score', orderAsc: true})
                    }
                  >
                    Calificación | <FontAwesomeIcon icon="arrow-up"/>
                  </Dropdown.Item>
                  <Dropdown.Item href="#"
                    onClick={
                      () => this.setState({orderBy: 'score', orderAsc: false})
                    }
                  >
                    Calificación | <FontAwesomeIcon icon="arrow-down"/>
                  </Dropdown.Item>
                  <Dropdown.Item href="#"
                    onClick={
                      () => this.setState({orderBy: 'name', orderAsc: true})
                    }
                  >
                    Nombre | <FontAwesomeIcon icon="arrow-up"/>
                  </Dropdown.Item>
                  <Dropdown.Item href="#"
                    onClick={
                      () => this.setState({orderBy: 'name', orderAsc: false})
                    }
                  >
                    Nombre | <FontAwesomeIcon icon="arrow-down"/>
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Col>
          </Row>
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



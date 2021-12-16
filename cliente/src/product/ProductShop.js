import React, {Component} from 'react';
import {
  Stack,
  Container,
  InputGroup,
  FormControl,
  DropdownButton,
  Col,
  Row,
  Dropdown} from 'react-bootstrap';
import ProductBanner from './ProductBanner.js';
import NavigationBar from '../common/NavigationBar.js';
import config from '../common/config.js';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class ProductShop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      orderBy: 'score',
      searchName: '',
      orderAsc: false,
    };
  }

  componentDidMount() {
    document.title = 'Productos';
    const options = {
      url: `${config.host}/product/all`,
      method: 'get',
      params: {
        includeScore: true,
      },
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    axios(options).then((res) => {
      this.setState({products: res.data.response});
    });
  }

  getProducts() {
    let products = JSON.parse(JSON.stringify(this.state.products));
    products = products.filter((item) => {
      const containsInput = item.name
          .toLowerCase()
          .includes(this.state.searchName.toLowerCase());
      return this.state.searchName === '' || containsInput;
    });
    products = products.sort((a, b) => {
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
    return products.map((item, index) => {
      return (<ProductBanner
        id_product={item.id_product}
        name={item.name}
        image={item.image}
        score={item.score}
        description={item.description}
        quantity={item.quantity}
        unity={item.unity}
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
              {this.getProducts()}
            </Stack>
          </div>
        </Container>
      </div>
    );
  }
}

export default ProductShop;



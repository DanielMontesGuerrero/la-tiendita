import React, {Component} from 'react';
import {Row, Col, Container, Tabs, Tab} from 'react-bootstrap';
import NavigationBar from '../common/NavigationBar.js';
import UserSettings from './UserSettings.js';

class User extends Component {
  render() {
    return (
      <div>
        <NavigationBar/>
        <Container>
          <Row className="mt-3">
            <Col>
              <Tabs
                defaultActiveKey="mi_cuenta"
                transition={false}
                id="noanim-tab-example"
                className="mb-3"
              >
                <Tab eventKey="mi_cuenta" title="Mi cuenta">
                  <UserSettings/>
                </Tab>
                <Tab eventKey="mi_tiendita" title="Mi tiendita">
                </Tab>
                <Tab eventKey="admin" title="Soy admin">
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default User;


import React, {Component} from 'react';
import {Row, Col, Container, Tabs, Tab} from 'react-bootstrap';
import NavigationBar from '../common/NavigationBar.js';
import UserSettings from './UserSettings.js';
import StoreSettings from './StoreSettings.js';
import AdminSettings from './AdminSettings.js';
import UserProfile from '../common/UserProfile';

class User extends Component {
  componentDidMount() {
    if (UserProfile.getName()===null) {
      window.location.href = '/';
    }
  }

  render() {
    let miTiendita = (
      <Tab eventKey="mi_tiendita" title="Mi tiendita">
        <StoreSettings/>
      </Tab>
    );
    let admin = (
      <Tab eventKey="admin" title="Soy admin">
        <AdminSettings/>
      </Tab>
    );
    if (UserProfile.getUserType()==='usuario') {
      miTiendita = <></>;
      admin = <></>;
    } else if (UserProfile.getUserType()==='vendendor') {
      admin = <></>;
    } else if (UserProfile.getUserType()!=='admin') {
      miTiendita = <></>;
      admin = <></>;
    }
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
                {miTiendita}
                {admin}
              </Tabs>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default User;


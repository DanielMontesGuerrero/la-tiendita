import React, {Component} from 'react';
import {Row, Col, Container, Tabs, Tab, Nav} from 'react-bootstrap';
import NavigationBar from '../common/NavigationBar.js';
import UserSettings from './UserSettings.js';
import StoreSettings from './StoreSettings.js';
import AdminSettings from './AdminSettings.js';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import UserProfile from "../common/UserProfile";

class User extends Component {
  componentDidMount(){
    if(UserProfile.getName()===null){
      window.location.href = "/";
    }
  }
  render() {

    let mi_tiendita=
    <Tab eventKey="mi_tiendita" title="Mi tiendita">
      <StoreSettings/>
    </Tab>
    let admin=
    <Tab eventKey="admin" title="Soy admin">
      <AdminSettings/>
    </Tab>
    if(UserProfile.getUserType()==="usuario"){
      mi_tiendita = <></>
      admin = <></>
    }else if(UserProfile.getUserType()==="vendedor"){
      admin = <></>
    }else if(UserProfile.getUserType()!=="admin"){
      mi_tiendita = <></>
      admin = <></>
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
                {mi_tiendita}
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


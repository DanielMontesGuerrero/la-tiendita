import React, {Component} from 'react';
import {Row, Col, Form, Card, Stack, Button, Badge} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Score from '../common/Score.js';

class StoreSettings extends Component {
  render() {
    return (
      <div>
        <Card className="pt-3">
          <Row className="justify-content-center px-4">
            <Col md="auto">
              <Stack gap={2}>
                <Badge
                  bg="dark">
                  Tienda de Daniel
                </Badge>
                <center>
                  <FontAwesomeIcon icon="store" size="10x"/>
                </center>
                <Score score={4.2}/>
              </Stack>
            </Col>
            <Col md="auto">
              <Form>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="nombre">
                  <Form.Label column sm="4">
                    Nombre
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="Tienda de fulano" />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="descripcion">
                  <Form.Label column sm="4">
                    Descripción
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="Bueno bonito y barato ;)" />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="boleta">
                  <Form.Label column sm="4">
                    Boleta
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="" />
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="institucion">
                  <Form.Label column sm="4">
                    Institución
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="ESCOM" />
                  </Col>
                </Form.Group>

              </Form>
            </Col>
          </Row>
          <Stack gap={2} className="col-md-5 mx-auto mb-3 mt-4">
            <Button variant="primary">Inventario</Button>
            <Button variant="primary">Métodos de entrega</Button>
            <Button variant="primary">Métodos de pago</Button>
          </Stack>
        </Card>
      </div>
    );
  }
}

export default StoreSettings;



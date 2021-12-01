/* eslint-disable jsx-a11y/label-has-associated-control */
import { motion } from 'framer-motion';
import { Col, Form, Row } from 'react-bootstrap';
import globalContainerVariants from '../../utils/globalContainerVariants';

import '../assets/styles/views/CreateAmbientView.scss';

export default function CreateAmbientView() {
  return (
    <motion.div
      variants={globalContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      id="createAmbientContainer"
    >
      <h1>Cadastrar novo ambiente</h1>

      <Form>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="inputAmbientName">
              <Form.Label>Nome do ambiente</Form.Label>
              <Form.Control
                type="text"
                placeholder="Insira o nome para identificação do ambiente"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="inputAmbientUrl">
              <Form.Label>Endereço do servidor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Informe o endereço do servidor. Exemplo: https://teste.fluig.com/"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="inputAmbientType">
              <Form.Label>Tipo de ambiente</Form.Label>
              <Form.Select>
                <option selected style={{ display: 'none' }}>
                  Selecione
                </option>
                <option>Produção</option>
                <option>Homologação</option>
                <option>Desenvolvimento</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            {/* <Form.Group className="mb-3" controlId="inputAmbientUrl">
              <Form.Label>Endereço do servidor</Form.Label>
              <Form.Control
                type="email"
                placeholder="Informe o endereço do servidor. Exemplo: https://teste.fluig.com/"
              />
            </Form.Group> */}
          </Col>
        </Row>
      </Form>
    </motion.div>
  );
}

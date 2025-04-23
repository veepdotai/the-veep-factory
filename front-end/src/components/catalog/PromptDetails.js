import { Card, Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';

//import Icon from '../common/Icon';

import { Constants } from "src/constants/Constants";
import { getIcon } from "src/constants/Icons";

import styles from './PromptDetails.module.css';

export default function PromptDetails( {...props } ) {
    const log = Logger.of(PromptDetails.name)

    return (
            <Container>
                <Card className={styles.card}>
                    {/*<Card.Img variant="top" src={Constants.ROOT + props.image} width="50px" />*/}
                    <Card.Header>
                        <Card.Title className="h5">
                            <Row>
                                <Col xs={4}>
                                    {getIcon("dashboard")}
                                </Col>
                                <Col xs={6}>
                                    {props.title}
                                </Col>
                                <Col xs={2}>
                                    {props.reviews}{getIcon("star")} {/*className="ps-1"*/}
                                </Col>
                            </Row>
                        </Card.Title>
                    </Card.Header>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>{props.category} / {props.subCategory}</ListGroup.Item>
                        <ListGroup.Item>{props.description}</ListGroup.Item>
                        <ListGroup.Item>{props.tips1}</ListGroup.Item>
                        <ListGroup.Item>{props.tips2}</ListGroup.Item>
                    </ListGroup>
                    <Card.Body>
                        <Row>
                            <Col>Author: <Card.Link href="#">{props.authorId}</Card.Link></Col>
                            <Col>Org: <Card.Link href="#">{props.organizationId}</Card.Link></Col> 
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
    )
}

import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Wrapper, Status, Map } from "@googlemaps/react-wrapper";

export class SingleRun extends Component {
    constructor(props){
        super()
    }

    render () {
        return (
            <Container fluid>
                <Row>
                    <h1>{this.props.run[0]}</h1>
                </Row>
                <Row>
                    <Wrapper apiKey={""}>
                        <MyMapComponent center={{ lat: -34.397, lng: 150.644 }} zoom={4} />
                    </Wrapper>
                </Row>
            </Container>
        );
    }
}